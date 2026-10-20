import { PlanConfig, CMSConfig, UserAccount, TransactionRecord, SupportMessage, AdminNotification } from '../types';

export const ASSET_IMAGES = {
  logo: '/src/assets/images/zaru_real_logo_1792497380304.jpg',
  snail: '/src/assets/images/snail_investment_plan_1792280552721.jpg',
  fish: '/src/assets/images/fish_investment_plan_1792280565057.jpg',
  poultry: '/src/assets/images/poultry_investment_plan_1792280578424.jpg',
  seedlings: '/src/assets/images/hero_seedlings_farm_1792283408997.jpg',
};

export const DEFAULT_PLANS: PlanConfig[] = [
  {
    id: 'snail',
    title: 'Snail Plan',
    name: 'Snail Plan',
    minAmount: 30000,
    maxAmount: 20000000,
    roiPercent: 15,
    durationDays: 14,
    referralBonusPercent: 10,
    image: ASSET_IMAGES.snail,
    description: 'High-yield snail farming with low mortality rate and high market demand.',
    features: [
      'Minimum Plan: ₦30,000',
      'Maximum Plan: ₦20,000,000',
      'Guaranteed Yield: 15% ROI',
      'Cycle Duration: 14 Days',
      'Referral Bonus: 10%',
      'Daily Commitment Tracking'
    ],
    buttonText: 'BUY SNAIL PLAN',
  },
  {
    id: 'fish',
    title: 'Fish Plan',
    name: 'Fish Plan',
    minAmount: 100000,
    maxAmount: 20000000,
    roiPercent: 15,
    durationDays: 14,
    referralBonusPercent: 10,
    image: ASSET_IMAGES.fish,
    description: 'Catfish and Tilapia aquaculture in controlled environments for maximum growth.',
    features: [
      'Minimum Plan: ₦100,000',
      'Maximum Plan: ₦20,000,000',
      'Guaranteed Yield: 15% ROI',
      'Cycle Duration: 14 Days',
      'Referral Bonus: 10%',
      'Automated Feeding & Aeration'
    ],
    buttonText: 'BUY FISH PLAN',
  },
  {
    id: 'poultry',
    title: 'Poultry Plan',
    name: 'Poultry Plan',
    minAmount: 200000,
    maxAmount: 20000000,
    roiPercent: 20,
    durationDays: 14,
    referralBonusPercent: 10,
    image: ASSET_IMAGES.poultry,
    description: 'Broiler production cycles optimized for rapid returns and food security.',
    features: [
      'Minimum Plan: ₦200,000',
      'Maximum Plan: ₦20,000,000',
      'Premium Yield: 20% ROI',
      'Cycle Duration: 14 Days',
      'Referral Bonus: 10%',
      'Veterinary & Insurance Backed'
    ],
    buttonText: 'BUY POULTRY PLAN',
  },
];

export const DEFAULT_CMS_CONFIG: CMSConfig = {
  companyName: 'ZARU ENTERPRISE',
  subtitle: 'Agricultural Financing & Sustainable Farm Cycles',
  companyEmail: 'zaruenterprise@gmail.com',
  whatsappNumber: '09131376638',
  farmAddress: 'Km 14, Ibadan-Ife Agricultural Growth Corridor, Oyo State, Nigeria',
  bankName: 'Moniepoint',
  bankAccountName: 'Zaru Enterprise Farm',
  bankAccountNumber: '6394899106',
  heroHeadline: 'Secure Agricultural Co-Farming in Nigeria with Guaranteed 14-Day Returns',
  heroSubheadline: 'Empowering smart Nigerian investors through transparent livestock and aquaculture cycles. Direct peer-assisted farm allocation with up to 20% ROI.',
  heroImage: ASSET_IMAGES.seedlings,
  logoImage: ASSET_IMAGES.logo,
  farmGalleryImages: [ASSET_IMAGES.poultry, ASSET_IMAGES.fish, ASSET_IMAGES.snail],
  announcementTicker: [
    '🔔 Emeka O. from Lagos just purchased Poultry Plan (₦200,000)',
    '🌾 Amina B. from Kano bought Snail Plan (₦30,000)',
    '💰 Adebayo K. from Ibadan withdrew 1st cycle dividend (₦30,000)',
    '🐟 Chioma E. from Enugu purchased Fish Plan (₦50,000)',
    '⭐ Babatunde M. from Abuja received referral bonus payout (₦20,000)',
    '🚜 ZARU Farm Cycle #48 successfully harvested in Oyo State',
    '🛡️ Moniepoint Escrow Active: All payouts processed in 24-48 hours'
  ],
  planImages: {
    snail: ASSET_IMAGES.snail,
    fish: ASSET_IMAGES.fish,
    poultry: ASSET_IMAGES.poultry,
    logo: ASSET_IMAGES.logo,
  },
};

export const TERMS_AND_CONDITIONS_TEXT = `TERMS AND CONDITIONS FOR ZARU ENTERPRISE

Welcome to ZARU ENTERPRISE. These Terms and Conditions ("Terms") govern your use of our website, mobile platform, and investment services. By creating an account or investing, you agree to these Terms.

1. ABOUT ZARU ENTERPRISE
ZARU ENTERPRISE is a registered agricultural firm in Nigeria involved in crop farming, livestock, agro-processing, and farm produce trading. We provide an opportunity for members of the public to co-invest in our agricultural projects and earn returns based on farm yields and trading profits.
Our platform operates as Zaru a peer-assisted agricultural financing platform.

2. DEFINITIONS
• ZARU ENTERPRISE is our company name.
• Investor/User means any person who creates an account and invests.

3. ELIGIBILITY
3.1. You must be 18 years or older.
3.2. You must provide accurate KYC information: Full Name, Valid Phone Number, Email, and Bank Account.
3.3. One account per person. Multiple accounts will be banned.
3.4. ZARU reserves the right to reject any registration.

4. NATURE OF INVESTMENT
4.1. Your investment is used directly for agricultural purposes including but not limited to: farm land lease, seedlings, fertilizers, livestock feeds, labour, storage and logistics.
4.2. This is NOT a banking deposit. It is an agricultural co-investment.
4.3. Returns are based on agricultural output and market performance.
4.4. Minimum Investment: NGN 30,000. Maximum Investment: NGN 20,000,000 per slot. Investing above 20,000,000 will lead to automatic ban and forfeiture of the money.

5. HOW IT WORKS: PURCHASE PLAN & REQUEST WITHDRAWAL
5.1. PURCHASE PLAN: You select an amount to buy. Your funds are allocated to an active farm cycle. Pledge duration is 14 days.
5.2. DIVIDEND: After 14 days, you are eligible for up to 15% to 20% dividend on your purchased plan amount, subject to farm yield.
5.3. REQUEST WITHDRAWAL: After maturity, you can request your capital + dividend after two time withdraw of only dividend via the request withdrawal button on your dashboard.
5.4. Approval is done by the system admin. Payouts are processed within 24 to 48 hours.
5.5. You must have an active "Request withdrawal" to be eligible for withdrawal.

6. RISK DISCLOSURE
6.1. Agriculture involves risks: weather, pests, disease, market price fluctuation.
6.2. While ZARU takes all measures to secure investments through insurance and best practices, we do not guarantee 100% capital protection in cases of force majeure (flood, drought, fire, government policy).
6.3. By investing, you acknowledge and accept these risks.
6.4. Past performance does not guarantee future returns.

7. PAYMENTS & WITHDRAWALS
7.1. All payments are in Nigerian Naira (NGN).
7.2. Deposits must be made to the company's official account displayed on your dashboard only.
7.3. Withdrawals are only to the bank account registered in your name.
7.4. ZARU will never ask for your password or ask you to pay to a personal account.

8. USER OBLIGATIONS
8.1. You must keep your login details confidential.
8.2. You must not use the platform for money laundering or fraud.
8.3. You must not create fake payment proofs.
8.4. Any attempt to manipulate the system will lead to permanent ban and forfeiture of funds.

9. COMPANY OBLIGATIONS
9.1. To manage funds transparently and provide regular farm updates.
9.2. To process withdrawal requests fairly and timely.
9.3. To maintain data privacy and security.

10. CANCELLATION & REFUND
10.1. A purchase plan can be cancelled within 2 hours if not yet approved.
10.2. After approved, cancellation is not possible until maturity.
10.3. In case of proven system error, a refund will be processed within 7 working days.

11. FEES
11.1. ZARU charges a 2% management fee on dividends earned. This is deducted automatically.
11.2. No hidden charges.

ACCOUNT SUSPENSION & TERMINATION
We reserve the right to suspend or terminate accounts that violate these Terms, provide false information, or engage in fraudulent activity.

LIMITATION OF LIABILITY
ZARU ENTERPRISE shall not be liable for indirect losses, loss of profit, or third-party actions.

PRIVACY POLICY
Your personal data will be used only for KYC, payment processing, and communication. We do not sell your data.

INTELLECTUAL PROPERTY
All content on the platform, including logo "ZARU", text, images are property of ZARU ENTERPRISE.

CHANGES TO TERMS
We may update these Terms at any time. Continued use of the platform means you accept the new Terms.

By clicking "I Agree" you confirm that you have read, understood, and accepted these Terms and Conditions.

Disclaimer: By accessing and using our platform, you acknowledge and agree that Zaru Enterprise shall not be held liable for any direct, indirect, incidental, or consequential financial losses, damages, or missed opportunities incurred by individuals. Please invest only what you can afford.

All participation, investments, or transactions are undertaken at your own risk. Zaru Enterprise has the Right to Restrict or Terminate Accounts.
We are committed to maintaining a fair, safe, and transparent environment for all users. Zaru Enterprise reserves the absolute right to suspend, restrict, or permanently terminate any user account, without prior notice, if we detect any attempt to cheat, exploit, hack, or manipulate the system or its features.
Fraudulent activities, by usage of unauthorized automated bots, or deceptive practices is a violation of our Terms of Service or community guidelines.
By continuing or Accepting to use our services, you agree to abide by these terms.`;

// Demo users so the platform is immediately testable out of the box
export const SEED_USERS: UserAccount[] = [
  {
    id: 'user-demo-danta',
    fullName: 'danta kiz',
    email: 'dantakiz@gmail.com',
    phone: '08131376638',
    password: 'password123',
    bankName: 'Moniepoint MFB',
    accountNumber: '6394899106',
    accountName: 'danta kiz',
    referralCode: 'ZARU-Q2DT47',
    referralCount: 0,
    referralBonusBalance: 0,
    status: 'approved',
    withdrawalsBlocked: false,
    createdAt: '2026-10-17T10:00:00.000Z',
    activePlan: null,
  },
  {
    id: 'user-demo-1',
    fullName: 'Solomon Charles',
    email: 'solomoncharles406@gmail.com',
    phone: '08123456789',
    password: 'password123',
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'Solomon Charles',
    referralCode: 'ZARU-SOLO',
    referralCount: 3,
    referralBonusBalance: 15000,
    status: 'approved',
    withdrawalsBlocked: false,
    createdAt: '2026-10-01T10:00:00.000Z',
    activePlan: {
      planId: 'poultry',
      planName: 'Poultry Plan',
      amount: 200000,
      purchaseDate: '2026-10-03T09:00:00.000Z',
      maturityDate: '2026-10-17T09:00:00.000Z',
      paymentApproved: true,
      paymentApprovedAt: '2026-10-03T10:00:00.000Z',
      proofSenderName: 'Solomon Charles',
      proofReference: 'MNP/20261003/99281',
      paymentStatus: 'approved',
      dividendCommitmentPercent: 100, // Completed 14-day cycle!
      dividendWithdrawalCount: 1, // Has withdrawn once; ready for 2nd dividend withdrawal!
      lastDividendWithdrawalDate: '2026-10-10T14:30:00.000Z',
      isCapitalUnlocked: false,
      capitalWithdrawn: false,
    },
    lastWithdrawalDate: '2026-10-10T14:30:00.000Z',
    lastBonusWithdrawalDate: '2026-10-05T12:00:00.000Z',
    adminNotificationMessage: 'Welcome to ZARU Enterprise! Your farm cycle is performing ahead of schedule.',
  },
  {
    id: 'user-demo-2',
    fullName: 'Ngozi Okonjo',
    email: 'ngozi.invest@example.com',
    phone: '08098765432',
    password: 'password123',
    bankName: 'Guaranty Trust Bank (GTB)',
    accountNumber: '2233445566',
    accountName: 'Ngozi Okonjo',
    referralCode: 'ZARU-NGOZI',
    referralCount: 1,
    referralBonusBalance: 3000,
    status: 'approved',
    withdrawalsBlocked: false,
    createdAt: '2026-10-12T14:00:00.000Z',
    activePlan: {
      planId: 'snail',
      planName: 'Snail Plan',
      amount: 30000,
      purchaseDate: '2026-10-12T14:30:00.000Z',
      maturityDate: '2026-10-26T14:30:00.000Z',
      paymentApproved: true,
      paymentApprovedAt: '2026-10-12T15:00:00.000Z',
      proofSenderName: 'Ngozi Okonjo',
      proofReference: 'GTB-TRX-88371',
      paymentStatus: 'approved',
      dividendCommitmentPercent: 42, // Day 6 of 14 days
      dividendWithdrawalCount: 0,
      isCapitalUnlocked: false,
      capitalWithdrawn: false,
    },
    lastWithdrawalDate: undefined,
  },
  {
    id: 'user-demo-3',
    fullName: 'Ibrahim Danjuma',
    email: 'ibrahim.d@example.com',
    phone: '07011223344',
    password: 'password123',
    bankName: 'Zenith Bank',
    accountNumber: '1099887766',
    accountName: 'Ibrahim Danjuma',
    referralCode: 'ZARU-IBRAHIM',
    referralCount: 2,
    referralBonusBalance: 5000,
    status: 'pending', // Pending account approval
    withdrawalsBlocked: false,
    createdAt: '2026-10-17T08:00:00.000Z',
    activePlan: {
      planId: 'fish',
      planName: 'Fish Plan',
      amount: 50000,
      purchaseDate: '2026-10-17T08:30:00.000Z',
      maturityDate: '2026-10-31T08:30:00.000Z',
      paymentApproved: false,
      proofSenderName: 'Ibrahim Danjuma',
      proofReference: 'ZEN-PAY-774102',
      paymentStatus: 'pending', // Pending payment confirmation
      dividendCommitmentPercent: 0,
      dividendWithdrawalCount: 0,
      isCapitalUnlocked: false,
      capitalWithdrawn: false,
    },
  }
];

export const SEED_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TXN-001',
    userId: 'user-demo-1',
    userName: 'Solomon Charles',
    userEmail: 'solomoncharles406@gmail.com',
    type: 'plan_purchase',
    planName: 'Poultry Plan',
    amount: 200000,
    date: '2026-10-03T09:00:00.000Z',
    status: 'approved',
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'Solomon Charles',
    notes: 'Paid via Moniepoint account. Verified by Admin.',
  },
  {
    id: 'TXN-002',
    userId: 'user-demo-1',
    userName: 'Solomon Charles',
    userEmail: 'solomoncharles406@gmail.com',
    type: 'dividend_withdrawal',
    planName: 'Poultry Plan',
    amount: 40000, // 20% of 200,000
    date: '2026-10-10T14:30:00.000Z',
    status: 'approved',
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'Solomon Charles',
    notes: 'Cycle 1 Dividend disbursed to Access Bank.',
  },
  {
    id: 'TXN-003',
    userId: 'user-demo-1',
    userName: 'Solomon Charles',
    userEmail: 'solomoncharles406@gmail.com',
    type: 'bonus_withdrawal',
    amount: 10000,
    date: '2026-10-05T12:00:00.000Z',
    status: 'approved',
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'Solomon Charles',
    notes: 'Referral bonus payout approved.',
  },
  {
    id: 'TXN-004',
    userId: 'user-demo-3',
    userName: 'Ibrahim Danjuma',
    userEmail: 'ibrahim.d@example.com',
    type: 'plan_purchase',
    planName: 'Fish Plan',
    amount: 50000,
    date: '2026-10-17T08:30:00.000Z',
    status: 'pending',
    bankName: 'Zenith Bank',
    accountNumber: '1099887766',
    accountName: 'Ibrahim Danjuma',
    notes: 'Payment uploaded by user, awaiting admin confirmation.',
  }
];

export const SEED_MESSAGES: SupportMessage[] = [
  {
    id: 'MSG-001',
    userId: 'user-demo-1',
    userName: 'Solomon Charles',
    sender: 'user',
    text: 'Hello ZARU Admin, my first cycle dividend was received seamlessly. Looking forward to completing the 14 days for the second cycle!',
    timestamp: '2026-10-11T09:15:00.000Z',
    isRead: true,
  },
  {
    id: 'MSG-002',
    userId: 'user-demo-1',
    userName: 'Solomon Charles',
    sender: 'admin',
    text: 'Greetings Solomon! We are glad to have you. The poultry flock in Oyo State is in optimal health. Your second cycle is progressing smoothly on your commitment bar.',
    timestamp: '2026-10-11T10:30:00.000Z',
    isRead: true,
  }
];

export const SEED_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'NOTIF-001',
    type: 'payment_uploaded',
    title: 'New Plan Payment Uploaded',
    message: 'Ibrahim Danjuma uploaded proof for Fish Plan (₦50,000). Awaiting your confirmation.',
    timestamp: '2026-10-17T08:31:00.000Z',
    userId: 'user-demo-3',
    read: false,
    actionRequired: true,
  },
  {
    id: 'NOTIF-002',
    type: 'new_registration',
    title: 'New Investor Registered',
    message: 'Ibrahim Danjuma registered account #1099887766. Awaiting status approval.',
    timestamp: '2026-10-17T08:00:00.000Z',
    userId: 'user-demo-3',
    read: false,
    actionRequired: true,
  }
];
