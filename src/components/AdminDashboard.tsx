import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  DollarSign,
  TrendingUp,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Trash2,
  CheckCircle2,
  CheckCheck,
  XCircle,
  Eye,
  MessageSquare,
  Send,
  Upload,
  Globe,
  Bell,
  Search,
  Calendar,
  X,
  Sparkles,
  Camera,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlanType, UserAccount } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    transactions,
    messages,
    adminNotifications,
    cmsConfig,
    approveUserStatus,
    deleteUser,
    toggleWithdrawalBlock,
    updateCommitmentPercent,
    confirmPayment,
    approveBonusWithdrawal,
    rejectBonusWithdrawal,
    approveWithdrawalTransaction,
    sendAdminMessage,
    sendAdminDirectAnnouncement,
    markMessageAsRead,
    markAllMessagesAsRead,
    clearAdminNotification,
    updateCMSConfig,
    updatePlanImage,
    switchUserForDemo,
    viewUserDashboardAsAdmin
  } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'users' | 'payments' | 'withdrawals' | 'messages' | 'cms'>('users');
  const [previewUserModal, setPreviewUserModal] = useState<UserAccount | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Proof viewer modal
  const [selectedProof, setSelectedProof] = useState<{
    image: string;
    userName: string;
    userEmail?: string;
    planName: string;
    amount: number;
    notes?: string;
    userId?: string;
    transactionId?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  } | null>(null);

  // Notifications dropdown state
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Direct message modal / state
  const [targetUserForMessage, setTargetUserForMessage] = useState<UserAccount | null>(null);
  const [directMessageText, setDirectMessageText] = useState('');

  // Delete confirmation modal state
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  // CMS editable state
  const [cmsHeadline, setCmsHeadline] = useState(cmsConfig.heroHeadline);
  const [cmsSubhead, setCmsSubhead] = useState(cmsConfig.heroSubheadline);
  const [cmsWhatsapp, setCmsWhatsapp] = useState(cmsConfig.whatsappNumber);
  const [cmsEmail, setCmsEmail] = useState(cmsConfig.companyEmail);
  const [cmsBankName, setCmsBankName] = useState(cmsConfig.bankName || 'Moniepoint');
  const [cmsBankAccountName, setCmsBankAccountName] = useState(cmsConfig.bankAccountName || 'Zaru Enterprise Farm');
  const [cmsBankAccountNumber, setCmsBankAccountNumber] = useState(cmsConfig.bankAccountNumber || '6394899106');

  // Withdrawal audit filter and search
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'bonus' | 'dividend' | 'capital'>('all');
  const [withdrawalSearch, setWithdrawalSearch] = useState('');

  // Feedback alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered users
  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.accountNumber.includes(searchTerm) ||
    u.accountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pending payments (uploaded proof awaiting confirmation)
  const pendingPayments = transactions.filter(t => t.type === 'plan_purchase' && t.status === 'pending');
  // Pending bonus withdrawals
  const pendingBonusWithdrawals = transactions.filter(t => t.type === 'bonus_withdrawal' && t.status === 'pending');
  // All pending withdrawals (bonus, dividend, capital)
  const allPendingWithdrawals = transactions.filter(
    t => (t.type === 'bonus_withdrawal' || t.type === 'dividend_withdrawal' || t.type === 'capital_withdrawal') && t.status === 'pending'
  );
  // Complete platform withdrawal transaction history (audit trail)
  const allWithdrawalTransactions = transactions.filter(
    t => t.type === 'bonus_withdrawal' || t.type === 'dividend_withdrawal' || t.type === 'capital_withdrawal'
  );
  // Unread messages from users
  const unreadMessages = messages.filter(m => m.sender === 'user' && !m.isRead);
  // Unread notifications
  const unreadNotifs = adminNotifications.filter(n => !n.read);

  // Automatically mark unread messages as read when admin enters messages tab
  useEffect(() => {
    if (activeTab === 'messages') {
      const hasUnread = messages.some(m => m.sender === 'user' && !m.isRead);
      if (hasUnread) {
        markAllMessagesAsRead();
      }
    }
  }, [activeTab, messages, markAllMessagesAsRead]);

  // Stats calculation
  const totalInvestedAmount = users.reduce((acc, u) => acc + (u.activePlan?.paymentApproved ? u.activePlan.amount : 0), 0);
  const totalPayouts = transactions
    .filter(t => (t.type === 'dividend_withdrawal' || t.type === 'bonus_withdrawal' || t.type === 'capital_withdrawal') && t.status === 'approved')
    .reduce((acc, t) => acc + t.amount, 0);

  // Handle plan image upload
  const handleUploadImageForPlan = (planId: PlanType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        updatePlanImage(planId, dataUrl);
        showToast(`Image updated for ${planId.toUpperCase()} Plan!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle hero banner image upload
  const handleUploadHeroImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        updateCMSConfig({ heroImage: dataUrl });
        showToast('Hero section banner image updated live on website!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle company logo image upload
  const handleUploadLogoImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        updateCMSConfig({ logoImage: dataUrl });
        showToast('Company emblem / logo updated across website!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle farm gallery image upload
  const handleUploadGalleryImage = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const currentGallery = cmsConfig.farmGalleryImages || [];
        const updated = [...currentGallery];
        updated[idx] = dataUrl;
        updateCMSConfig({ farmGalleryImages: updated });
        showToast(`Farm operations photo #${idx + 1} updated!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle sending announcement / direct message to user
  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserForMessage || !directMessageText.trim()) return;

    sendAdminDirectAnnouncement(targetUserForMessage.id, directMessageText.trim());
    sendAdminMessage(targetUserForMessage.id, directMessageText.trim());
    showToast(`Direct message delivered to ${targetUserForMessage.fullName}'s dashboard!`);
    setDirectMessageText('');
    setTargetUserForMessage(null);
  };

  // Handle delete user confirmed
  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id);
    showToast(`User account for ${userToDelete.fullName} permanently deleted.`);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Floating Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Admin Center Header */}
        <div className="p-6 rounded-2xl bg-zinc-950 border-2 border-red-600/70 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  ZARU EXECUTIVE CONTROL DESK
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-600/50">
                  ADMIN: Zagaru2026@
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Full-scope control over Nigerian investor accounts, Moniepoint payment confirmations & dividend progression.
              </p>
            </div>
          </div>

          {/* Interactive Notification Bell with Dropdown - "once a new investor make payment, admin should be get a notification" */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500/50 text-xs transition-colors cursor-pointer shadow"
              title="View administrative notifications"
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-red-400" />
                {(unreadNotifs.length + pendingPayments.length) > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
              <span className="font-semibold text-zinc-300">Alerts & Actions:</span>
              <span className="font-bold text-white px-2 py-0.5 rounded-full bg-red-600 text-[11px]">
                {unreadNotifs.length + pendingPayments.length + pendingBonusWithdrawals.length}
              </span>
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-red-400" />
                    Admin Notifications
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {adminNotifications.length} Total
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {/* Urgent: Pending Payments Alert */}
                  {pendingPayments.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveTab('payments');
                        setShowNotifDropdown(false);
                        if (p.proofImage) {
                          setSelectedProof({
                            image: p.proofImage,
                            userName: p.userName,
                            userEmail: p.userEmail,
                            planName: p.planName || 'Plan',
                            amount: p.amount,
                            notes: p.notes,
                            userId: p.userId,
                            transactionId: p.id,
                            bankName: p.bankName,
                            accountNumber: p.accountNumber,
                            accountName: p.accountName,
                          });
                        }
                      }}
                      className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-700/50 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <strong className="text-red-300 font-bold flex items-center gap-1">
                          💰 New Payment To Confirm!
                        </strong>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">₦{p.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300">
                        {p.userName} paid for {p.planName}. Click to review proof receipt & confirm.
                      </p>
                    </div>
                  ))}

                  {/* Standard Notifications */}
                  {adminNotifications.length === 0 && pendingPayments.length === 0 ? (
                    <div className="py-6 text-center text-zinc-500 text-xs">
                      No new administrative notifications.
                    </div>
                  ) : (
                    adminNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.type === 'payment_uploaded') setActiveTab('payments');
                          else if (n.type === 'bonus_request') setActiveTab('withdrawals');
                          else if (n.type === 'new_registration') setActiveTab('users');
                          setShowNotifDropdown(false);
                          clearAdminNotification(n.id);
                        }}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer space-y-1 text-xs ${
                          n.type === 'payment_uploaded'
                            ? 'bg-emerald-950/30 border-emerald-500/40 hover:bg-emerald-950/50'
                            : n.type === 'bonus_request'
                            ? 'bg-yellow-950/30 border-yellow-500/40 hover:bg-yellow-950/50'
                            : 'bg-zinc-900/80 border-zinc-800 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <strong className="text-white block font-semibold">{n.title}</strong>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-800 flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      adminNotifications.forEach(n => clearAdminNotification(n.id));
                      setShowNotifDropdown(false);
                    }}
                    className="text-[11px] text-zinc-400 hover:text-white"
                  >
                    Clear All Alerts
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-[11px] text-red-400 hover:text-red-300 font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-[11px] uppercase font-bold text-zinc-400 block">Total Registered Users</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {users.length}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-[11px] uppercase font-bold text-zinc-400 block">Total Capital Funded</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              ₦{totalInvestedAmount.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-[11px] uppercase font-bold text-zinc-400 block">Disbursed Payouts</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              ₦{totalPayouts.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-red-600/40">
            <span className="text-[11px] uppercase font-bold text-red-400 block">Pending Payments</span>
            <span className="text-2xl font-black text-red-400 font-mono mt-1 block">
              {pendingPayments.length}
            </span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Investor Management ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'payments'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Payment Confirmations ({pendingPayments.length})
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'withdrawals'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Withdrawal Approvals</span>
            {pendingBonusWithdrawals.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-extrabold shadow animate-pulse">
                {pendingBonusWithdrawals.length} Bonus
              </span>
            )}
            {allPendingWithdrawals.length > 0 && pendingBonusWithdrawals.length === 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
                {allPendingWithdrawals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('messages');
              markAllMessagesAsRead();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Support Inbox</span>
            {unreadMessages.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold animate-pulse shadow-sm">
                {unreadMessages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'cms'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Website CMS & Image Manager
          </button>
        </div>

        {/* ---------------- TAB 1: INVESTOR MANAGEMENT TABLE ---------------- */}
        {/* "USER'S dashboard details should also show on the admin dashboard" */}
        {/* "user account name should also show on the admin dashboard" */}
        {/* "in the admin dashboard, admin should be able to see the following: the amount user invested, the number of the referral they have ." */}
        {/* "on the admin dashboard indicate the plan user purchased either snail plan, fish plan, or poultry plan" */}
        {/* "include investment date on the admin dashboard" */}
        {/* "add last withdrawal date to the admin dashboard" */}
        {/* "show last withdrawal date for bonus withdrawal also" */}
        {/* "their should be a button where admin can approve a pending user account status" */}
        {/* "admin should be able to control Dividend Commitment Progress from Admin Dashboard" */}
        {/* "Stop user from withdrawing: toggle to block withdrawals per user" */}
        {/* "make the delete button in the admin dashboard to be responsive" */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, account name, email..."
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>
              <span className="text-xs text-zinc-400">
                Showing {filteredUsers.length} of {users.length} investors
              </span>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Investor & Account Name</th>
                    <th className="py-3.5 px-4">Bank & Account No. (10 Figs)</th>
                    <th className="py-3.5 px-4">Plan Purchased</th>
                    <th className="py-3.5 px-4">Amount Invested</th>
                    <th className="py-3.5 px-4">Referrals & Bonus</th>
                    <th className="py-3.5 px-4">Investment & Last Payout Dates</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Dividend Commitment Progress</th>
                    <th className="py-3.5 px-4">Status & Permissions</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-zinc-500">
                        No investor records matched your query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const plan = u.activePlan;
                      const progress = plan?.dividendCommitmentPercent || 0;
                      const userPendingBonus = transactions.find(
                        t => t.userId === u.id && t.type === 'bonus_withdrawal' && t.status === 'pending'
                      );

                      return (
                        <tr key={u.id} className="hover:bg-zinc-900/60 transition-colors">
                          {/* Col 1: Investor & Account Name */}
                          <td className="py-4 px-4">
                            <strong className="text-white block text-sm">{u.fullName}</strong>
                            <span className="text-zinc-400 text-[11px] block">{u.email}</span>
                            <span className="text-[11px] text-zinc-500">{u.phone}</span>
                            <span className="text-[10px] text-emerald-400 block mt-0.5">
                              Acct Name: <strong className="text-zinc-200">{u.accountName}</strong>
                            </span>
                          </td>

                          {/* Col 2: Bank Details & Account Name */}
                          <td className="py-4 px-4 space-y-0.5">
                            <span className="text-zinc-200 font-semibold block">{u.bankName}</span>
                            <span className="font-mono font-bold text-white text-xs tracking-wider block">
                              {u.accountNumber}
                            </span>
                            <span className="text-[11px] text-emerald-400 font-medium block">
                              Acct Name: <strong className="text-zinc-100 font-bold">{u.accountName}</strong>
                            </span>
                          </td>

                          {/* Col 3: Plan Purchased */}
                          <td className="py-4 px-4">
                            {plan ? (
                              <div className="space-y-1">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase inline-flex items-center gap-1.5 ${
                                    plan.planId === 'poultry'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      : plan.planId === 'fish'
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  }`}
                                >
                                  {plan.planId === 'snail' ? '🐌 Snail Plan' : plan.planId === 'fish' ? '🐟 Fish Plan' : '🐔 Poultry Plan'}
                                </span>
                                <span className="block text-[10px] text-zinc-400 font-mono">
                                  {plan.paymentApproved ? '✓ Payment Verified' : '⏳ Proof Under Review'}
                                </span>
                                {/* View Uploaded Proof of Payment */}
                                {plan.proofImage && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProof({
                                      image: plan.proofImage!,
                                      userName: u.fullName,
                                      userEmail: u.email,
                                      planName: plan.planName,
                                      amount: plan.amount,
                                      notes: `Transfer from ${plan.proofSenderName || u.fullName}. Ref: ${plan.proofReference || 'N/A'}`,
                                      userId: u.id,
                                      bankName: u.bankName,
                                      accountNumber: u.accountNumber,
                                      accountName: u.accountName,
                                    })}
                                    className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-400 hover:text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                                    title="View uploaded proof of payment receipt"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View Proof</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-zinc-500 italic text-[11px]">No active plan</span>
                            )}
                          </td>

                          {/* Col 4: Amount Invested */}
                          <td className="py-4 px-4">
                            <div className="font-mono font-extrabold text-sm text-emerald-400">
                              {plan ? `₦${plan.amount.toLocaleString()}` : '₦0'}
                            </div>
                            <span className="block text-[10px] text-zinc-400 mt-0.5">
                              {plan ? (plan.paymentApproved ? 'Active Portfolio' : 'Pending Confirmation') : 'Zero Active Capital'}
                            </span>
                          </td>

                          {/* Col 5: Number of Referrals & Bonus */}
                          <td className="py-4 px-4 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-white font-extrabold text-xs inline-flex items-center gap-1">
                                👥 {u.referralCount} {u.referralCount === 1 ? 'Referral' : 'Referrals'}
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-300 font-mono">
                              Bonus: <strong className="text-emerald-400">₦{u.referralBonusBalance.toLocaleString()}</strong>
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              Ref Code: <span className="text-zinc-200">{u.referralCode}</span>
                            </div>

                            {/* Direct Referral Bonus Approval if User Has Pending Request */}
                            {userPendingBonus && (
                              <div className="mt-1.5 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/40">
                                <div className="text-[10px] font-bold text-yellow-300 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-yellow-400 shrink-0" />
                                  Bonus Req: ₦{userPendingBonus.amount.toLocaleString()}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    approveBonusWithdrawal(u.id, userPendingBonus.id);
                                    showToast(`Referral bonus of ₦${userPendingBonus.amount.toLocaleString()} approved for ${u.fullName}! Referral count reset.`);
                                  }}
                                  className="mt-1.5 w-full py-1 bg-[#00A86B] hover:bg-emerald-600 text-white text-[10px] font-bold rounded cursor-pointer transition-all shadow"
                                >
                                  Approve Bonus Payout
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Col 6: Dates */}
                          <td className="py-4 px-4 text-[11px] text-zinc-400 space-y-1">
                            <div>
                              Investment Date:{' '}
                              <strong className="text-zinc-200">
                                {plan ? new Date(plan.purchaseDate).toLocaleDateString() : '—'}
                              </strong>
                            </div>
                            <div>
                              Last Withdrawal Date:{' '}
                              <strong className="text-zinc-200">
                                {u.lastWithdrawalDate ? new Date(u.lastWithdrawalDate).toLocaleDateString() : 'None'}
                              </strong>
                            </div>
                            <div>
                              Last Bonus Payout:{' '}
                              <strong className="text-zinc-200">
                                {u.lastBonusWithdrawalDate ? new Date(u.lastBonusWithdrawalDate).toLocaleDateString() : 'None'}
                              </strong>
                            </div>
                          </td>

                          {/* Col 7: Dividend Commitment Progress Control - "admin should be able to control Dividend Commitment Progress from Admin Dashboard" */}
                          <td className="py-4 px-4 min-w-[210px]">
                            {plan ? (
                              <div className="space-y-2 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-zinc-300">Commitment Bar:</span>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={progress}
                                      onChange={(e) => updateCommitmentPercent(u.id, Number(e.target.value))}
                                      className="w-12 px-1 py-0.5 text-center bg-black border border-zinc-700 text-xs font-mono font-bold text-emerald-400 rounded outline-none focus:border-emerald-500"
                                    />
                                    <span className="text-zinc-400 text-xs font-mono">%</span>
                                  </div>
                                </div>

                                <div className="relative w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>

                                {/* Admin manual slider updater */}
                                <div className="flex items-center gap-2">
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={progress}
                                    onChange={(e) => updateCommitmentPercent(u.id, Number(e.target.value))}
                                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                  />
                                </div>

                                {/* Quick Presets for Days / Percentages */}
                                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                                  <button
                                    type="button"
                                    onClick={() => updateCommitmentPercent(u.id, 0)}
                                    className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] rounded font-mono"
                                    title="Reset to 0%"
                                  >
                                    0%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCommitmentPercent(u.id, Math.max(0, progress - 10))}
                                    className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] rounded font-mono"
                                    title="Decrease 10%"
                                  >
                                    -10%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCommitmentPercent(u.id, Math.min(100, progress + 10))}
                                    className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] rounded font-mono"
                                    title="Increase 10%"
                                  >
                                    +10%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCommitmentPercent(u.id, 7)}
                                    className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] rounded font-mono"
                                    title="Day 1 (7%)"
                                  >
                                    Day 1 (7%)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCommitmentPercent(u.id, 50)}
                                    className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] rounded font-mono"
                                    title="Day 7 (50%)"
                                  >
                                    Day 7 (50%)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCommitmentPercent(u.id, 100)}
                                    className="px-1.5 py-0.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[9px] rounded font-bold font-mono"
                                    title="Day 14 (100% Mature)"
                                  >
                                    100% (Day 14)
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-zinc-600 text-[11px]">—</span>
                            )}
                          </td>

                          {/* Col 8: Status & Withdrawal Toggle */}
                          <td className="py-4 px-4 space-y-2">
                            {/* Account Status Approval Button */}
                            {u.status === 'pending' ? (
                              <button
                                onClick={() => {
                                  approveUserStatus(u.id);
                                  showToast(`Investor status approved for ${u.fullName}!`);
                                }}
                                className="px-2.5 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 rounded text-[10px] font-bold cursor-pointer"
                              >
                                Approve Account
                              </button>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-semibold">
                                Approved
                              </span>
                            )}

                            {/* Withdrawal Lock Toggle */}
                            <div className="pt-1">
                              <button
                                onClick={() => {
                                  toggleWithdrawalBlock(u.id);
                                  showToast(`Withdrawals ${u.withdrawalsBlocked ? 'Allowed' : 'Blocked'} for ${u.fullName}`);
                                }}
                                className={`flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer ${
                                  u.withdrawalsBlocked ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'
                                }`}
                              >
                                {u.withdrawalsBlocked ? (
                                  <>
                                    <ToggleRight className="w-4 h-4 text-red-500" />
                                    <span>Withdrawals Blocked</span>
                                  </>
                                ) : (
                                  <>
                                    <ToggleLeft className="w-4 h-4 text-emerald-500" />
                                    <span>Withdrawals Open</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Col 9: Action Buttons */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Inspect User Dashboard Details Modal */}
                              <button
                                type="button"
                                onClick={() => setPreviewUserModal(u)}
                                title={`Show ${u.fullName}'s complete dashboard details directly on Admin Dashboard`}
                                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm"
                              >
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Dashboard Details</span>
                              </button>

                              {/* View User's Live Interactive Dashboard */}
                              <button
                                type="button"
                                onClick={() => {
                                  viewUserDashboardAsAdmin(u.id);
                                  showToast(`Viewing ${u.fullName}'s live investor dashboard`);
                                }}
                                title={`Open ${u.fullName}'s live dashboard`}
                                className="px-3 py-1.5 rounded-xl bg-[#00A86B] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer whitespace-nowrap"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Live View</span>
                              </button>

                              {/* Message User Notice */}
                              <button
                                type="button"
                                onClick={() => setTargetUserForMessage(u)}
                                title="Send direct message / announcement"
                                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>

                              {/* Responsive Delete Button */}
                              <button
                                type="button"
                                onClick={() => setUserToDelete(u)}
                                title={`Delete ${u.fullName}'s account permanently`}
                                className="px-2.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-600 border border-red-700/60 text-red-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: PAYMENT CONFIRMATIONS ---------------- */}
        {/* "admin should be able to confirm payment ,when ever a user make payment to the company's account" */}
        {/* "admin should be able to view user's uploaded prove of payment from admin dashboard" */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Pending Plan Payment Receipts</h3>
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Txn Ref / Date</th>
                    <th className="py-3 px-4">Investor Name</th>
                    <th className="py-3 px-4">Plan Purchased</th>
                    <th className="py-3 px-4">Amount (NGN)</th>
                    <th className="py-3 px-4">Sender & Notes</th>
                    <th className="py-3 px-4">Proof Receipt</th>
                    <th className="py-3 px-4 text-right">Confirmation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {pendingPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-500">
                        No pending payment proofs. All transfers have been verified.
                      </td>
                    </tr>
                  ) : (
                    pendingPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-900/60">
                        <td className="py-4 px-4 font-mono text-zinc-300">{p.id}</td>
                        <td className="py-4 px-4 space-y-0.5">
                          <strong className="text-white block text-sm">{p.userName}</strong>
                          <span className="text-zinc-500 text-[11px] block">{p.userEmail}</span>
                          <span className="text-[11px] text-emerald-400 font-medium block">
                            Acct Name: <strong className="text-zinc-200">{p.accountName}</strong> ({p.bankName} - {p.accountNumber})
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-emerald-400">{p.planName}</td>
                        <td className="py-4 px-4 font-mono font-bold text-white text-sm">
                          ₦{p.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-zinc-400">{p.notes}</td>
                        <td className="py-4 px-4">
                          {p.proofImage ? (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedProof({
                                  image: p.proofImage!,
                                  userName: p.userName,
                                  userEmail: p.userEmail,
                                  planName: p.planName || 'Plan',
                                  amount: p.amount,
                                  notes: p.notes,
                                  userId: p.userId,
                                  transactionId: p.id,
                                  bankName: p.bankName,
                                  accountNumber: p.accountNumber,
                                  accountName: p.accountName,
                                })
                              }
                              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-emerald-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Receipt
                            </button>
                          ) : (
                            <span className="text-zinc-500 italic">No image</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              confirmPayment(p.userId, p.id);
                              showToast(`Payment of ₦${p.amount.toLocaleString()} confirmed for ${p.userName}! 14-day dividend bar started.`);
                            }}
                            className="px-4 py-2 bg-[#00A86B] hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer"
                          >
                            Confirm Payment
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: WITHDRAWAL APPROVALS ---------------- */}
        {/* "admin should know when user request to withdraw his or her referral bonus" */}
        {/* "admin should be able to approve referral bonus withdrawal and delete user account" */}
        {/* "Once a user request for referral and approved by the admin, the number of referral on the user's dashboard should vanish" */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Referral Bonus & Capital Withdrawal Approvals
                </h3>
                <p className="text-xs text-zinc-400">
                  Review and authorize investor payouts. Approving a referral bonus resets the user's referral count to 0 and logs the disbursement.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-semibold">
                  {pendingBonusWithdrawals.length} Pending Referral Bonus
                </span>
                <span className="px-3 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800">
                  {allPendingWithdrawals.length} Total Pending
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Txn ID / Date</th>
                    <th className="py-3.5 px-4">Investor Details</th>
                    <th className="py-3.5 px-4">Payout Type</th>
                    <th className="py-3.5 px-4">Amount (NGN)</th>
                    <th className="py-3.5 px-4">Destination Bank Account</th>
                    <th className="py-3.5 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {allPendingWithdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                        <span className="block font-semibold text-zinc-400">No pending withdrawal requests.</span>
                        <span className="text-[11px]">All investor dividend and referral payouts are up to date.</span>
                      </td>
                    </tr>
                  ) : (
                    allPendingWithdrawals.map((w) => {
                      const targetUser = users.find(u => u.id === w.userId);
                      const isBonus = w.type === 'bonus_withdrawal';

                      return (
                        <tr key={w.id} className="hover:bg-zinc-900/60 transition-colors">
                          {/* Txn ID & Date */}
                          <td className="py-4 px-4 font-mono text-zinc-300">
                            <span className="font-bold text-white block">{w.id}</span>
                            <span className="text-[11px] text-zinc-500">
                              {new Date(w.date).toLocaleString()}
                            </span>
                          </td>

                          {/* Investor Details & View Dashboard */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <strong className="text-white block text-sm">{w.userName}</strong>
                                <span className="text-zinc-400 text-[11px] block">{w.userEmail}</span>
                                {isBonus && targetUser && (
                                  <span className="text-[10px] text-yellow-400 font-semibold block mt-0.5">
                                    Current Referrals: {targetUser.referralCount} (Will reset to 0)
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  viewUserDashboardAsAdmin(w.userId);
                                  showToast(`Switched to ${w.userName}'s dashboard`);
                                }}
                                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-700 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                                title="View this investor's personal dashboard"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Dashboard</span>
                              </button>
                            </div>
                          </td>

                          {/* Payout Type */}
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-block ${
                                isBonus
                                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                                  : w.type === 'dividend_withdrawal'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {isBonus ? '★ Referral Bonus Payout' : w.type.replace('_', ' ')}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 font-mono font-extrabold text-emerald-400 text-sm">
                            ₦{w.amount.toLocaleString()}
                          </td>

                          {/* Destination Bank Account */}
                          <td className="py-4 px-4 text-zinc-300 space-y-0.5">
                            <span className="font-semibold block text-zinc-200">{w.bankName}</span>
                            <span className="font-mono text-white text-xs font-bold block">{w.accountNumber}</span>
                            <span className="text-[11px] text-emerald-400 font-medium block">Acct Name: <strong className="text-zinc-100 font-bold">{w.accountName}</strong></span>
                          </td>

                          {/* Admin Actions: Approve & Reject */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isBonus ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    approveBonusWithdrawal(w.userId, w.id);
                                    showToast(
                                      `Referral bonus of ₦${w.amount.toLocaleString()} approved for ${w.userName}! Referral count vanished.`
                                    );
                                  }}
                                  className="px-4 py-2 bg-[#00A86B] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/40 cursor-pointer transition-all whitespace-nowrap"
                                  title="Authorize bonus withdrawal and reset referral count"
                                >
                                  Approve Bonus Payout
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    approveWithdrawalTransaction(w.id);
                                    showToast(`Withdrawal of ₦${w.amount.toLocaleString()} approved for ${w.userName}!`);
                                  }}
                                  className="px-4 py-2 bg-[#00A86B] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/40 cursor-pointer transition-all whitespace-nowrap"
                                >
                                  Approve Payout
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  rejectBonusWithdrawal(w.id, 'Declined by Administrator');
                                  showToast(`Withdrawal request for ${w.userName} declined.`);
                                }}
                                className="px-2.5 py-2 bg-zinc-900 hover:bg-red-950 border border-zinc-800 hover:border-red-600 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                title="Decline withdrawal request"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ---------------- PLATFORM WITHDRAWAL TRANSACTION HISTORY (AUDIT TRAIL) ---------------- */}
            {/* "Keep data of any withdrawal made on both the user dashboard and the admin dashboard (transaction history)" */}
            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCheck className="w-5 h-5 text-emerald-400" />
                    Complete Withdrawal Transaction History (Platform Audit Ledger)
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Comprehensive ledger of all dividend withdrawals, referral bonuses, and capital refunds requested or processed on ZARU Enterprise.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-zinc-400">
                    Total Disbursed:{' '}
                    <strong className="text-emerald-400 font-mono text-sm">
                      ₦{allWithdrawalTransactions
                        .filter(t => t.status === 'approved')
                        .reduce((acc, t) => acc + t.amount, 0)
                        .toLocaleString()}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Filter Tabs & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setWithdrawalFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      withdrawalFilter === 'all'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    All ({allWithdrawalTransactions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawalFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      withdrawalFilter === 'approved'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    Approved ({allWithdrawalTransactions.filter(t => t.status === 'approved').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawalFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      withdrawalFilter === 'pending'
                        ? 'bg-yellow-600 text-white shadow'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    Pending ({allWithdrawalTransactions.filter(t => t.status === 'pending').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawalFilter('bonus')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      withdrawalFilter === 'bonus'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    Referral Bonuses ({allWithdrawalTransactions.filter(t => t.type === 'bonus_withdrawal').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawalFilter('dividend')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      withdrawalFilter === 'dividend'
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    Dividends ({allWithdrawalTransactions.filter(t => t.type === 'dividend_withdrawal').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawalFilter('capital')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      withdrawalFilter === 'capital'
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    Capital Refunds ({allWithdrawalTransactions.filter(t => t.type === 'capital_withdrawal').length})
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={withdrawalSearch}
                    onChange={(e) => setWithdrawalSearch(e.target.value)}
                    placeholder="Search transaction or investor..."
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Ref ID / Date</th>
                      <th className="py-3.5 px-4">Investor</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Plan</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Destination Bank Account</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {(() => {
                      const list = allWithdrawalTransactions
                        .filter(t => {
                          if (withdrawalFilter === 'approved') return t.status === 'approved';
                          if (withdrawalFilter === 'pending') return t.status === 'pending';
                          if (withdrawalFilter === 'rejected') return t.status === 'rejected';
                          if (withdrawalFilter === 'bonus') return t.type === 'bonus_withdrawal';
                          if (withdrawalFilter === 'dividend') return t.type === 'dividend_withdrawal';
                          if (withdrawalFilter === 'capital') return t.type === 'capital_withdrawal';
                          return true;
                        })
                        .filter(t => {
                          if (!withdrawalSearch.trim()) return true;
                          const q = withdrawalSearch.toLowerCase();
                          return (
                            t.id.toLowerCase().includes(q) ||
                            t.userName.toLowerCase().includes(q) ||
                            t.userEmail.toLowerCase().includes(q) ||
                            t.accountNumber.includes(q) ||
                            (t.bankName && t.bankName.toLowerCase().includes(q))
                          );
                        });

                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-zinc-500 text-xs">
                              No withdrawal records match the selected filter.
                            </td>
                          </tr>
                        );
                      }

                      return list.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-900/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-zinc-300">
                            <span className="font-bold text-white block">{tx.id}</span>
                            <span className="text-[10px] text-zinc-500">
                              {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <strong className="text-white block">{tx.userName}</strong>
                            <span className="text-zinc-400 text-[11px] block">{tx.userEmail}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              tx.type === 'bonus_withdrawal'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : tx.type === 'dividend_withdrawal'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}>
                              {tx.type === 'bonus_withdrawal' ? '★ Referral Bonus' : tx.type === 'dividend_withdrawal' ? 'Dividend Payout' : 'Capital Return'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300">{tx.planName || '—'}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                            ₦{tx.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300">
                            <span className="block font-semibold text-zinc-200">{tx.bankName}</span>
                            <span className="block font-mono text-xs text-white">{tx.accountNumber}</span>
                            {tx.accountName && <span className="block text-[10px] text-zinc-400">({tx.accountName})</span>}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                              tx.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : tx.status === 'rejected'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {tx.status === 'approved' ? '✓ Approved' : tx.status === 'rejected' ? '✕ Rejected' : '⏳ Pending'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-zinc-400 max-w-[200px] truncate" title={tx.notes}>
                            {tx.notes || 'Disbursed to investor bank.'}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: SUPPORT INBOX & TWO-WAY MESSAGES ---------------- */}
        {/* "on the user dashboard, add where user can communicate with admin. message sent through this rout should display on the admin dashboard" */}
        {/* "on the user and admin communication rout, user should be able to upload images as a message ot type letters if he/se wants" */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Investor Inquiries & Support Messages</h3>
                <p className="text-xs text-zinc-400">
                  Direct communication desk with investors. Messages stop counting once read by admin.
                </p>
              </div>
              {unreadMessages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    markAllMessagesAsRead();
                    showToast('All messages marked as read.');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All as Read ({unreadMessages.length})
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 shrink-0">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>All messages read</span>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 space-y-4">
              <div className="max-h-96 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-500">
                    No support messages logged yet.
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                        m.sender === 'user'
                          ? m.isRead
                            ? 'bg-zinc-900/90 border-zinc-800 text-zinc-200'
                            : 'bg-zinc-900 border-red-500/60 text-white shadow-lg shadow-red-950/20'
                          : 'bg-red-950/40 border-red-600/40 text-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {m.sender === 'user' ? '👤 Investor:' : '🛡️ Admin Reply:'} {m.userName}
                          </span>
                          {m.sender === 'user' && (
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                m.isRead
                                  ? 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                                  : 'bg-red-600 text-white animate-pulse'
                              }`}
                            >
                              {m.isRead ? 'Read ✓' : 'New Unread'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-zinc-500">{new Date(m.timestamp).toLocaleString()}</span>
                          {m.sender === 'user' && !m.isRead && (
                            <button
                              type="button"
                              onClick={() => {
                                markMessageAsRead(m.id);
                                showToast('Message marked as read');
                              }}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      {m.imageAttachment && (
                        <div className="mt-2 inline-block rounded-lg overflow-hidden border border-zinc-700">
                          <img
                            src={m.imageAttachment}
                            alt="Uploaded attachment"
                            className="max-h-48 w-auto object-cover cursor-pointer hover:opacity-90"
                            onClick={() =>
                              setSelectedProof({
                                image: m.imageAttachment!,
                                userName: m.userName,
                                planName: 'Attached Photo',
                                amount: 0,
                              })
                            }
                          />
                        </div>
                      )}
                      {m.sender === 'user' && (
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const targetUser = users.find(u => u.id === m.userId);
                              if (targetUser) setTargetUserForMessage(targetUser);
                            }}
                            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Reply directly to user's dashboard
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 5: WEBSITE CMS & GENERAL IMAGE UPLOADER ---------------- */}
        {/* "the admin should be able to make changes, upload images to the landing page and the website in general" */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Website CMS & Image Manager</h3>
                <p className="text-xs text-zinc-400">
                  Update headlines, contact channels, and upload custom images for Snail Plan, Fish Plan, Poultry Plan, and company emblem.
                </p>
              </div>

              {/* Upload Images for the 3 Plans */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  Replace Agricultural Plan Images
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Snail Plan Image */}
                  <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3 text-xs">
                    <span className="font-bold text-white block">Snail Plan Image</span>
                    <div className="h-32 w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img
                        src={cmsConfig.planImages.snail}
                        alt="Snail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="block w-full py-2 text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold rounded-lg cursor-pointer">
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImageForPlan('snail', e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Fish Plan Image */}
                  <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3 text-xs">
                    <span className="font-bold text-white block">Fish Plan Image</span>
                    <div className="h-32 w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img
                        src={cmsConfig.planImages.fish}
                        alt="Fish"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="block w-full py-2 text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold rounded-lg cursor-pointer">
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImageForPlan('fish', e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Poultry Plan Image */}
                  <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3 text-xs">
                    <span className="font-bold text-white block">Poultry Plan Image</span>
                    <div className="h-32 w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img
                        src={cmsConfig.planImages.poultry}
                        alt="Poultry"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="block w-full py-2 text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold rounded-lg cursor-pointer">
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImageForPlan('poultry', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Text & Contact Channel Editor */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  Landing Page Headlines & Contacts
                </span>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Hero Main Headline</label>
                    <input
                      type="text"
                      value={cmsHeadline}
                      onChange={(e) => setCmsHeadline(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Hero Subheadline</label>
                    <textarea
                      rows={2}
                      value={cmsSubhead}
                      onChange={(e) => setCmsSubhead(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={cmsWhatsapp}
                        onChange={(e) => setCmsWhatsapp(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">Official Company Email</label>
                      <input
                        type="email"
                        value={cmsEmail}
                        onChange={(e) => setCmsEmail(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      updateCMSConfig({
                        heroHeadline: cmsHeadline,
                        heroSubheadline: cmsSubhead,
                        whatsappNumber: cmsWhatsapp,
                        companyEmail: cmsEmail,
                      });
                      showToast('Website content updated successfully!');
                    }}
                    className="px-6 py-2.5 bg-[#00A86B] hover:bg-emerald-600 text-white font-bold rounded-lg cursor-pointer transition-all"
                  >
                    Save CMS Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ---------------- PROOF VIEWER MODAL ---------------- */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 modal-backdrop-blur">
          <div 
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  Proof Receipt: {selectedProof.userName}
                </h4>
                <p className="text-xs text-zinc-400">
                  {selectedProof.planName} • <span className="font-mono text-emerald-400 font-bold">₦{selectedProof.amount.toLocaleString()}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Investor Bank & Account Name Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl text-xs my-2">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Investor Account Name:</span>
                <strong className="text-emerald-400 text-sm block font-bold">
                  {selectedProof.accountName || 'Registered Investor'}
                </strong>
                <span className="text-zinc-300 text-[11px] block mt-0.5">
                  {selectedProof.bankName} • <span className="font-mono font-bold text-white">{selectedProof.accountNumber}</span>
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Payment Notes / Reference:</span>
                <p className="text-zinc-200 text-xs mt-0.5 line-clamp-2">
                  {selectedProof.notes || 'Direct bank transfer proof to Moniepoint 6394899106'}
                </p>
              </div>
            </div>

            <div className="py-3 overflow-y-auto flex items-center justify-center bg-black rounded-xl border border-zinc-900 my-1">
              <img
                src={selectedProof.image}
                alt="Receipt Full View"
                className="max-h-[50vh] max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <span className="text-[11px] text-zinc-500">
                Verifying this payment begins the investor's 14-day automatic dividend commitment cycle.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedProof(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold border border-zinc-800 cursor-pointer"
                >
                  Close
                </button>
                {selectedProof.userId && (
                  <button
                    type="button"
                    onClick={() => {
                      confirmPayment(selectedProof.userId!, selectedProof.transactionId);
                      showToast(`Payment of ₦${selectedProof.amount.toLocaleString()} confirmed for ${selectedProof.userName}! 14-day dividend bar started.`);
                      setSelectedProof(null);
                    }}
                    className="px-5 py-2 bg-[#00A86B] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Payment Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- DIRECT MESSAGE MODAL ---------------- */}
      {/* "Send direct message: drop a message that appears directly on the user's dashboard" */}
      {targetUserForMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 modal-backdrop-blur">
          <div 
            className="relative w-full max-w-md bg-zinc-950 border border-red-600/60 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                Message {targetUserForMessage.fullName}
              </h4>
              <button
                onClick={() => setTargetUserForMessage(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendDirectMessage} className="space-y-4">
              <div className="text-xs text-zinc-400">
                This notice will appear at the top of <strong>{targetUserForMessage.fullName}'s</strong> personal investor dashboard.
              </div>

              <textarea
                required
                rows={4}
                value={directMessageText}
                onChange={(e) => setDirectMessageText(e.target.value)}
                placeholder="e.g. Your Moniepoint payment transfer has been verified. Welcome to Cycle #49."
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wide rounded-lg cursor-pointer"
              >
                Transmit Notice to User Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- USER'S DASHBOARD DETAILS MODAL ---------------- */}
      {/* "USER'S dashboard details should also show on the admin dashboard" */}
      {/* "user account name should also show on the admin dashboard" */}
      {previewUserModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setPreviewUserModal(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {previewUserModal.fullName}'s Dashboard Details
                  </h3>
                  <span className="text-xs text-zinc-400">
                    Investor ID: <strong className="font-mono text-zinc-300">{previewUserModal.id}</strong> • Status:{' '}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      previewUserModal.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {previewUserModal.status}
                    </span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewUserModal(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Investor & Bank Information (with User Account Name prominently displayed) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Profile Card */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Investor Profile
                </span>
                <div className="space-y-1">
                  <div>Name: <strong className="text-white">{previewUserModal.fullName}</strong></div>
                  <div>Email: <strong className="text-zinc-200 font-mono">{previewUserModal.email}</strong></div>
                  <div>Phone: <strong className="text-zinc-200 font-mono">{previewUserModal.phone}</strong></div>
                  <div>Registered: <strong className="text-zinc-300">{new Date(previewUserModal.createdAt).toLocaleDateString()}</strong></div>
                  <div>Referrals: <strong className="text-emerald-400">{previewUserModal.referralCount}</strong> (Bonus: ₦{previewUserModal.referralBonusBalance.toLocaleString()})</div>
                </div>
              </div>

              {/* Bank Details Card - Prominently showing Account Name */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-500/30 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Verified Payout Bank Account
                </span>
                <div className="space-y-1">
                  <div>Bank Name: <strong className="text-white">{previewUserModal.bankName}</strong></div>
                  <div>Account Number: <strong className="text-emerald-400 font-mono font-bold text-sm">{previewUserModal.accountNumber}</strong></div>
                  <div className="pt-1 border-t border-zinc-800/80">
                    <span className="text-zinc-400 block text-[10px] uppercase">Bank Account Name:</span>
                    <strong className="text-white text-sm font-extrabold block text-emerald-300">
                      {previewUserModal.accountName}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Plan & Commitment Progress */}
            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Current Agro Investment Plan</span>
                  <h4 className="text-base font-bold text-white">
                    {previewUserModal.activePlan ? previewUserModal.activePlan.planName : 'No Active Plan'}
                  </h4>
                </div>
                {previewUserModal.activePlan && (
                  <div className="flex items-center gap-2">
                    <span className="text-base font-mono font-bold text-emerald-400">
                      ₦{previewUserModal.activePlan.amount.toLocaleString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      previewUserModal.activePlan.paymentApproved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {previewUserModal.activePlan.paymentApproved ? 'Payment Verified' : 'Pending Confirmation'}
                    </span>
                  </div>
                )}
              </div>

              {previewUserModal.activePlan ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-zinc-500 block">Purchase Date:</span>
                      <strong className="text-zinc-200">{new Date(previewUserModal.activePlan.purchaseDate).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Maturity Date:</span>
                      <strong className="text-zinc-200">{new Date(previewUserModal.activePlan.maturityDate).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Dividends Withdrawn:</span>
                      <strong className="text-emerald-400 font-mono">{previewUserModal.activePlan.dividendWithdrawalCount} of 2</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Capital Status:</span>
                      <strong className={previewUserModal.activePlan.dividendWithdrawalCount >= 2 ? 'text-emerald-400' : 'text-amber-400'}>
                        {previewUserModal.activePlan.dividendWithdrawalCount >= 2 ? 'UNLOCKED' : 'LOCKED'}
                      </strong>
                    </div>
                  </div>

                  {/* Dividend Commitment Progress Control for Admin */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-zinc-300">Dividend Commitment Progress:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {previewUserModal.activePlan.dividendCommitmentPercent}%
                      </span>
                    </div>

                    <div className="relative w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${previewUserModal.activePlan.dividendCommitmentPercent}%` }}
                      ></div>
                    </div>

                    {/* Admin Slider Control */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={previewUserModal.activePlan.dividendCommitmentPercent}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateCommitmentPercent(previewUserModal.id, val);
                          setPreviewUserModal(prev => prev && prev.activePlan ? {
                            ...prev,
                            activePlan: { ...prev.activePlan, dividendCommitmentPercent: val }
                          } : prev);
                        }}
                        className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateCommitmentPercent(previewUserModal.id, 100);
                          setPreviewUserModal(prev => prev && prev.activePlan ? {
                            ...prev,
                            activePlan: { ...prev.activePlan, dividendCommitmentPercent: 100 }
                          } : prev);
                        }}
                        className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold rounded shrink-0 cursor-pointer"
                      >
                        Set 100% (Day 14)
                      </button>
                    </div>
                  </div>

                  {/* Proof of Payment Thumbnail if attached */}
                  {previewUserModal.activePlan.proofImage && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span className="text-zinc-300">Proof of payment uploaded: {previewUserModal.activePlan.proofSenderName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProof({
                            image: previewUserModal.activePlan!.proofImage!,
                            userName: previewUserModal.fullName,
                            userEmail: previewUserModal.email,
                            planName: previewUserModal.activePlan!.planName,
                            amount: previewUserModal.activePlan!.amount,
                            notes: `Transfer from ${previewUserModal.activePlan!.proofSenderName}. Ref: ${previewUserModal.activePlan!.proofReference}`,
                            userId: previewUserModal.id,
                            bankName: previewUserModal.bankName,
                            accountNumber: previewUserModal.accountNumber,
                            accountName: previewUserModal.accountName,
                          });
                        }}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Receipt
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-500">Investor has not yet purchased a farm package.</p>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  viewUserDashboardAsAdmin(previewUserModal.id);
                  setPreviewUserModal(null);
                  showToast(`Opened ${previewUserModal.fullName}'s live dashboard`);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#00A86B] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Open User's Live Interactive Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewUserModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- RESPONSIVE DELETE USER CONFIRMATION MODAL ---------------- */}
      {/* "make the delete button in the admin dashboard to be responsive" */}
      {/* "admin should be able to approve referral bonus withdrawal and delete user account" */}
      {userToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setUserToDelete(null)}
        >
          <div 
            className="relative w-full max-w-md bg-zinc-950 border-2 border-red-600 rounded-2xl p-6 shadow-2xl space-y-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Permanently Delete Investor?</h4>
                <p className="text-xs text-red-400 font-semibold">
                  This action is irreversible and purges all records.
                </p>
              </div>
            </div>

            {/* Investor Breakdown Card */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Investor Name:</span>
                <strong className="text-white font-semibold">{userToDelete.fullName}</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Email:</span>
                <span className="text-zinc-300 font-mono">{userToDelete.email}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Bank & Account:</span>
                <span className="text-zinc-300 font-mono">{userToDelete.bankName} ({userToDelete.accountNumber})</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Amount Invested:</span>
                <strong className="text-emerald-400 font-mono font-bold">
                  ₦{userToDelete.activePlan?.amount ? userToDelete.activePlan.amount.toLocaleString() : '0'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Number of Referrals:</span>
                <strong className="text-white font-mono">{userToDelete.referralCount} referrals</strong>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Deleting this account will permanently erase their active agro investment plan, payout transactions, referral tree connections, and chat messages from the platform.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/60 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Confirm Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
