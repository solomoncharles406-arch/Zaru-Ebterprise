import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserAccount,
  PlanConfig,
  PlanType,
  TransactionRecord,
  SupportMessage,
  AdminNotification,
  CMSConfig
} from '../types';
import {
  DEFAULT_PLANS,
  DEFAULT_CMS_CONFIG,
  SEED_USERS,
  SEED_TRANSACTIONS,
  SEED_MESSAGES,
  SEED_ADMIN_NOTIFICATIONS
} from '../data/constants';
import { supabase } from '../lib/supabase';

interface AppContextType {
  // State
  users: UserAccount[];
  currentUser: UserAccount | null;
  isAdminLoggedIn: boolean;
  plans: PlanConfig[];
  cmsConfig: CMSConfig;
  transactions: TransactionRecord[];
  messages: SupportMessage[];
  adminNotifications: AdminNotification[];
  welcomeEmailData: { recipientEmail: string; recipientName: string } | null;
  activeTermsModal: boolean;
  
  // Navigation & Admin View Mode
  activeView: 'landing' | 'user_dashboard' | 'admin_dashboard';
  setActiveView: (view: 'landing' | 'user_dashboard' | 'admin_dashboard') => void;
  adminViewingUserId: string | null;
  viewUserDashboardAsAdmin: (userId: string) => void;
  returnToAdminDashboard: () => void;
  rejectBonusWithdrawal: (transactionId: string, reason?: string) => void;
  openTermsModal: () => void;
  closeTermsModal: () => void;
  closeWelcomeEmailModal: () => void;

  // Auth
  registerUser: (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    referredByCode?: string;
  }) => { success: boolean; message: string };
  loginUser: (email: string, password: string, rememberMe?: boolean) => { success: boolean; message: string };
  logoutUser: () => void;
  resetUserPassword: (email: string, newPassword: string) => { success: boolean; message: string };
  switchUserForDemo: (userId: string) => void;

  // Admin Auth
  adminLogin: (username: string, password: string) => { success: boolean; message: string };
  adminLogout: () => void;
  adminResetPassword: (recoveryCode: string, newPassword: string) => { success: boolean; message: string };

  // User Actions
  purchasePlan: (
    userId: string,
    planId: PlanType,
    amount: number,
    proofImage: string,
    senderName: string,
    reference: string
  ) => { success: boolean; message: string };
  requestDividendWithdrawal: (userId: string) => { success: boolean; message: string; amount?: number };
  requestCapitalWithdrawal: (userId: string) => { success: boolean; message: string; amount?: number };
  requestBonusWithdrawal: (userId: string) => { success: boolean; message: string; amount?: number };
  sendUserMessage: (userId: string, text: string, imageAttachment?: string) => void;

  // Admin Actions
  approveUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  toggleWithdrawalBlock: (userId: string) => void;
  updateCommitmentPercent: (userId: string, percent: number) => void;
  confirmPayment: (userId: string, transactionId?: string) => void;
  approveBonusWithdrawal: (userId: string, transactionId: string) => void;
  approveWithdrawalTransaction: (transactionId: string) => void;
  sendAdminMessage: (userId: string, text: string, imageAttachment?: string) => void;
  sendAdminDirectAnnouncement: (userId: string, message: string) => void;
  markMessageAsRead: (messageId: string) => void;
  markAllMessagesAsRead: () => void;
  clearAdminNotification: (notifId: string) => void;
  updateCMSConfig: (newConfig: Partial<CMSConfig>) => void;
  updatePlanImage: (planId: PlanType, imageUrl: string) => void;
  
  // Simulation Helpers
  simulateAdvanceDays: (userId: string, days: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'zaru_users_v2',
  CURRENT_USER: 'zaru_current_user_v2',
  ADMIN_LOGGED_IN: 'zaru_admin_logged_v2',
  CMS_CONFIG: 'zaru_cms_config_v2',
  PLANS: 'zaru_plans_v2',
  TRANSACTIONS: 'zaru_transactions_v2',
  MESSAGES: 'zaru_messages_v2',
  NOTIFICATIONS: 'zaru_notifications_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load stored state or seed
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    // Only auto-restore user session if "Remember Me" was checked by user
    const rememberMe = localStorage.getItem('zaru_remember_me') === 'true';
    if (rememberMe) {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    } else {
      // Or if logged in during this active browser tab session
      const sessionSaved = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (sessionSaved) {
        try { return JSON.parse(sessionSaved); } catch (e) { /* fallback */ }
      }
    }
    // Prompt user to put his/her password unless remember me was checked!
    return null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
  });

  const [plans, setPlans] = useState<PlanConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_PLANS;
  });

  const [cmsConfig, setCmsConfig] = useState<CMSConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CMS_CONFIG);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_CMS_CONFIG;
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_TRANSACTIONS;
  });

  const [messages, setMessages] = useState<SupportMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_MESSAGES;
  });

  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_ADMIN_NOTIFICATIONS;
  });

  const [welcomeEmailData, setWelcomeEmailData] = useState<{ recipientEmail: string; recipientName: string } | null>(null);
  const [activeTermsModal, setActiveTermsModal] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'landing' | 'user_dashboard' | 'admin_dashboard'>('landing');
  const [adminViewingUserId, setAdminViewingUserId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CMS_CONFIG, JSON.stringify(cmsConfig));
  }, [cmsConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  // Keep currentUser in sync with users state
  useEffect(() => {
    if (currentUser) {
      const updated = users.find(u => u.id === currentUser.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
        setCurrentUser(updated);
      }
    }
  }, [users]);

  // Automatic daily dividend progression calculation
  // "on the user dashboard once payment is made and approved by the admin the 'dividend commitment progress' should start moving automatically on daily basis and should be filled to 100% after on the 14th day."
  useEffect(() => {
    setUsers(prevUsers => {
      let changed = false;
      const updated = prevUsers.map(user => {
        if (!user.activePlan || !user.activePlan.paymentApproved || user.activePlan.adminOverriddenPercent !== undefined && user.activePlan.adminOverriddenPercent !== null) {
          return user;
        }

        // Calculate days passed since payment was approved
        const startTime = new Date(user.activePlan.paymentApprovedAt || user.activePlan.purchaseDate).getTime();
        const now = Date.now();
        const diffDays = Math.max(0, (now - startTime) / (1000 * 60 * 60 * 24));
        
        // Target percent: reaches 100% at 14 days
        // If 2nd withdrawal is done, progress stops adding up as required
        if (user.activePlan.dividendWithdrawalCount >= 2) {
          return user;
        }

        const calculatedPercent = Math.min(100, Math.round((diffDays / 14) * 100));
        if (calculatedPercent !== user.activePlan.dividendCommitmentPercent) {
          changed = true;
          return {
            ...user,
            activePlan: {
              ...user.activePlan,
              dividendCommitmentPercent: Math.max(user.activePlan.dividendCommitmentPercent, calculatedPercent),
            }
          };
        }
        return user;
      });
      return changed ? updated : prevUsers;
    });
  }, []);

  const openTermsModal = () => setActiveTermsModal(true);
  const closeTermsModal = () => setActiveTermsModal(false);
  const closeWelcomeEmailModal = () => setWelcomeEmailData(null);

  // USER REGISTRATION
  const registerUser = (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    referredByCode?: string;
  }) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An investor account with this email already exists. Please log in.' };
    }

    // Account number validation: exactly 10 figures
    const cleanAccNo = userData.accountNumber.replace(/\D/g, '');
    if (cleanAccNo.length !== 10) {
      return { success: false, message: 'Nigerian bank account number must be exactly 10 digits.' };
    }

    // Generate unique referral code
    const initials = userData.fullName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'AGR';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newReferralCode = `ZARU-${initials}${randNum}`;

    let referredByFound = false;
    if (userData.referredByCode?.trim()) {
      const codeUpper = userData.referredByCode.trim().toUpperCase();
      // Credit referrer
      setUsers(prev => prev.map(u => {
        if (u.referralCode.toUpperCase() === codeUpper) {
          referredByFound = true;
          return {
            ...u,
            referralCount: u.referralCount + 1,
            referralBonusBalance: u.referralBonusBalance + 3000, // standard welcome referral bonus increment
          };
        }
        return u;
      }));
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      fullName: userData.fullName.trim(),
      email: cleanEmail,
      phone: userData.phone.trim(),
      password: userData.password,
      bankName: userData.bankName,
      accountNumber: cleanAccNo,
      accountName: userData.accountName.trim(),
      referralCode: newReferralCode,
      referredBy: userData.referredByCode?.trim() || undefined,
      referralCount: 0,
      referralBonusBalance: 0,
      status: 'pending', // Awaits admin approval
      withdrawalsBlocked: false,
      createdAt: new Date().toISOString(),
      activePlan: null,
      adminNotificationMessage: 'Welcome to ZARU ENTERPRISE! Your registration is complete. Choose an agro plan below to begin.',
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Add admin notification
    const newNotif: AdminNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'new_registration',
      title: 'New Investor Registered',
      message: `${newUser.fullName} (${newUser.email}) registered with account ${newUser.accountNumber} (${newUser.bankName}). Pending approval.`,
      timestamp: new Date().toISOString(),
      userId: newUser.id,
      read: false,
      actionRequired: true,
    };
    setAdminNotifications(prev => [newNotif, ...prev]);

    // Send welcome email (triggers email modal preview and stores note)
    setWelcomeEmailData({
      recipientEmail: cleanEmail,
      recipientName: userData.fullName,
    });

    // Background sync to Supabase Auth so password recovery & Supabase DB stay in sync
    try {
      supabase.auth.signUp({
        email: cleanEmail,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName.trim(),
            phone: userData.phone.trim(),
            bank_name: userData.bankName,
            account_number: cleanAccNo,
            account_name: userData.accountName.trim(),
            referral_code: newReferralCode,
            referred_by: userData.referredByCode?.trim() || null,
            role: 'user',
          },
        },
      }).catch(err => console.debug('Supabase background signup:', err?.message));
    } catch (e) {
      // Safe fallback
    }

    return {
      success: true,
      message: `Registration successful! Welcome email dispatched to ${cleanEmail}.`
    };
  };

  // USER LOGIN
  // "each time user want to log in to his/her account he should be prompted to put his password except he clicked on remember me box"
  const loginUser = (email: string, password: string, rememberMe = false) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'No registered investor account found with this email.' };
    }
    if (user.password && user.password !== password) {
      return { success: false, message: 'Invalid password. Please check and try again, or use "Forgot Password".' };
    }

    if (rememberMe) {
      localStorage.setItem('zaru_remember_me', 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.removeItem('zaru_remember_me');
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    // Sync Supabase Auth session in background
    try {
      supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      }).catch(err => console.debug('Supabase background signin:', err?.message));
    } catch (e) {
      // Safe fallback
    }

    setCurrentUser(user);
    return { success: true, message: `Welcome back, ${user.fullName}!` };
  };

  const logoutUser = () => {
    try {
      supabase.auth.signOut().catch(() => {});
    } catch (e) {}
    localStorage.removeItem('zaru_remember_me');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setCurrentUser(null);
  };

  // USER PASSWORD RESET
  const resetUserPassword = (email: string, newPassword: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'No investor account found with this email address.' };
    }
    setUsers(prev => prev.map(u => u.email.toLowerCase() === cleanEmail ? { ...u, password: newPassword } : u));
    if (currentUser?.email.toLowerCase() === cleanEmail) {
      setCurrentUser(prev => prev ? { ...prev, password: newPassword } : null);
    }
    return { success: true, message: 'Your password has been successfully reset. Please log in with your new credentials.' };
  };

  const switchUserForDemo = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // ADMIN AUTH
  // Admin credentials: Username = "Zagaru2026@", Password = "Zazarusap2026@$"
  const adminLogin = (username: string, password: string) => {
    if (username.trim() === 'Zagaru2026@' && password === 'Zazarusap2026@$') {
      setIsAdminLoggedIn(true);
      return { success: true, message: 'Admin authentication verified. Access granted to ZARU Executive Control Center.' };
    }
    return { success: false, message: 'Invalid Admin username or password. Check credentials.' };
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminViewingUserId(null);
  };

  const adminResetPassword = (recoveryKey: string, newPassword: string) => {
    if (recoveryKey.trim() === 'ZARU-ADMIN-RECOVER-2026') {
      return { success: true, message: `Admin password temporarily restored to: Zazarusap2026@$` };
    }
    return { success: false, message: 'Invalid Admin Recovery Secret Key.' };
  };

  // PURCHASE PLAN & UPLOAD PAYMENT
  const purchasePlan = (
    userId: string,
    planId: PlanType,
    amount: number,
    proofImage: string,
    senderName: string,
    reference: string
  ) => {
    const targetPlan = plans.find(p => p.id === planId);
    if (!targetPlan) {
      return { success: false, message: 'Invalid plan selected.' };
    }
    if (amount < targetPlan.minAmount) {
      return { success: false, message: `Minimum amount for ${targetPlan.name} is ₦${targetPlan.minAmount.toLocaleString()}.` };
    }
    if (amount > targetPlan.maxAmount) {
      return { success: false, message: `Maximum plan allocation is ₦${targetPlan.maxAmount.toLocaleString()}.` };
    }

    const now = new Date();
    const maturity = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return { success: false, message: 'User not found.' };

    const newTxn: TransactionRecord = {
      id: `TXN-${Date.now()}`,
      userId,
      userName: targetUser.fullName,
      userEmail: targetUser.email,
      type: 'plan_purchase',
      planName: targetPlan.name,
      amount,
      date: now.toISOString(),
      status: 'pending',
      bankName: targetUser.bankName,
      accountNumber: targetUser.accountNumber,
      accountName: targetUser.accountName,
      proofImage,
      notes: `Transfer from ${senderName}. Ref: ${reference}`,
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Update user active plan
    // If user already had previous completed cycles and is buying a new plan:
    // "AFTER A USER HAVE WITHDRAW HIS/HER FIRST AND SECOND DIVIDEND WITH HIS/HER CAPITAL. THE OLD DEVIDEND COMMIT PROGRESS INFORMATION SHOULD WIPE ONCE THE USER BUY ANOTHER PLAN"
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          activePlan: {
            planId,
            planName: targetPlan.name,
            amount,
            purchaseDate: now.toISOString(),
            maturityDate: maturity.toISOString(),
            paymentApproved: false,
            proofImage,
            proofSenderName: senderName,
            proofReference: reference,
            paymentStatus: 'pending',
            dividendCommitmentPercent: 0,
            adminOverriddenPercent: null,
            dividendWithdrawalCount: 0, // Reset for new plan!
            isCapitalUnlocked: false,
            capitalWithdrawn: false,
          }
        };
      }
      return u;
    }));

    // Admin notification: "once a new investor make payment, admin should be get a notification"
    const newNotif: AdminNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'payment_uploaded',
      title: 'New Plan Payment Uploaded',
      message: `${targetUser.fullName} submitted ₦${amount.toLocaleString()} for ${targetPlan.name}. Transfer Ref: ${reference}. Proof attached.`,
      timestamp: now.toISOString(),
      userId,
      read: false,
      actionRequired: true,
    };
    setAdminNotifications(prev => [newNotif, ...prev]);

    return {
      success: true,
      message: `Payment proof uploaded successfully! The Admin has been notified and will verify your transfer to Moniepoint Account 6394899106 within 24-48 hours.`
    };
  };

  // CONFIRM PAYMENT (ADMIN)
  // "dividend should start counting once a user make payment and the admin confirms the payment."
  // "when a user send his referral link to any one to register through his link it will reflect on his referial bonus once the person invest"
  const confirmPayment = (userId: string, transactionId?: string) => {
    const now = new Date();
    const maturity = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const payingUser = users.find(u => u.id === userId);
    const investedAmount = payingUser?.activePlan?.amount || 0;
    const planTitle = payingUser?.activePlan?.planName || 'Agro Plan';

    // 1. Approve paying user's plan and initiate 14-day dividend cycle
    setUsers(prev => {
      let updatedUsers = prev.map(u => {
        if (u.id === userId && u.activePlan) {
          return {
            ...u,
            status: 'approved' as const,
            activePlan: {
              ...u.activePlan,
              paymentApproved: true,
              paymentApprovedAt: now.toISOString(),
              purchaseDate: now.toISOString(),
              maturityDate: maturity.toISOString(),
              paymentStatus: 'approved' as const,
              dividendCommitmentPercent: Math.max(u.activePlan.dividendCommitmentPercent, 7), // starts active on Day 1
            }
          };
        }
        return u;
      });

      // 2. If user was referred through a referral link, credit the referrer's bonus now that the person has invested!
      if (payingUser?.referredBy && investedAmount > 0) {
        const refCodeUpper = payingUser.referredBy.trim().toUpperCase();
        const bonusRate = 0.10; // 10% referral bonus on investment
        const bonusAmount = Math.round(investedAmount * bonusRate);

        updatedUsers = updatedUsers.map(u => {
          if (u.referralCode.toUpperCase() === refCodeUpper) {
            return {
              ...u,
              referralCount: u.referralCount + 1,
              referralBonusBalance: u.referralBonusBalance + bonusAmount,
            };
          }
          return u;
        });

        // Add transaction record for the referrer's bonus
        const referrer = prev.find(u => u.referralCode.toUpperCase() === refCodeUpper);
        if (referrer) {
          const bonusTxn: TransactionRecord = {
            id: `TXN-REF-${Date.now()}`,
            userId: referrer.id,
            userName: referrer.fullName,
            userEmail: referrer.email,
            type: 'bonus_withdrawal',
            planName: `Referral Bonus (10% on ${payingUser.fullName}'s ${planTitle})`,
            amount: bonusAmount,
            date: now.toISOString(),
            status: 'approved',
            bankName: referrer.bankName,
            accountNumber: referrer.accountNumber,
            accountName: referrer.accountName,
            notes: `10% referral commission earned from ${payingUser.fullName} (₦${investedAmount.toLocaleString()} invested). Credited to balance!`,
          };
          setTransactions(tPrev => [bonusTxn, ...tPrev]);

          const bonusNotif: AdminNotification = {
            id: `NOTIF-${Date.now()}`,
            type: 'bonus_request',
            title: 'Referral Bonus Credited',
            message: `₦${bonusAmount.toLocaleString()} (10%) credited to ${referrer.fullName} because referred investor ${payingUser.fullName} funded ${planTitle}.`,
            timestamp: now.toISOString(),
            userId: referrer.id,
            read: false,
          };
          setAdminNotifications(nPrev => [bonusNotif, ...nPrev]);
        }
      }

      return updatedUsers;
    });

    // Update matching payment transaction
    setTransactions(prev => prev.map(t => {
      if (transactionId ? t.id === transactionId : (t.userId === userId && t.type === 'plan_purchase' && t.status === 'pending')) {
        return { ...t, status: 'approved' };
      }
      return t;
    }));
  };

  // DIVIDEND WITHDRAWAL
  // "User can only withdraw capital if he/she have withdraw his or her dividend twice (that is 14 days and another 14days)"
  // "user can withdraw only dividend at the end of 14days"
  // "DIVIDEND MUST STOP ADDING UP AFTER THE SECOND WITHRAWAL."
  const requestDividendWithdrawal = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.activePlan) {
      return { success: false, message: 'No active plan found.' };
    }
    if (user.withdrawalsBlocked) {
      return { success: false, message: 'Withdrawals are currently restricted for your account. Please contact administrative support.' };
    }
    if (!user.activePlan.paymentApproved) {
      return { success: false, message: 'Your payment is still pending confirmation by Admin.' };
    }
    if (user.activePlan.dividendCommitmentPercent < 100) {
      return {
        success: false,
        message: `Dividend commitment bar is currently at ${user.activePlan.dividendCommitmentPercent}%. Full dividend matures on the 14th day (100%).`
      };
    }
    if (user.activePlan.dividendWithdrawalCount >= 2) {
      return {
        success: false,
        message: 'You have already withdrawn your 1st and 2nd cycle dividends. Dividend additions have stopped. Please request your Capital withdrawal now!'
      };
    }

    const planConfig = plans.find(p => p.id === user.activePlan?.planId);
    const roiRate = planConfig ? planConfig.roiPercent / 100 : 0.15;
    const grossDividend = user.activePlan.amount * roiRate;
    const mgmtFee = grossDividend * 0.02; // 2% fee as per Terms & Conditions 11.1
    const netDividend = grossDividend - mgmtFee;

    const newWithdrawalCount = user.activePlan.dividendWithdrawalCount + 1;
    const isNowCapitalUnlocked = newWithdrawalCount >= 2;
    const nowIso = new Date().toISOString();

    const newTxn: TransactionRecord = {
      id: `TXN-${Date.now()}`,
      userId,
      userName: user.fullName,
      userEmail: user.email,
      type: 'dividend_withdrawal',
      planName: user.activePlan.planName,
      amount: netDividend,
      date: nowIso,
      status: 'approved',
      bankName: user.bankName,
      accountNumber: user.accountNumber,
      accountName: user.accountName,
      notes: `Cycle ${newWithdrawalCount} Dividend (${planConfig?.roiPercent}% ROI less 2% mgmt fee). Disbursed to ${user.bankName}.`,
    };

    setTransactions(prev => [newTxn, ...prev]);

    setUsers(prev => prev.map(u => {
      if (u.id === userId && u.activePlan) {
        return {
          ...u,
          lastWithdrawalDate: nowIso,
          activePlan: {
            ...u.activePlan,
            dividendWithdrawalCount: newWithdrawalCount,
            lastDividendWithdrawalDate: nowIso,
            isCapitalUnlocked: isNowCapitalUnlocked,
            // If completed 1st dividend, start cycle 2 (set progress to 0% to run 2nd 14 days)
            // If completed 2nd dividend, progress stays 100% and freezes
            dividendCommitmentPercent: isNowCapitalUnlocked ? 100 : 0,
            adminOverriddenPercent: isNowCapitalUnlocked ? 100 : null,
          }
        };
      }
      return u;
    }));

    return {
      success: true,
      amount: netDividend,
      message: `Cycle ${newWithdrawalCount} dividend payout of ₦${netDividend.toLocaleString()} processed! Sent to ${user.bankName} (${user.accountNumber}). ${isNowCapitalUnlocked ? 'Your CAPITAL is now unlocked for withdrawal!' : 'Cycle 2 has commenced for your next 14 days dividend.'}`
    };
  };

  // CAPITAL WITHDRAWAL
  // "AFTER THE SECOND WITHDRAWAL , THE CAPITAL WILL BE UNLOCKED, NO EXTRA AMOUNT SHOULD ADD TO CAPITAL WHILE REQUESTING FOR CAPITAL WITHRAWAL (IT SHOUL BE JUST THE AMOUNT OF THE CAPITAL USER DEPOSITED ONLY)."
  const requestCapitalWithdrawal = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.activePlan) {
      return { success: false, message: 'No active plan found.' };
    }
    if (user.withdrawalsBlocked) {
      return { success: false, message: 'Withdrawals are currently restricted for your account. Please contact administrative support.' };
    }
    if (user.activePlan.dividendWithdrawalCount < 2) {
      return {
        success: false,
        message: 'Strict Policy: You can only withdraw your capital after completing and withdrawing your dividend TWICE (Cycle 1 & Cycle 2).'
      };
    }
    if (user.activePlan.capitalWithdrawn) {
      return {
        success: false,
        message: 'Capital for this cycle has already been disbursed. You can purchase a new plan to begin a fresh farm cycle.'
      };
    }

    const exactCapital = user.activePlan.amount; // Strictly exact amount deposited, no additions
    const nowIso = new Date().toISOString();

    const newTxn: TransactionRecord = {
      id: `TXN-${Date.now()}`,
      userId,
      userName: user.fullName,
      userEmail: user.email,
      type: 'capital_withdrawal',
      planName: user.activePlan.planName,
      amount: exactCapital,
      date: nowIso,
      status: 'approved',
      bankName: user.bankName,
      accountNumber: user.accountNumber,
      accountName: user.accountName,
      notes: `Capital refund after 2 successful dividend cycles. Exact principal amount: ₦${exactCapital.toLocaleString()}.`,
    };

    setTransactions(prev => [newTxn, ...prev]);

    setUsers(prev => prev.map(u => {
      if (u.id === userId && u.activePlan) {
        return {
          ...u,
          lastWithdrawalDate: nowIso,
          activePlan: {
            ...u.activePlan,
            capitalWithdrawn: true,
          }
        };
      }
      return u;
    }));

    return {
      success: true,
      amount: exactCapital,
      message: `Capital withdrawal of ₦${exactCapital.toLocaleString()} approved! Credited to ${user.bankName} (${user.accountNumber}). You may now purchase a new plan anytime.`
    };
  };

  // BONUS WITHDRAWAL (USER)
  // "admin should know when user request to withdraw his or her referral bonus"
  // "add button for bonus withdrawal"
  const requestBonusWithdrawal = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'User not found.' };
    if (user.withdrawalsBlocked) {
      return { success: false, message: 'Withdrawals are currently blocked for your account by Admin.' };
    }
    if (user.referralBonusBalance <= 0) {
      return { success: false, message: 'You currently have ₦0 referral bonus balance.' };
    }

    const amount = user.referralBonusBalance;
    const nowIso = new Date().toISOString();

    const newTxn: TransactionRecord = {
      id: `TXN-${Date.now()}`,
      userId,
      userName: user.fullName,
      userEmail: user.email,
      type: 'bonus_withdrawal',
      amount,
      date: nowIso,
      status: 'pending', // Awaits admin approval
      bankName: user.bankName,
      accountNumber: user.accountNumber,
      accountName: user.accountName,
      notes: `Referral bonus withdrawal request for ${user.referralCount} active referrals.`,
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Admin notification
    const newNotif: AdminNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'bonus_request',
      title: 'Referral Bonus Withdrawal Request',
      message: `${user.fullName} requested referral bonus withdrawal of ₦${amount.toLocaleString()} (${user.referralCount} referrals).`,
      timestamp: nowIso,
      userId,
      read: false,
      actionRequired: true,
    };
    setAdminNotifications(prev => [newNotif, ...prev]);

    return {
      success: true,
      amount,
      message: `Referral bonus withdrawal request for ₦${amount.toLocaleString()} submitted to Admin for approval.`
    };
  };

  // APPROVE BONUS WITHDRAWAL (ADMIN)
  // "Once a user request for referral and approved by the admin, the number of referral on the user's dashboard should vanish"
  const approveBonusWithdrawal = (userId: string, transactionId: string) => {
    const nowIso = new Date().toISOString();

    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return { ...t, status: 'approved' };
      }
      return t;
    }));

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          referralCount: 0, // Referral count vanishes as requested!
          referralBonusBalance: 0,
          lastBonusWithdrawalDate: nowIso,
          lastWithdrawalDate: nowIso,
        };
      }
      return u;
    }));

    // Synchronously update currentUser so the referral count vanishes immediately on user's dashboard
    setCurrentUser(prev => prev && prev.id === userId ? {
      ...prev,
      referralCount: 0,
      referralBonusBalance: 0,
      lastBonusWithdrawalDate: nowIso,
      lastWithdrawalDate: nowIso,
    } : prev);
  };

  const approveWithdrawalTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return { ...t, status: 'approved' };
      }
      return t;
    }));
  };

  // ADMIN USER MANAGEMENT
  const approveUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
  };

  // "make the delete button in the admin dashboard to be responsive"
  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setTransactions(prev => prev.filter(t => t.userId !== userId));
    setMessages(prev => prev.filter(m => m.userId !== userId));
    setAdminNotifications(prev => prev.filter(n => n.userId !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
    if (adminViewingUserId === userId) {
      setAdminViewingUserId(null);
    }
  };

  const rejectBonusWithdrawal = (transactionId: string, reason?: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return { ...t, status: 'rejected', notes: reason ? `Rejected: ${reason}` : 'Declined by Administrator' };
      }
      return t;
    }));
  };

  // "Admin should be able to view user's dashboard"
  const viewUserDashboardAsAdmin = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setAdminViewingUserId(userId);
      setActiveView('user_dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const returnToAdminDashboard = () => {
    setAdminViewingUserId(null);
    setActiveView('admin_dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWithdrawalBlock = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, withdrawalsBlocked: !u.withdrawalsBlocked } : u));
  };

  // "admin should be able to control Dividend Commitment Progress from Admin Dashboard"
  const updateCommitmentPercent = (userId: string, percent: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    setUsers(prev => prev.map(u => {
      if (u.id === userId && u.activePlan) {
        return {
          ...u,
          activePlan: {
            ...u.activePlan,
            dividendCommitmentPercent: clamped,
            adminOverriddenPercent: clamped,
          }
        };
      }
      return u;
    }));
  };

  // USER & ADMIN COMMUNICATION
  // "on the user dashboard, add where user can communicate with admin. message sent through this rout should display on the admin dashboard"
  // "on the user and admin communication rout, user should be able to upload images as a message ot type letters if he/se wants"
  const sendUserMessage = (userId: string, text: string, imageAttachment?: string) => {
    const user = users.find(u => u.id === userId);
    const newMsg: SupportMessage = {
      id: `MSG-${Date.now()}`,
      userId,
      userName: user ? user.fullName : 'Investor',
      sender: 'user',
      text: text.trim(),
      imageAttachment,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, newMsg]);

    // Admin notification
    const newNotif: AdminNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'new_message',
      title: 'New Message from Investor',
      message: `${user?.fullName || 'Investor'}: "${text.slice(0, 45)}${text.length > 45 ? '...' : ''}"${imageAttachment ? ' [Image Attached]' : ''}`,
      timestamp: new Date().toISOString(),
      userId,
      read: false,
      actionRequired: true,
    };
    setAdminNotifications(prev => [newNotif, ...prev]);
  };

  const sendAdminMessage = (userId: string, text: string, imageAttachment?: string) => {
    const newMsg: SupportMessage = {
      id: `MSG-${Date.now()}`,
      userId,
      userName: 'ZARU Admin Support',
      sender: 'admin',
      text: text.trim(),
      imageAttachment,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const sendAdminDirectAnnouncement = (userId: string, message: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, adminNotificationMessage: message } : u));
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => {
      const target = prev.find(m => m.id === messageId);
      if (!target || target.isRead) return prev;
      return prev.map(m => m.id === messageId ? { ...m, isRead: true } : m);
    });
    setAdminNotifications(prev =>
      prev.map(n => {
        if (n.type === 'new_message') {
          return { ...n, read: true };
        }
        return n;
      })
    );
  };

  const markAllMessagesAsRead = () => {
    setMessages(prev => {
      const hasUnread = prev.some(m => !m.isRead);
      if (!hasUnread) return prev;
      return prev.map(m => ({ ...m, isRead: true }));
    });
    setAdminNotifications(prev =>
      prev.map(n => n.type === 'new_message' ? { ...n, read: true } : n)
    );
  };

  const clearAdminNotification = (notifId: string) => {
    setAdminNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  // CMS UPDATES
  // "the admin should be able to make changes, upload images to the landing page and the website in general"
  const updateCMSConfig = (newConfig: Partial<CMSConfig>) => {
    setCmsConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updatePlanImage = (planId: PlanType, imageUrl: string) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, image: imageUrl } : p));
    setCmsConfig(prev => ({
      ...prev,
      planImages: {
        ...prev.planImages,
        [planId]: imageUrl,
      }
    }));
  };

  // Helper for evaluation / testing: Fast-forward cycle days
  const simulateAdvanceDays = (userId: string, days: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId && u.activePlan) {
        const addedPercent = Math.round((days / 14) * 100);
        const newPercent = Math.min(100, u.activePlan.dividendCommitmentPercent + addedPercent);
        return {
          ...u,
          activePlan: {
            ...u.activePlan,
            dividendCommitmentPercent: newPercent,
            adminOverriddenPercent: newPercent,
          }
        };
      }
      return u;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        isAdminLoggedIn,
        plans,
        cmsConfig,
        transactions,
        messages,
        adminNotifications,
        welcomeEmailData,
        activeTermsModal,
        activeView,
        setActiveView,
        adminViewingUserId,
        viewUserDashboardAsAdmin,
        returnToAdminDashboard,
        rejectBonusWithdrawal,
        openTermsModal,
        closeTermsModal,
        closeWelcomeEmailModal,
        registerUser,
        loginUser,
        logoutUser,
        resetUserPassword,
        switchUserForDemo,
        adminLogin,
        adminLogout,
        adminResetPassword,
        purchasePlan,
        requestDividendWithdrawal,
        requestCapitalWithdrawal,
        requestBonusWithdrawal,
        sendUserMessage,
        approveUserStatus,
        deleteUser,
        toggleWithdrawalBlock,
        updateCommitmentPercent,
        confirmPayment,
        approveBonusWithdrawal,
        approveWithdrawalTransaction,
        sendAdminMessage,
        sendAdminDirectAnnouncement,
        markMessageAsRead,
        markAllMessagesAsRead,
        clearAdminNotification,
        updateCMSConfig,
        updatePlanImage,
        simulateAdvanceDays,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
