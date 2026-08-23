'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  UserCheck2,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  CheckCircle2,
  Receipt,
  Sprout,
  Award,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

const TABS = [
  { id: 'info',  label: 'Farm & Identity'    },
  { id: 'sales', label: 'Sales & Payments'   },
  { id: 'trust', label: 'Trust & KYC'        },
  { id: 'help',  label: 'Settings & Help'    },
];

const trustFactors = [
  { label: 'Quality Grade Consistency', value: 96, color: 'bg-brand-600' },
  { label: 'On-Time Farm Gate Loading', value: 92, color: 'bg-brand-500' },
  { label: 'Dispute-Free Settlements', value: 98, color: 'bg-accent-sky' },
  { label: 'Buyer Feedback Rating', value: 98, display: '★ 4.9/5.0', color: 'bg-accent-amber' },
];

export default function ProfilePage() {
  const { farmer, transactions, language, setLanguage } = useApp();
  const { currentRole, loginAsRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'sales' | 'trust' | 'help'>('info');

  const totalEarnings = transactions.reduce((acc, t) => acc + t.netRealizationAmount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-2">
      <PageHeader
        eyebrow="Farmer Account"
        eyebrowIcon={UserCheck2}
        title="Profile & Settings"
        description="Manage your farm credentials, review past sale payouts, and view verification status."
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
                {farmer.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">{farmer.name}</h2>
                  <span title="Aadhaar KYC Verified">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {farmer.village}, {farmer.district}, {farmer.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {farmer.phone}
                  </span>
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
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
              <Sprout className="w-4 h-4 text-stone-500" />
              <span>Farm Holding & Credentials</span>
            </h3>

            <div className="space-y-1 text-xs">
              {[
                { label: 'Cultivable Land', value: `${farmer.landHoldingAcres} Acres (Drip Irrigated)` },
                { label: 'Primary Crops', value: farmer.primaryCrops.join(', '), accent: true },
                { label: 'FPO Collective', value: `${farmer.fpoName || 'Sahyadri'} Collective` },
                { label: 'FPO Member ID', value: farmer.fpoMemberId, mono: true },
                { label: 'Linked Bank Account', value: 'SBI Direct DBT (**4921)' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-b-0">
                  <span className="text-stone-500">{row.label}</span>
                  <span className={`font-semibold ${row.accent ? 'text-brand-800' : 'text-stone-800'} ${row.mono ? 'font-mono text-2xs' : ''}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Sales & Payments (Formerly Transactions/Escrow) */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          <div className="bg-brand-50 border border-brand-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-2xs text-brand-800 font-semibold uppercase block">Total Lifetime Sales Payout</span>
              <span className="text-xl font-bold text-brand-900 tabular-nums">₹{totalEarnings.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-2xs text-brand-700 bg-white border border-brand-200 px-2 py-1 rounded">
              {transactions.length} Completed Settlements
            </span>
          </div>

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

      {/* TAB 4: Settings & Help */}
      {activeTab === 'help' && (
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card space-y-4">
          <h3 className="text-xs sm:text-sm font-semibold text-stone-900 pb-2 border-b border-stone-100">
            Language & Support Settings
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Preferred Language</label>
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

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-stone-900">Farmer Toll-Free Helpline</p>
              <p className="text-2xs text-stone-500">1800-123-KRISHI (7 AM – 8 PM Daily)</p>
            </div>
            <a
              href="tel:18001235747"
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded text-xs transition"
            >
              Call Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
