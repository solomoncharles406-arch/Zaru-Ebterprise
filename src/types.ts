export type PlanType = 'snail' | 'fish' | 'poultry';

export interface PlanConfig {
  id: PlanType;
  title: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roiPercent: number; // 15% or 20%
  durationDays: number; // 14 days
  referralBonusPercent: number; // 10%
  image: string;
  description: string;
  features: string[];
  buttonText: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  bankName: string;
  accountNumber: string; // Exactly 10 digits
  accountName: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number; // Vanishes / resets on bonus withdrawal approval
  referralBonusBalance: number;
  status: 'pending' | 'approved';
  withdrawalsBlocked: boolean;
  createdAt: string;

  // Active Plan & Dividend Commitment Tracking
  activePlan?: {
    planId: PlanType;
    planName: string;
    amount: number;
    purchaseDate: string; // ISO date
    maturityDate: string; // 14 days after purchase
    paymentApproved: boolean;
    paymentApprovedAt?: string;
    proofImage?: string;
    proofSenderName?: string;
    proofReference?: string;
    paymentStatus: 'pending' | 'approved' | 'rejected';
    
    // Dividend Progress
    dividendCommitmentPercent: number; // 0 - 100%, moves daily over 14 days or controlled by admin
    adminOverriddenPercent?: number | null; // if admin set custom %
    dividendWithdrawalCount: number; // 0, 1, or 2
    lastDividendWithdrawalDate?: string;
    isCapitalUnlocked: boolean; // unlocked strictly after 2nd dividend withdrawal
    capitalWithdrawn: boolean;
  } | null;

  lastWithdrawalDate?: string;
  lastBonusWithdrawalDate?: string;

  // Direct admin announcements or messages
  adminNotificationMessage?: string;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'plan_purchase' | 'dividend_withdrawal' | 'bonus_withdrawal' | 'capital_withdrawal';
  planName?: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  bankName: string;
  accountNumber: string;
  accountName: string;
  proofImage?: string;
  notes?: string;
}

export interface SupportMessage {
  id: string;
  userId: string;
  userName: string;
  sender: 'user' | 'admin';
  text: string;
  imageAttachment?: string; // base64 or url
  timestamp: string;
  isRead: boolean;
}

export interface AdminNotification {
  id: string;
  type: 'payment_uploaded' | 'withdrawal_request' | 'bonus_request' | 'new_message' | 'new_registration';
  title: string;
  message: string;
  timestamp: string;
  userId: string;
  read: boolean;
  actionRequired?: boolean;
}

export interface CMSConfig {
  companyName: string;
  subtitle: string;
  companyEmail: string;
  whatsappNumber: string;
  farmAddress: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage?: string;
  farmGalleryImages?: string[];
  logoImage?: string;
  announcementTicker: string[];
  planImages: {
    snail: string;
    fish: string;
    poultry: string;
    logo: string;
  };
}
