import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  CreditCard,
  Upload,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Send,
  Camera,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowLeft,
  Info,
  X,
  Lock,
  Unlock,
  MessageSquare,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlanType } from '../types';

export const UserDashboard: React.FC = () => {
  const {
    users,
    currentUser,
    isAdminLoggedIn,
    plans,
    cmsConfig,
    transactions,
    messages,
    purchasePlan,
    requestDividendWithdrawal,
    requestCapitalWithdrawal,
    requestBonusWithdrawal,
    sendUserMessage,
    logoutUser,
    viewUserDashboardAsAdmin,
    returnToAdminDashboard
  } = useApp();

  // Local state
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<PlanType>('snail');
  const [purchaseAmount, setPurchaseAmount] = useState<number>(30000);
  const [proofImage, setProofImage] = useState<string>('');
  const [proofSenderName, setProofSenderName] = useState('');
  const [proofReference, setProofReference] = useState('');

  // Withdrawal Modal
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  // Chat / Message to Admin state
  const [chatText, setChatText] = useState('');
  const [chatImage, setChatImage] = useState<string>('');

  // Alerts
  const [alertFeedback, setAlertFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!currentUser) {
    if (isAdminLoggedIn && users.length > 0) {
      return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Admin Dashboard Preview</h2>
          <p className="text-xs text-zinc-400 max-w-md">
            Select an investor account below to inspect their live portfolio, progress bar, transaction history, and support chat:
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <select
              onChange={(e) => e.target.value && viewUserDashboardAsAdmin(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-red-500 cursor-pointer min-w-[240px]"
            >
              <option value="">-- Select Investor Account --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.email}) - {u.activePlan ? u.activePlan.planName : 'No Plan'}
                </option>
              ))}
            </select>
            <button
              onClick={returnToAdminDashboard}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Admin Control Center
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-white">Investor Session Required</h2>
        <p className="text-sm text-zinc-400 mt-1 max-w-md">
          Please log in with your investor credentials or register a new account to view your dashboard.
        </p>
      </div>
    );
  }

  // Filter transactions for current user
  const userTransactions = transactions.filter(t => t.userId === currentUser.id);
  // Filter messages between this user and admin
  const userMessages = messages.filter(m => m.userId === currentUser.id);

  // Totals for header
  const paidOutTotal = userTransactions
    .filter(t => (t.type === 'dividend_withdrawal' || t.type === 'bonus_withdrawal' || t.type === 'capital_withdrawal') && t.status === 'approved')
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingTotal = userTransactions
    .filter(t => t.status === 'pending')
    .reduce((acc, t) => acc + t.amount, 0);

  // Referral link generation & copy
  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${currentUser.referralCode}`
    : `https://zaru-enterprise.com/?ref=${currentUser.referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleShareWhatsAppReferral = () => {
    const shareText = encodeURIComponent(
      `Hello! Invest in Nigerian agricultural co-farming with ZARU ENTERPRISE FARM with guaranteed 14-day returns. Register through my official referral link: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  // Copy company account number
  const handleCopyCompanyAccount = () => {
    navigator.clipboard.writeText(cmsConfig.bankAccountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Handle plan purchase click
  const openPlanPurchase = (planId: PlanType) => {
    const target = plans.find(p => p.id === planId);
    setSelectedPlanForPurchase(planId);
    setPurchaseAmount(target ? target.minAmount : 30000);
    setProofSenderName(currentUser.fullName);
    setProofReference(`MNP-${Date.now().toString().slice(-6)}`);
    setShowPaymentModal(true);
  };

  // Handle image upload for proof of payment
  const handleProofImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Payment Proof
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofImage) {
      setAlertFeedback({ type: 'error', message: 'Please attach an image or screenshot of your payment transfer receipt.' });
      return;
    }

    const res = purchasePlan(
      currentUser.id,
      selectedPlanForPurchase,
      purchaseAmount,
      proofImage,
      proofSenderName,
      proofReference
    );

    if (res.success) {
      setAlertFeedback({ type: 'success', message: res.message });
      setShowPaymentModal(false);
      setProofImage('');
    } else {
      setAlertFeedback({ type: 'error', message: res.message });
    }
  };

  // Handle Dividend Withdrawal
  const handleDividendWithdrawal = () => {
    const res = requestDividendWithdrawal(currentUser.id);
    if (res.success) {
      setAlertFeedback({ type: 'success', message: res.message });
      setShowWithdrawalModal(false);
    } else {
      setAlertFeedback({ type: 'error', message: res.message });
    }
  };

  // Handle Capital Withdrawal
  const handleCapitalWithdrawal = () => {
    const res = requestCapitalWithdrawal(currentUser.id);
    if (res.success) {
      setAlertFeedback({ type: 'success', message: res.message });
      setShowWithdrawalModal(false);
    } else {
      setAlertFeedback({ type: 'error', message: res.message });
    }
  };

  // Handle Referral Bonus Withdrawal
  const handleBonusWithdrawal = () => {
    if (currentUser.withdrawalsBlocked) {
      setAlertFeedback({
        type: 'error',
        message: 'Withdrawals are currently restricted for your account. Please reach out to Administrator desk via support inbox below.'
      });
      return;
    }

    const pendingRequest = transactions.find(
      t => t.userId === currentUser.id && t.type === 'bonus_withdrawal' && t.status === 'pending'
    );
    if (pendingRequest) {
      setAlertFeedback({
        type: 'error',
        message: `You already have a pending referral bonus withdrawal request of ₦${pendingRequest.amount.toLocaleString()} awaiting Admin confirmation.`
      });
      return;
    }

    if (currentUser.referralBonusBalance <= 0) {
      setAlertFeedback({
        type: 'error',
        message: 'You currently have ₦0 referral bonus. Share your referral code with friends to earn 10% instant commission when they invest!'
      });
      return;
    }

    const res = requestBonusWithdrawal(currentUser.id);
    if (res.success) {
      setAlertFeedback({ type: 'success', message: res.message });
    } else {
      setAlertFeedback({ type: 'error', message: res.message });
    }
  };

  // Send message to admin (with optional image)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() && !chatImage) return;

    sendUserMessage(currentUser.id, chatText, chatImage);
    setChatText('');
    setChatImage('');
    setAlertFeedback({ type: 'success', message: 'Message delivered directly to Administrator desk.' });
  };

  const handleChatImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick suggestion chips in Direct Admin Communication
  const sendQuickChip = (text: string) => {
    sendUserMessage(currentUser.id, text);
    setAlertFeedback({ type: 'success', message: `Quick inquiry "${text}" sent to Admin!` });
  };

  // Calculate active plan details
  const activePlan = currentUser.activePlan;
  const progressPercent = activePlan?.dividendCommitmentPercent || 0;
  const planConfig = plans.find(p => p.id === activePlan?.planId);
  const potentialDividend = activePlan && planConfig
    ? Math.round(activePlan.amount * (planConfig.roiPercent / 100) * 0.98)
    : 0;

  const withdrawalCount = activePlan?.dividendWithdrawalCount ?? 0;
  const currentCycleNumber = withdrawalCount === 0 ? 1 : 2;
  const dayNumber = Math.max(1, Math.ceil((progressPercent / 100) * 14));

  const cleanWhatsapp = cmsConfig.whatsappNumber.replace(/\D/g, '');
  const internationalWhatsapp = cleanWhatsapp.startsWith('0')
    ? '234' + cleanWhatsapp.slice(1)
    : cleanWhatsapp;

  return (
    <div className="min-h-screen bg-[#030303] text-white pb-24">
      {/* Sticky Admin View Mode Banner */}
      {isAdminLoggedIn && (
        <div className="sticky top-20 z-30 bg-gradient-to-r from-red-950 via-zinc-950 to-red-950 border-b-2 border-red-600 px-4 py-3 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-red-600 text-white font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                ADMIN VIEW MODE
              </span>
              <span className="text-zinc-200">
                Viewing personal dashboard of{' '}
                <strong className="text-white font-semibold underline underline-offset-2">{currentUser.fullName}</strong>{' '}
                (<span className="text-zinc-300 font-mono">{currentUser.email}</span>)
              </span>
              <span className="text-zinc-500 hidden lg:inline">|</span>
              <span className="text-zinc-300 hidden lg:inline font-mono">
                Invested:{' '}
                <strong className="text-emerald-400">
                  ₦{currentUser.activePlan?.amount ? currentUser.activePlan.amount.toLocaleString() : '0'}
                </strong>
              </span>
              <span className="text-zinc-500 hidden lg:inline">|</span>
              <span className="text-zinc-300 hidden lg:inline font-mono">
                Referrals: <strong className="text-white">{currentUser.referralCount}</strong> (₦{currentUser.referralBonusBalance.toLocaleString()} bonus)
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 text-[11px] hidden sm:inline">Switch Investor:</span>
                <select
                  value={currentUser.id}
                  onChange={(e) => viewUserDashboardAsAdmin(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.accountName || u.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={returnToAdminDashboard}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Admin Panel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        
        {/* Top Feedback Notification */}
        {alertFeedback && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-in fade-in ${
              alertFeedback.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                : 'bg-red-950/70 border-red-500 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {alertFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{alertFeedback.message}</span>
            </div>
            <button
              onClick={() => setAlertFeedback(null)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. WELCOME HEADER (matching video clip 00:00 - 00:01) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-2">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {currentUser.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Investor Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const commElem = document.getElementById('admin-communication');
                commElem?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-lg bg-[#0d0d0d] hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-red-500" />
              Message Admin
            </button>

            <button
              onClick={logoutUser}
              className="px-4 py-2 rounded-lg bg-black hover:bg-red-950/60 text-red-500 hover:text-red-400 border border-red-900/60 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* 2. ACTIVE REFERRALS BANNER BAR (matching video clip 00:00 - 00:03) */}
        {(() => {
          const userPendingBonusTxn = transactions.find(
            t => t.userId === currentUser.id && t.type === 'bonus_withdrawal' && t.status === 'pending'
          );

          return (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  {currentUser.referralCount > 0 ? (
                    <div className="text-sm font-semibold text-zinc-200">
                      You currently have <strong className="text-white font-bold font-mono">{currentUser.referralCount}</strong> active {currentUser.referralCount === 1 ? 'referral' : 'referrals'}.
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-zinc-300">
                      No active referrals pending. Share your referral link below to invite partners and earn 10% commission!
                    </div>
                  )}
                  <p className="text-xs text-[#00A86B] font-semibold mt-0.5">
                    10% Bonus per referral • Balance:{' '}
                    <span className="text-white font-mono font-bold">₦{currentUser.referralBonusBalance.toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBonusWithdrawal}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  userPendingBonusTxn
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 hover:bg-yellow-500/30'
                    : currentUser.referralBonusBalance > 0 && !currentUser.withdrawalsBlocked
                    ? 'bg-[#00A86B] hover:bg-emerald-600 text-white shadow-emerald-950/40 animate-pulse'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                }`}
                title={
                  userPendingBonusTxn
                    ? 'Bonus withdrawal request submitted to Admin'
                    : currentUser.referralBonusBalance > 0
                    ? `Request withdrawal of ₦${currentUser.referralBonusBalance.toLocaleString()}`
                    : 'Invite referrals to earn bonus'
                }
              >
                {userPendingBonusTxn ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping inline-block" />
                    <span>Pending Approval (₦{userPendingBonusTxn.amount.toLocaleString()})</span>
                  </>
                ) : currentUser.referralBonusBalance > 0 ? (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Withdraw Referral Bonus (₦{currentUser.referralBonusBalance.toLocaleString()})</span>
                  </>
                ) : (
                  <span>Request Bonus Withdrawal (₦0)</span>
                )}
              </button>
            </div>
          );
        })()}

        {/* 3. DIVIDEND COMMITMENT PROGRESS & REFERRAL PROGRAM (matching video clip 00:01 - 00:05) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Dividend Commitment Progress Box (Left Column, col-span-8) */}
          <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col justify-between space-y-6">
            
            {/* Top row with Title and Capital Locked Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Dividend Commitment Progress
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {activePlan
                    ? `Cycle ${currentCycleNumber} of 2: ${currentCycleNumber === 1 ? 'First' : 'Second'} 14-day farming growth cycle`
                    : 'Cycle 1 of 2: First 14-day farming growth cycle'}
                </p>
              </div>

              {/* Capital Locked/Unlocked Badge matching video */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-300 text-xs font-semibold self-start sm:self-auto">
                {withdrawalCount >= 2 ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Capital Unlocked (2/2 Dividends)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Capital Locked ({withdrawalCount}/2 Dividends)</span>
                  </>
                )}
              </div>
            </div>

            {/* Cycle Status Subheader */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">
                  Cycle {currentCycleNumber} (Day {progressPercent >= 100 ? 14 : dayNumber})
                </span>
                <span className="text-zinc-400 font-medium">
                  Cycle {currentCycleNumber} Ready (14 Days)
                </span>
              </div>

              {/* Progress Bar with Floating % Pill Badge matching video */}
              <div className="relative w-full h-2.5 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-[#00A86B] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* % indicator display */}
              <div className="flex justify-center pt-0.5">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[#00A86B] text-[11px] font-bold font-mono">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* 3 Milestone Cards Row matching video */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: 1st Dividend */}
              <div className="p-3.5 rounded-xl bg-black border border-zinc-800/90 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">1st Dividend</span>
                  <span className="text-[11px] text-zinc-400 font-mono">14 Days</span>
                </div>
                <p className="text-[11px] text-zinc-500">First 14-day dividend harvest</p>
              </div>

              {/* Card 2: 2nd Dividend */}
              <div className="p-3.5 rounded-xl bg-black border border-zinc-800/90 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">2nd Dividend</span>
                  <span className="text-[11px] text-zinc-400 font-mono">Another 14 Days</span>
                </div>
                <p className="text-[11px] text-zinc-500">Second 14-day dividend harvest</p>
              </div>

              {/* Card 3: Capital Withdrawal */}
              <div className="p-3.5 rounded-xl bg-black border border-zinc-800/90 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">Capital Withdrawal</span>
                  <span className={`text-[11px] font-mono font-bold ${withdrawalCount >= 2 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {withdrawalCount >= 2 ? 'UNLOCKED' : `LOCKED (${withdrawalCount}/2)`}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">Unlocked after 2 dividend payouts</p>
              </div>
            </div>

            {/* 14-Day Payout Rule Box matching video text */}
            <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-white">14-Day Payout Rule:</strong> At the end of 14 days, you can withdraw <span className="text-white underline font-semibold">only your dividend</span>. Capital remains active in the farm and can only be withdrawn after completing 2 dividend cycles (14 days and another 14 days).
              </p>
            </div>

            {/* Request Withdrawal Button matching video */}
            <div>
              <button
                onClick={() => setShowWithdrawalModal(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00A86B] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                REQUEST WITHDRAWAL
              </button>
            </div>

          </div>

          {/* Referral Program Card - "change referral code to referral link so that when a user send his referral link to any one to register through his link it will reflect on his referial bonus once the person invest" */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Your Referral Link
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  10% Commission
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Send your unique referral link to friends and partners. When they register and invest, your 10% bonus reflects immediately upon admin payment confirmation!
              </p>
            </div>

            {/* Referral Link Box with Copy Button */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#071911] border border-[#00A86B]/40 flex items-center justify-between gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-transparent font-mono font-semibold text-[#00A86B] text-xs outline-none select-all truncate cursor-pointer"
                  title="Your unique referral link"
                />
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-[#00A86B] text-emerald-400 hover:text-white transition-all text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer shadow"
                  title="Copy Referral Link"
                >
                  {copiedReferral ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-[11px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons: WhatsApp Share & Ref Code Pill */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsAppReferral}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Share on WhatsApp</span>
                </button>

                <div className="px-2.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 shrink-0" title="Your Referral Code">
                  Code: <strong className="text-white">{currentUser.referralCode}</strong>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 pt-3 border-t border-zinc-900 flex justify-between items-center">
              <span>Active Referrals: <strong className="text-white">{currentUser.referralCount}</strong></span>
              <span>Available Bonus: <strong className="text-emerald-400">₦{currentUser.referralBonusBalance.toLocaleString()}</strong></span>
            </div>
          </div>

        </div>

        {/* 4. PLAN HISTORY SECTION (matching video clip 00:05 - 00:06) */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white tracking-wide">
            Plan History
          </h3>

          {!activePlan ? (
            /* Empty State matching video */
            <div className="p-12 sm:p-14 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-1">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-zinc-300">
                You have no active plans yet.
              </p>
              <p className="text-xs text-zinc-500">
                Select a package below to get started.
              </p>
            </div>
          ) : (
            /* Active Plan Summary */
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-semibold">Active Plan</span>
                  <h4 className="text-lg font-bold text-white">{activePlan.planName}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 text-base">
                    ₦{activePlan.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {activePlan.paymentApproved ? 'Active Cycle' : 'Pending Confirmation'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">Purchase Date:</span>
                  <strong className="text-zinc-200">{new Date(activePlan.purchaseDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Maturity Date:</span>
                  <strong className="text-zinc-200">{new Date(activePlan.maturityDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Dividends Collected:</span>
                  <strong className="text-emerald-400 font-mono">{withdrawalCount} of 2</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Cycle Status:</span>
                  <strong className="text-zinc-200">{progressPercent >= 100 ? 'Matured (100%)' : `Day ${dayNumber} of 14`}</strong>
                </div>
              </div>

              {/* When capital is withdrawn: prompt to purchase new plan with wiped progress */}
              {activePlan.capitalWithdrawn && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 to-zinc-900 border border-emerald-500/50 space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Farm Cycle Successfully Completed & Disbursed!</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    You have withdrawn your 1st dividend, 2nd dividend, and 100% of your initial capital. The old dividend commitment progress will automatically wipe clean once you buy your next plan!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const packagesElem = document.getElementById('packages-section');
                      if (packagesElem) {
                        packagesElem.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        setSelectedPlanForPurchase('poultry');
                      }
                    }}
                    className="mt-1 px-4 py-2 rounded-lg bg-[#00A86B] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Purchase New Agro Plan (Start Fresh Cycle)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. WITHDRAWAL & TRANSACTION HISTORY (matching video clip 00:06 - 00:08) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#09090b] border border-zinc-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Withdrawal & Transaction History
                </h3>
                <p className="text-xs text-zinc-400">
                  Live tracking of your dividend payouts, capital returns, and referral bonus disbursements
                </p>
              </div>
            </div>

            {/* Badges on top right: Paid Out & Pending matching video */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-zinc-400">
                Paid Out: <strong className="text-[#00A86B] font-mono">₦{paidOutTotal.toLocaleString()}</strong>
              </span>
              <span className="text-zinc-400">
                Pending: <strong className="text-yellow-400 font-mono">₦{pendingTotal.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          {/* Records area */}
          {userTransactions.length === 0 ? (
            /* Empty state card matching video */
            <div className="p-10 rounded-xl bg-black border border-zinc-800/80 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-1">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">
                No withdrawal records yet
              </h4>
              <p className="text-xs text-zinc-500 max-w-md">
                When you request a dividend or bonus payout, your transaction details and payment approvals will be logged here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black text-zinc-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Ref / Date</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Destination Bank</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {userTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-900/50">
                      <td className="py-3 px-4 font-mono text-zinc-300">
                        {tx.id}
                        <span className="block text-[10px] text-zinc-500">
                          {new Date(tx.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white capitalize">
                        {tx.type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{tx.planName || '—'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#00A86B]">
                        ₦{tx.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {tx.bankName} ({tx.accountNumber})
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tx.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : tx.status === 'rejected'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 6. DIRECT ADMIN COMMUNICATION SECTION (matching video clip 00:08 - 00:13, 00:18 - 00:20) */}
        <div id="admin-communication" className="p-6 sm:p-7 rounded-2xl bg-[#09090b] border border-zinc-800/80 space-y-6">
          
          {/* Header Bar matching video */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Direct Admin Communication
                </h3>
                <p className="text-xs text-zinc-400 leading-snug">
                  Type letters or upload photos/screenshots (payment receipts, account details, inquiries) to ZARU Enterprise Administrators.
                </p>
              </div>
            </div>

            {/* Badges on right: WhatsApp and Admin Online matching video */}
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={`https://wa.me/${internationalWhatsapp}?text=${encodeURIComponent(
                  'Hello ZARU Enterprise Admin, I am writing from my Investor Dashboard.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#071911] border border-[#00A86B]/50 text-[#00A86B] text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-950/40 transition-colors"
                title="Chat with Admin on WhatsApp"
              >
                <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse"></span>
                WhatsApp Chat
              </a>

              <div className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Admin Online
              </div>
            </div>
          </div>

          {/* Chat / Inquiries Card matching video center card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black border border-zinc-800/80 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 max-w-lg">
              <h4 className="text-base font-bold text-white">
                How can our Admin team help you today?
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                You can send text messages or attach image files (Bank receipts, screenshots, ID, questions). Messages are delivered directly to the administrator desk.
              </p>
            </div>

            {/* 4 Quick suggestion chips matching video frame 00:11 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl text-left">
              <button
                type="button"
                onClick={() => sendQuickChip('Question about my 14-day dividend cycle')}
                className="p-2.5 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-zinc-800/90 text-xs text-zinc-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-emerald-400">💬</span>
                <span>Question about my 14-day dividend cycle</span>
              </button>

              <button
                type="button"
                onClick={() => sendQuickChip('Help with my payment proof verification')}
                className="p-2.5 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-zinc-800/90 text-xs text-zinc-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-emerald-400">🛡️</span>
                <span>Help with my payment proof verification</span>
              </button>

              <button
                type="button"
                onClick={() => sendQuickChip('Inquiry on my pending withdrawal request')}
                className="p-2.5 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-zinc-800/90 text-xs text-zinc-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-emerald-400">💰</span>
                <span>Inquiry on my pending withdrawal request</span>
              </button>

              <button
                type="button"
                onClick={() => sendQuickChip('Confirming my bank payout details')}
                className="p-2.5 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-zinc-800/90 text-xs text-zinc-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-emerald-400">🏦</span>
                <span>Confirming my bank payout details</span>
              </button>
            </div>
          </div>

          {/* Message Thread History if messages exist */}
          {userMessages.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-3 p-4 rounded-xl bg-black border border-zinc-800">
              {userMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl max-w-lg text-xs space-y-1.5 ${
                    m.sender === 'user'
                      ? 'ml-auto bg-zinc-900 border border-zinc-700 text-zinc-200'
                      : 'mr-auto bg-red-950/40 border border-red-600/40 text-red-200'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-zinc-400">
                    <span className="font-semibold">{m.sender === 'user' ? 'You' : 'ZARU Admin Desk'}</span>
                    <div className="flex items-center gap-1.5">
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {m.sender === 'user' && (
                        <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${m.isRead ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {m.isRead ? '✓✓ Read' : '✓ Sent'}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  {m.imageAttachment && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-zinc-700">
                      <img src={m.imageAttachment} alt="Attachment" className="max-h-40 w-auto object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Chat Input Bar matching video clip 00:13 */}
          <form onSubmit={handleSendMessage} className="space-y-2">
            {chatImage && (
              <div className="relative inline-block border border-zinc-700 rounded-lg overflow-hidden p-1 bg-black">
                <img src={chatImage} alt="Preview" className="h-20 w-auto object-cover rounded" />
                <button
                  type="button"
                  onClick={() => setChatImage('')}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black border border-zinc-800">
              <label
                className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
                title="Attach photo or screenshot"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChatImageChange}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Type your message, letters, or attach an image for Admin..."
                className="flex-1 px-3 py-2 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#00A86B] hover:bg-emerald-600 text-white font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-500 px-1 gap-1">
              <span>You can type letters, attach photos (JPG, PNG, WebP), or send both together. Press Enter to send.</span>
              <span className="text-emerald-500/80 font-medium">Admin receives messages instantly</span>
            </div>
          </form>

        </div>

        {/* 7. AVAILABLE PACKAGES SECTION (matching video clip 00:13 - 00:18) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Available Packages
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl bg-[#09090b] border border-zinc-800/80 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 shadow-xl"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={cmsConfig.planImages[p.id] || p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-wide">
                      {p.title}
                    </h4>

                    {/* Stats table matching video: Min. Amount, ROI, Duration */}
                    <div className="mt-4 space-y-2 text-xs border-t border-zinc-900 pt-3">
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>Min. Amount</span>
                        <strong className="text-white font-mono text-sm">
                          ₦{p.minAmount.toLocaleString()}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>ROI</span>
                        <strong className="text-[#00A86B] font-mono font-bold text-sm">
                          {p.roiPercent}%
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>Duration</span>
                        <strong className="text-white font-mono text-sm">
                          {p.durationDays} Days
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* PURCHASE PLAN Button matching video */}
                  <button
                    onClick={() => openPlanPurchase(p.id)}
                    className="w-full py-3.5 bg-[#00A86B] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/40 cursor-pointer text-center"
                  >
                    PURCHASE PLAN
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ----------------- PAYMENT MODAL (SCROLLABLE) ----------------- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 modal-backdrop-blur">
          <div 
            className="relative w-full max-w-xl bg-zinc-950 border border-emerald-500/60 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Complete Payment for Agricultural Plan
                </h3>
                <p className="text-xs text-zinc-400">
                  Transfer funds to official company Moniepoint account & upload receipt
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitPayment} className="p-6 overflow-y-auto max-h-[calc(90vh-130px)] space-y-5">
              
              {/* Official Company Bank Account Card */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase font-bold text-emerald-400">
                    Official ZARU Destination Account
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Moniepoint Escrow Verified
                  </span>
                </div>

                {/* Exact requested account details banner */}
                <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm text-emerald-300 font-medium">
                    <strong className="text-white">Bank:</strong> Zaru Enterprise Farm,{' '}
                    <strong className="text-white">Account N0:</strong>{' '}
                    <span className="font-mono text-emerald-400 font-bold text-base">6394899106</span>,{' '}
                    <strong className="text-white">Bank Name:</strong> Moniepoint
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCompanyAccount}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAccount ? 'Copied 6394899106!' : 'Copy Account N0'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Bank / Account Name:</span>
                    <strong className="text-white text-sm">{cmsConfig.bankAccountName || 'Zaru Enterprise Farm'}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Account N0 (10 Digits):</span>
                    <strong className="text-emerald-400 font-mono text-base tracking-wider block">
                      {cmsConfig.bankAccountNumber || '6394899106'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Bank Name:</span>
                    <strong className="text-white text-sm">{cmsConfig.bankName || 'Moniepoint'}</strong>
                  </div>
                </div>
              </div>

              {/* Plan Choice & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Select Plan *
                  </label>
                  <select
                    value={selectedPlanForPurchase}
                    onChange={(e) => {
                      const id = e.target.value as PlanType;
                      setSelectedPlanForPurchase(id);
                      const target = plans.find(p => p.id === id);
                      if (target) setPurchaseAmount(target.minAmount);
                    }}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="snail">Snail Plan (15% ROI • Min ₦30,000)</option>
                    <option value="fish">Fish Plan (15% ROI • Min ₦100,000)</option>
                    <option value="poultry">Poultry Plan (20% ROI • Min ₦200,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Purchase Amount (NGN) *
                  </label>
                  <input
                    type="number"
                    required
                    min={plans.find(p => p.id === selectedPlanForPurchase)?.minAmount || 30000}
                    max={20000000}
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    Max: ₦20,000,000 per slot
                  </span>
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Sender Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={proofSenderName}
                    onChange={(e) => setProofSenderName(e.target.value)}
                    placeholder="Name on the debit bank account"
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Transaction Reference / Session ID
                  </label>
                  <input
                    type="text"
                    value={proofReference}
                    onChange={(e) => setProofReference(e.target.value)}
                    placeholder="e.g. MNP-998822"
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Upload Proof of Payment */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Upload Proof of Payment (Receipt Screenshot) *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-zinc-700 hover:border-emerald-500 rounded-xl bg-zinc-900/60 transition-colors">
                  <div className="space-y-2 text-center">
                    {proofImage ? (
                      <div className="space-y-2">
                        <img
                          src={proofImage}
                          alt="Proof preview"
                          className="max-h-48 mx-auto rounded-lg border border-zinc-700 shadow"
                        />
                        <button
                          type="button"
                          onClick={() => setProofImage('')}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Change Screenshot
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-zinc-400" />
                        <div className="text-xs text-zinc-400">
                          <label className="relative cursor-pointer rounded font-semibold text-emerald-400 hover:text-emerald-300">
                            <span>Click to upload image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProofImageChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="text-[11px] text-zinc-500 mt-1">PNG, JPG, or WEBP receipt</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!proofImage}
                className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                  proofImage
                    ? 'bg-[#00A86B] hover:bg-emerald-600 text-white cursor-pointer shadow-lg shadow-emerald-950/50'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                Submit Payment Proof for Admin Confirmation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- WITHDRAWAL MODAL (SCROLLABLE) ----------------- */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 modal-backdrop-blur">
          <div 
            className="relative w-full max-w-lg bg-zinc-950 border border-red-600/60 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  Withdraw Funds & Payout Request
                </h3>
                <p className="text-xs text-zinc-400">
                  Automated payout to: {currentUser.bankName} ({currentUser.accountNumber})
                </p>
              </div>
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)] space-y-6 text-xs text-zinc-300">
              
              {/* Payout Destination Summary */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Verified Payout Bank Account
                </span>
                <div className="flex justify-between text-white font-semibold">
                  <span>{currentUser.bankName}</span>
                  <span className="font-mono text-emerald-400">{currentUser.accountNumber}</span>
                </div>
                <div className="text-[11px] text-zinc-400">{currentUser.accountName}</div>
              </div>

              {/* OPTION A: DIVIDEND WITHDRAWAL */}
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      14-Day Cycle Dividend Payout
                    </h4>
                    <p className="text-zinc-400 mt-0.5">
                      Cycle Count: <strong className="text-emerald-400">{activePlan?.dividendWithdrawalCount || 0} of 2</strong> completed
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-base">
                    ₦{potentialDividend.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 leading-snug">
                  • Requires 100% commitment progress (14th day maturity).<br />
                  • 2% management fee automatically deducted as per Terms.<br />
                  • Stops adding up after the 2nd withdrawal.
                </div>

                <button
                  type="button"
                  onClick={handleDividendWithdrawal}
                  disabled={
                    !activePlan ||
                    activePlan.dividendCommitmentPercent < 100 ||
                    activePlan.dividendWithdrawalCount >= 2 ||
                    currentUser.withdrawalsBlocked
                  }
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    activePlan &&
                    activePlan.dividendCommitmentPercent >= 100 &&
                    activePlan.dividendWithdrawalCount < 2 &&
                    !currentUser.withdrawalsBlocked
                      ? 'bg-[#00A86B] hover:bg-emerald-600 text-white cursor-pointer shadow-lg shadow-emerald-950/40'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  {(activePlan?.dividendWithdrawalCount ?? 0) >= 2
                    ? '2nd Dividend Already Collected (Max Reached)'
                    : (activePlan?.dividendCommitmentPercent ?? 0) < 100
                    ? `Dividend Matures at 100% (Currently ${progressPercent}%)`
                    : 'Withdraw Cycle Dividend Now'}
                </button>
              </div>

              {/* OPTION B: CAPITAL REFUND WITHDRAWAL */}
              <div className="p-4 rounded-xl bg-black border-2 border-red-600/40 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Capital Refund Withdrawal
                    </h4>
                    <p className="text-zinc-400 mt-0.5">
                      Status:{' '}
                      <strong className={(activePlan?.dividendWithdrawalCount ?? 0) >= 2 ? 'text-emerald-400' : 'text-red-400'}>
                        {(activePlan?.dividendWithdrawalCount ?? 0) >= 2 ? 'UNLOCKED' : 'LOCKED (Requires 2 Dividend Withdrawals)'}
                      </strong>
                    </p>
                  </div>
                  <span className="font-mono font-bold text-white text-base">
                    ₦{(activePlan?.amount || 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 leading-snug">
                  • <strong>Strict Policy:</strong> Capital is strictly unlocked after completing your 1st & 2nd cycle dividend withdrawals.<br />
                  • Exact deposited capital amount only (no extra amount added).
                </div>

                <button
                  type="button"
                  onClick={handleCapitalWithdrawal}
                  disabled={
                    !activePlan ||
                    activePlan.dividendWithdrawalCount < 2 ||
                    activePlan.capitalWithdrawn ||
                    currentUser.withdrawalsBlocked
                  }
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    activePlan &&
                    activePlan.dividendWithdrawalCount >= 2 &&
                    !activePlan.capitalWithdrawn &&
                    !currentUser.withdrawalsBlocked
                      ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-lg shadow-red-950/40'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  {activePlan?.capitalWithdrawn
                    ? 'Capital Already Disbursed'
                    : (activePlan?.dividendWithdrawalCount ?? 0) < 2
                    ? 'Complete 2 Dividend Withdrawals to Unlock Capital'
                    : `Withdraw Principal Capital (₦${activePlan?.amount.toLocaleString()})`}
                </button>
              </div>

              <div className="text-center text-[11px] text-zinc-500">
                All withdrawal disbursements are processed within 24 to 48 hours to your registered account.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
