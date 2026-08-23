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
  { label: 'Dispute-Free Settlements', value: 98, color: 'bg-accent-sky' },
  { label: 'Buyer Feedback Rating', value: 98, display: '★ 4.9/5.0', color: 'bg-accent-amber' },
];

export default function ProfilePage() {
  const { farmer, transactions, lots } = useApp();

  const verificationBadges = [
    { icon: ShieldCheck, color: 'text-brand-700', bg: 'bg-brand-50', label: 'KYC & Aadhaar Verified', sub: 'Government UIDAI matched' },
    { icon: Building2, color: 'text-stone-700', bg: 'bg-stone-100', label: 'FPO Certified Member', sub: `${farmer.fpoName?.split(' ')[0] ?? ''} Farms Collective` },
    { icon: Receipt, color: 'text-brand-700', bg: 'bg-brand-50', label: 'Bank Account Linked', sub: 'Direct DBT enabled (T+0)' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Farmer Identity"
        eyebrowIcon={UserCheck2}
        title="Profile & Trust Score"
        description="Verified identity credentials, farm crop holdings, and algorithmic trust scoring."
      />

      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          {/* Avatar + Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-brand-700 flex items-center justify-center text-white font-bold text-base shadow-subtle shrink-0">
              {farmer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">{farmer.name}</h2>
                <span title="KYC Verified">
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

          {/* Trust Score Tile */}
          <div className="bg-brand-50 border border-brand-200/80 rounded-lg px-4 py-2.5 text-center shrink-0 min-w-[120px]">
            <span className="text-2xs text-brand-700 font-semibold uppercase tracking-wider block">Trust Score</span>
            <span className="text-2xl font-bold text-brand-900 mt-0.5 tabular-nums block">{farmer.trustScore}</span>
            <span className="text-2xs text-brand-700 font-medium">Tier 1 Farmer</span>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-100">
          {verificationBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
                <div className={`p-1.5 rounded-md ${badge.bg} shrink-0`}>
                  <Icon className={`w-4 h-4 ${badge.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-xs text-stone-900">{badge.label}</p>
                  <p className="text-2xs text-stone-500">{badge.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Farm Details + Trust Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Farm Portfolio */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card">
          <SectionHeader icon={Sprout} title="Farm & Crop Holding" />
          <div className="space-y-1 text-xs">
            {[
              { label: 'Cultivable Land', value: `${farmer.landHoldingAcres} Acres (Drip Irrigated)` },
              { label: 'Primary Commercial Crops', value: farmer.primaryCrops.join(', '), accent: true },
              { label: 'FPO Member ID', value: farmer.fpoMemberId, mono: true },
              { label: 'Settled Lots Traded', value: `${farmer.totalLotsSold} lots completed` },
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

        {/* Trust Scoring Factors */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card">
          <SectionHeader icon={Award} title="Trust Engine Scoring Breakdown" />
          <div className="space-y-3 pt-1">
            {trustFactors.map((factor, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-stone-600">{factor.label}</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {factor.display ?? `${factor.value}%`}
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${factor.color}`}
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
