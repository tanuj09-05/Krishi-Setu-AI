'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck2,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  CheckCircle2,
  Award,
  Sprout,
  Receipt,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';

const trustFactors = [
  { label: 'Quality Grade Consistency', value: 96, color: 'bg-brand-600' },
  { label: 'On-Time Farm Gate Loading', value: 92, color: 'bg-brand-500' },
  { label: 'Dispute-Free Settlements', value: 98, color: 'bg-sky-500' },
  { label: 'Buyer Feedback Rating', value: 98, display: '★ 4.9/5.0', color: 'bg-amber-400' },
];

export default function ProfilePage() {
  const { farmer, transactions, lots } = useApp();

  const verificationBadges = [
    { icon: ShieldCheck, color: 'text-brand-700', bg: 'bg-brand-50', label: 'KYC & Aadhaar Verified', sub: 'Government UIDAI matched' },
    { icon: Building2, color: 'text-sky-700', bg: 'bg-sky-50', label: 'FPO Certified Member', sub: `${farmer.fpoName?.split(' ')[0] ?? ''} Farms FPC` },
    { icon: Receipt, color: 'text-indigo-700', bg: 'bg-indigo-50', label: 'Bank Account Linked', sub: 'Direct DBT enabled (T+0)' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Farmer Identity & Trust Profile"
        eyebrowIcon={UserCheck2}
        title="Profile & Trust Score"
      />

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
          {/* Avatar + Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-brand-800 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
              {farmer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{farmer.name}</h2>
                <span title="KYC Verified"><CheckCircle2 className="w-4 h-4 text-brand-600" /></span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-600" />
                  {farmer.village}, {farmer.district}, {farmer.state}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-stone-400" />
                  {farmer.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Trust Score */}
          <div className="bg-brand-50 border border-brand-200 rounded-xl px-5 py-3.5 text-center shrink-0 min-w-[130px]">
            <p className="text-[9px] text-brand-700 font-semibold uppercase tracking-widest">Trust Score</p>
            <p className="text-3xl font-bold text-brand-800 mt-0.5 tabular-nums">{farmer.trustScore}</p>
            <p className="text-[10px] text-brand-600 font-semibold">Tier 1 Farmer</p>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-stone-100">
          {verificationBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
                <div className={`p-1.5 rounded-lg ${badge.bg} shrink-0`}>
                  <Icon className={`w-4 h-4 ${badge.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-xs text-gray-900">{badge.label}</p>
                  <p className="text-[10px] text-stone-500">{badge.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Farm Details + Trust Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Farm Details */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-card">
          <SectionHeader icon={Sprout} iconAccent="green" title="Farm & Crop Portfolio" />
          <div className="space-y-1 text-xs">
            {[
              { label: 'Cultivable Land', value: `${farmer.landHoldingAcres} Acres (Drip Irrigated)` },
              { label: 'Primary Crops', value: farmer.primaryCrops.join(', '), accent: true },
              { label: 'FPO Member ID', value: farmer.fpoMemberId, mono: true },
              { label: 'Lots on KrishiSetu', value: `${farmer.totalLotsSold} lots traded` },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-b-0">
                <span className="text-stone-500">{row.label}</span>
                <span className={`font-semibold ${row.accent ? 'text-brand-800' : 'text-gray-800'} ${row.mono ? 'font-mono text-[10px]' : ''}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Score Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-card">
          <SectionHeader icon={Award} iconAccent="amber" title="Trust Engine Scoring" />
          <div className="space-y-4">
            {trustFactors.map((factor, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-stone-700">{factor.label}</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {factor.display ?? `${factor.value}%`}
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${factor.color}`}
                    style={{ width: `${factor.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
