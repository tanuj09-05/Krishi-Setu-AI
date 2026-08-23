'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  UserCheck2,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Receipt,
  Sprout,
  Award,
  Globe,
  HelpCircle,
  Edit3,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  X,
  Plus,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

const TABS = [
  { id: 'info',  label: 'Farm & Identity'    },
  { id: 'sales', label: 'Sales & Payments'   },
  { id: 'trust', label: 'Trust & KYC'        },
  { id: 'help',  label: 'Settings & Security'},
];

const trustFactors = [
  { label: 'Quality Grade Consistency', value: 96, color: 'bg-brand-600' },
  { label: 'On-Time Farm Gate Loading', value: 92, color: 'bg-brand-500' },
  { label: 'Dispute-Free Settlements', value: 98, color: 'bg-accent-sky' },
  { label: 'Buyer Feedback Rating', value: 98, display: '★ 4.9/5.0', color: 'bg-accent-amber' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { farmer, transactions, language, setLanguage, showToast, refreshAllData } = useApp();
  const { currentUser, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'sales' | 'trust' | 'help'>('info');

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || farmer.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone_number || farmer.phone || '');
  const [editLocation, setEditLocation] = useState(currentUser?.location || `${farmer.village}, ${farmer.district}` || '');
  const [editFarmSize, setEditFarmSize] = useState(String(farmer.landHoldingAcres || 2.5));
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  const totalEarnings = transactions.reduce((acc, t) => acc + t.netRealizationAmount, 0);

  const handleOpenEditModal = () => {
    setEditName(currentUser?.name || farmer.name || '');
    setEditEmail(currentUser?.email || '');
    setEditPhone(currentUser?.phone_number || farmer.phone || '');
    setEditLocation(currentUser?.location || (farmer.village ? `${farmer.village}, ${farmer.district}` : ''));
    setEditFarmSize(String(farmer.landHoldingAcres || 2.5));
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const parts = editLocation.split(',');
      const village = parts[0]?.trim() || editLocation;
      const district = parts[1]?.trim() || 'Nashik';

      await updateProfile({
        name: editName,
        email: editEmail || undefined,
        phone_number: editPhone || undefined,
        location: editLocation,
        village,
        district,
        farm_size_acres: parseFloat(editFarmSize) || 2.0,
      });

      await refreshAllData();
      showToast('Profile Updated', 'Your personal and farm details have been saved.');
      setIsEditModalOpen(false);
    } catch (err) {
      showToast('Update Failed', 'Could not save profile changes. Please try again.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(oldPassword, newPassword, confirmNewPassword);
      showToast('Password Changed', 'Your account password has been successfully updated.');
      setIsPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      if (err?.data?.old_password) {
        setPassError(Array.isArray(err.data.old_password) ? err.data.old_password[0] : String(err.data.old_password));
      } else {
        setPassError('Incorrect current password. Please try again.');
      }
    } finally {
      setIsChangingPass(false);
    }
  };

  const displayName = currentUser?.name || farmer.name || 'Farmer';
  const displayLocation = currentUser?.location || (farmer.village ? `${farmer.village}, ${farmer.district}` : 'Maharashtra');
  const displayEmail = currentUser?.email || 'Not specified';
  const displayPhone = currentUser?.phone_number || farmer.phone || 'Not specified';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-2">
      <PageHeader
        eyebrow="Farmer Account"
        eyebrowIcon={UserCheck2}
        title="Profile & Settings"
        description="Manage your farm credentials, review past sale payouts, and update account security."
        action={
          <button
            onClick={handleOpenEditModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 hover:border-stone-300 rounded-md text-xs font-semibold text-stone-800 shadow-subtle transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-stone-500" />
            <span>Edit Profile</span>
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-brand-700 text-brand-800 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Farm & Identity */}
      {activeTab === 'info' && (
        <div className="space-y-5">
          {/* Identity Card */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-brand-700 flex items-center justify-center text-white font-bold text-base shadow-subtle shrink-0">
                {displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">{displayName}</h2>
                  <span title="Aadhaar KYC Verified">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {displayLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {displayPhone}
                  </span>
                  {displayEmail !== 'Not specified' && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      {displayEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-brand-50 border border-brand-200/80 rounded-lg px-4 py-2 text-center shrink-0">
              <span className="text-2xs text-brand-700 font-semibold uppercase block">Trust Score</span>
              <span className="text-2xl font-bold text-brand-900 tabular-nums block">{farmer.trustScore}%</span>
              <span className="text-2xs text-brand-700 font-medium">Tier 1 Farmer</span>
            </div>
          </div>

          {/* Farm Details */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-stone-500" />
                <span>Farm Holding & Credentials</span>
              </h3>
              <button
                onClick={handleOpenEditModal}
                className="text-2xs font-semibold text-brand-700 hover:text-brand-800"
              >
                Update Details
              </button>
            </div>

            <div className="space-y-1 text-xs">
              {[
                { label: 'Cultivable Land', value: `${farmer.landHoldingAcres} Acres (Drip Irrigated)` },
                { label: 'Primary Commercial Crops', value: farmer.primaryCrops.join(', '), accent: true },
                { label: 'Farm Location', value: displayLocation },
                { label: 'FPO Collective', value: farmer.fpoName || 'Sahyadri Farmers Collective' },
                { label: 'Linked Bank Account', value: 'Direct DBT Bank Payout Linked' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-b-0">
                  <span className="text-stone-500">{row.label}</span>
                  <span className={`font-semibold ${row.accent ? 'text-brand-800' : 'text-stone-800'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Sales & Payments */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          <div className="bg-brand-50 border border-brand-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-2xs text-brand-800 font-semibold uppercase block">Total Net Realized Payout</span>
              <span className="text-xl font-bold text-brand-900 tabular-nums">₹{totalEarnings.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-2xs text-brand-700 bg-white border border-brand-200 px-2 py-1 rounded">
              {transactions.length} Settlements Completed
            </span>
          </div>

          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="bg-white rounded-xl border border-stone-200/80 shadow-card p-4 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm text-stone-900">{txn.cropName}</span>
                        <Badge variant={txn.paymentStatus === 'completed' ? 'success' : 'warning'} size="sm" dot>
                          {txn.paymentStatus === 'completed' ? 'Settled to Bank' : 'In Escrow'}
                        </Badge>
                      </div>
                      <p className="text-2xs text-stone-500">
                        Sold to {txn.buyerName} · {txn.quantityKg} kg · {txn.createdAt}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-brand-800 tabular-nums block">
                        ₹{txn.netRealizationAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-2xs text-stone-400">₹{txn.netRealizationPerKg.toFixed(2)}/kg net in-hand</span>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 text-2xs flex flex-wrap items-center justify-between gap-2 text-stone-600">
                    <span>Gross: ₹{txn.grossAmount.toLocaleString('en-IN')}</span>
                    <span>Transport: −₹{txn.logisticsCost}</span>
                    <span>Mandi Fees: ₹0.00</span>
                    {txn.utrNumber && <span className="font-mono text-stone-500">UTR: {txn.utrNumber}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="When buyers accept your crop proposals, your bank receipts and escrow records will appear here."
              action={
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-700 text-white rounded text-xs font-semibold hover:bg-brand-800 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Sell a Crop</span>
                </Link>
              }
            />
          )}
        </div>
      )}

      {/* TAB 3: Trust & KYC */}
      {activeTab === 'trust' && (
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Award className="w-4 h-4 text-stone-500" />
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900">
              KrishiSetu Trust & Verification Engine
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
              <ShieldCheck className="w-4 h-4 text-brand-700 mb-1" />
              <p className="font-semibold text-xs text-stone-900">Aadhaar KYC Verified</p>
              <p className="text-2xs text-stone-500">UIDAI match complete</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
              <Building2 className="w-4 h-4 text-stone-700 mb-1" />
              <p className="font-semibold text-xs text-stone-900">FPO Collective</p>
              <p className="text-2xs text-stone-500">Member ID: {farmer.fpoMemberId}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
              <Receipt className="w-4 h-4 text-brand-700 mb-1" />
              <p className="font-semibold text-xs text-stone-900">Bank Account Linked</p>
              <p className="text-2xs text-stone-500">Direct DBT enabled (T+0)</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block">
              Trust Score Breakdown Factors
            </span>
            {trustFactors.map((factor, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-stone-600">{factor.label}</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {factor.display ?? `${factor.value}%`}
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${factor.color}`} style={{ width: `${factor.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Settings & Security */}
      {activeTab === 'help' && (
        <div className="space-y-5">
          {/* Language selection */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-stone-500" />
              <span>Language Preference</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {['English', 'मराठी', 'हिंदी'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`py-2 px-3 rounded-md text-xs font-medium border transition ${
                    language.includes(lang)
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Security & Password */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-500" />
              <span>Security & Password</span>
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-stone-900">Account Password</p>
                <p className="text-2xs text-stone-500 mt-0.5">
                  Change your password to keep your crops and payout records secure.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-semibold text-xs rounded-md transition"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Support Helpline & Logout */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-stone-900">Farmer Toll-Free Helpline</p>
              <p className="text-2xs text-stone-500 mt-0.5">1800-123-KRISHI (7 AM – 8 PM Daily)</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="tel:18001235747"
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded text-xs transition"
              >
                Call Support
              </a>
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded text-xs transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-menu border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-stone-600" />
                <span>Edit Profile & Farm Info</span>
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-brand-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Location (Village, District)</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Dindori, Nashik"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-brand-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Farm Land (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editFarmSize}
                    onChange={(e) => setEditFarmSize(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-1.5 bg-stone-100 text-stone-700 font-semibold rounded text-xs hover:bg-stone-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded text-xs shadow-subtle transition disabled:opacity-50"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-menu border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-stone-600" />
                <span>Change Password</span>
              </h2>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {passError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {passError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-9 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-brand-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-9 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-brand-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-1.5 bg-stone-100 text-stone-700 font-semibold rounded text-xs hover:bg-stone-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded text-xs shadow-subtle transition disabled:opacity-50"
                >
                  {isChangingPass ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
