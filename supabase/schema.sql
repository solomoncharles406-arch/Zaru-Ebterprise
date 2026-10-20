-- ==============================================================================
-- ZARU ENTERPRISE - SUPABASE DATABASE INITIALIZATION SCRIPT
-- ==============================================================================
-- This script sets up all tables, relations, indexes, triggers, storage buckets,
-- and Row Level Security (RLS) policies for ZARU ENTERPRISE agricultural platform.
--
-- HOW TO RUN IN SUPABASE:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_
-- 2. Go to the "SQL Editor" tab on the left menu.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE (Extends Supabase auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  bank_name TEXT,
  account_number VARCHAR(10),
  account_name TEXT,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  referral_count INTEGER DEFAULT 0,
  referral_bonus_balance NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'blocked')),
  withdrawals_blocked BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  admin_notification_message TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- ==============================================================================
-- 3. ACTIVE PLANS TABLE (User agricultural investment & dividend commitment)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.active_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('snail', 'fish', 'poultry')),
  plan_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  purchase_date TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  maturity_date TIMESTAMPTZ NOT NULL,
  payment_approved BOOLEAN DEFAULT FALSE,
  payment_approved_at TIMESTAMPTZ,
  proof_image TEXT,
  proof_sender_name TEXT,
  proof_reference TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected')),
  dividend_commitment_percent NUMERIC DEFAULT 0 CHECK (dividend_commitment_percent >= 0 AND dividend_commitment_percent <= 100),
  admin_overridden_percent NUMERIC,
  dividend_withdrawal_count INTEGER DEFAULT 0,
  last_dividend_withdrawal_date TIMESTAMPTZ,
  is_capital_unlocked BOOLEAN DEFAULT FALSE,
  capital_withdrawn BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Index for speedy queries by user
CREATE INDEX IF NOT EXISTS idx_active_plans_user_id ON public.active_plans(user_id);

-- ==============================================================================
-- 4. TRANSACTIONS TABLE (Deposits, dividend, capital, and bonus withdrawals)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('plan_purchase', 'dividend_withdrawal', 'bonus_withdrawal', 'capital_withdrawal')),
  plan_name TEXT,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  proof_image TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- ==============================================================================
-- 5. SUPPORT MESSAGES TABLE (Live chat between investor & admin)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  text TEXT NOT NULL,
  image_attachment TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_support_messages_user_id ON public.support_messages(user_id);

-- ==============================================================================
-- 6. ADMIN NOTIFICATIONS TABLE (Alerts for uploaded proofs, requests, registrations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('payment_uploaded', 'withdrawal_request', 'bonus_request', 'new_message', 'new_registration')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- ==============================================================================
-- 7. CMS CONFIG TABLE (Platform settings, contact info, bank details)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cms_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name TEXT NOT NULL DEFAULT 'ZARU ENTERPRISE',
  subtitle TEXT NOT NULL DEFAULT 'Premier Agricultural Investment',
  company_email TEXT NOT NULL DEFAULT 'support@zaruenterprise.com',
  whatsapp_number TEXT NOT NULL DEFAULT '+2348000000000',
  farm_address TEXT NOT NULL DEFAULT 'Km 14, Agro-Industrial Corridor, Ogun State, Nigeria',
  bank_name TEXT NOT NULL DEFAULT 'First Bank of Nigeria',
  bank_account_name TEXT NOT NULL DEFAULT 'ZARU ENTERPRISE AGRO',
  bank_account_number TEXT NOT NULL DEFAULT '3123456789',
  hero_headline TEXT NOT NULL DEFAULT 'Invest in High-Yield Sustainable Agriculture',
  hero_subheadline TEXT NOT NULL DEFAULT 'Earn guaranteed 15% - 20% returns every 14 days with verified Nigerian farm assets.',
  announcement_ticker JSONB DEFAULT '["Now accepting new co-investors for Q4 poultry expansion", "Dividend cycle payout processed for active farms", "Visit our physical farm by booking a scheduled tour"]'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Seed initial CMS config row if not exists
INSERT INTO public.cms_config (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 8. AUTOMATIC USER PROFILE TRIGGER (On Supabase Auth Signup)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_referral_code TEXT;
BEGIN
  -- Generate 6-character referral code if not provided
  v_referral_code := COALESCE(
    NEW.raw_user_meta_data->>'referral_code',
    UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
  );

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    bank_name,
    account_number,
    account_name,
    referral_code,
    referred_by,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'bank_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'account_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'account_name', ''),
    v_referral_code,
    NEW.raw_user_meta_data->>'referred_by',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );

  -- Insert admin notification on new registration
  INSERT INTO public.admin_notifications (user_id, type, title, message, action_required)
  VALUES (
    NEW.id,
    'new_registration',
    'New Investor Registered',
    'Investor ' || COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email) || ' created an account.',
    false
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. ADMIN HELPER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_config ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can read own profile or admin can read all" ON public.profiles;
CREATE POLICY "Users can read own profile or admin can read all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile or admin can update all" ON public.profiles;
CREATE POLICY "Users can update own profile or admin can update all"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- ACTIVE PLANS POLICIES
DROP POLICY IF EXISTS "Users can view own plan or admin can view all" ON public.active_plans;
CREATE POLICY "Users can view own plan or admin can view all"
  ON public.active_plans FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own plan" ON public.active_plans;
CREATE POLICY "Users can insert own plan"
  ON public.active_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users and admin can update plan" ON public.active_plans;
CREATE POLICY "Users and admin can update plan"
  ON public.active_plans FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- TRANSACTIONS POLICIES
DROP POLICY IF EXISTS "Users can view own transactions or admin can view all" ON public.transactions;
CREATE POLICY "Users can view own transactions or admin can view all"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert transactions" ON public.transactions;
CREATE POLICY "Users can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admin can update transactions" ON public.transactions;
CREATE POLICY "Admin can update transactions"
  ON public.transactions FOR UPDATE
  USING (public.is_admin());

-- SUPPORT MESSAGES POLICIES
DROP POLICY IF EXISTS "Users can view their conversation or admin can view all" ON public.support_messages;
CREATE POLICY "Users can view their conversation or admin can view all"
  ON public.support_messages FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users and admin can send messages" ON public.support_messages;
CREATE POLICY "Users and admin can send messages"
  ON public.support_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ADMIN NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Admin can read notifications" ON public.admin_notifications;
CREATE POLICY "Admin can read notifications"
  ON public.admin_notifications FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can update notifications" ON public.admin_notifications;
CREATE POLICY "Admin can update notifications"
  ON public.admin_notifications FOR UPDATE
  USING (public.is_admin());

-- CMS CONFIG POLICIES
DROP POLICY IF EXISTS "Anyone can read CMS config" ON public.cms_config;
CREATE POLICY "Anyone can read CMS config"
  ON public.cms_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admin can update CMS config" ON public.cms_config;
CREATE POLICY "Only admin can update CMS config"
  ON public.cms_config FOR UPDATE
  USING (public.is_admin());

-- ==============================================================================
-- 11. STORAGE BUCKET CONFIGURATION (For Payment Proof Uploads)
-- ==============================================================================
-- Creates 'payment-proofs' storage bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policy: allow authenticated users to upload payment proofs
DROP POLICY IF EXISTS "Allow authenticated uploads to payment-proofs" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to payment-proofs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');

-- Storage RLS policy: allow public reading of payment proofs
DROP POLICY IF EXISTS "Allow public view of payment-proofs" ON storage.objects;
CREATE POLICY "Allow public view of payment-proofs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'payment-proofs');
