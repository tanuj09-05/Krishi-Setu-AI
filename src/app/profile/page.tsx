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
  Star,
  Award,
  Sprout,
  TrendingUp,
  Receipt,
  Layers,
} from 'lucide-react';

export default function ProfilePage() {
  const { farmer, transactions, lots } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Farmer Profile Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 border-2 border-brand-400 flex items-center justify-center text-white font-black text-2xl shadow-md">
              {farmer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{farmer.name}</h1>
                <span title="Aadhaar & Bank KYC Verified">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  {farmer.village}, {farmer.district}, {farmer.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {farmer.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center min-w-[140px]">
            <span className="text-[10px] text-brand-700 font-bold uppercase tracking-wider block">
              Krishi Trust Score
            </span>
            <div className="text-3xl font-black text-brand-800 mt-0.5">{farmer.trustScore}/100</div>
            <span className="text-[10px] text-emerald-600 font-bold">Tier 1 Verified Farmer</span>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-xs text-slate-900 block">KYC & Aadhaar Verified</span>
              <span className="text-[10px] text-slate-500">Government UIDAI matched</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Building2 className="w-5 h-5 text-brand-600 shrink-0" />
            <div>
              <span className="font-bold text-xs text-slate-900 block">FPO Certified Member</span>
              <span className="text-[10px] text-slate-500">{farmer.fpoName?.split(' ')[0]} Farms FPC</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Receipt className="w-5 h-5 text-sky-600 shrink-0" />
            <div>
              <span className="font-bold text-xs text-slate-900 block">Bank Account Linked</span>
              <span className="text-[10px] text-slate-500">Direct DBT enabled (T+0)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Score Breakdown & Farm Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farm & Crop Portfolio */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-brand-600" />
            <span>Farm & Crop Holding</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
              <span className="text-slate-500">Cultivable Land:</span>
              <strong className="text-slate-900">{farmer.landHoldingAcres} Acres (Drip Irrigated)</strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
              <span className="text-slate-500">Primary Commercial Crops:</span>
              <strong className="text-brand-800">{farmer.primaryCrops.join(', ')}</strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
              <span className="text-slate-500">FPO Member ID:</span>
              <span className="font-mono font-bold text-slate-700">{farmer.fpoMemberId}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
              <span className="text-slate-500">Total Lots Traded on KrishiSetu:</span>
              <strong className="text-slate-900">{farmer.totalLotsSold} Successful Lots</strong>
            </div>
          </div>
        </div>

        {/* Trust Score Factor Weights */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Trust Engine Scoring Breakdown</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 font-semibold">Quality Grade Consistency</span>
                <span className="font-bold text-slate-900">96%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-600 h-full w-[96%]"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 font-semibold">On-Time Farm Gate Loading</span>
                <span className="font-bold text-slate-900">92%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[92%]"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 font-semibold">Dispute-Free Settlements</span>
                <span className="font-bold text-slate-900">98%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full w-[98%]"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 font-semibold">Buyer Feedback Rating</span>
                <span className="font-bold text-slate-900">★ 4.9 / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
