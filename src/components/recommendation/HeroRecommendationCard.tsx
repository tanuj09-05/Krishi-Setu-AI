'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Coins,
} from 'lucide-react';
import { AISaleRecommendation } from '../../types';

interface HeroRecommendationCardProps {
  recommendation: AISaleRecommendation;
  onActionClick?: () => void;
}

export const HeroRecommendationCard: React.FC<HeroRecommendationCardProps> = ({
  recommendation,
  onActionClick,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/40">
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header Badge & Confidence */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-emerald-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 block">
                AI Recommendation Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Best opportunity for your {recommendation.cropName} lot ({recommendation.quantityKg} kg)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>AI Confidence: <strong className="text-white text-sm">{recommendation.confidencePercentage}%</strong></span>
          </div>
        </div>

        {/* 4-Column Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* 1. Recommended Buyer */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/40 transition">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
              <Building className="w-4 h-4" />
              <span>Recommended Buyer</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white leading-snug truncate">
              {recommendation.recommendedDestination.name.split('(')[0]}
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-1">
              <Truck className="w-3 h-3 text-brand-300" />
              <span>{recommendation.recommendedDestination.location}</span>
            </div>
          </div>

          {/* 2. Expected Price */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/40 transition">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mb-1">
              <Coins className="w-4 h-4 text-amber-300" />
              <span>Offered Gross Price</span>
            </div>
            <div className="text-2xl font-black text-white">
              ₹{recommendation.expectedPricePerKg.toFixed(2)}
              <span className="text-xs font-normal text-slate-300">/kg</span>
            </div>
            <div className="text-xs text-emerald-300 mt-1">Direct Farm Gate / Hub</div>
          </div>

          {/* 3. Transport Cost */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/40 transition">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mb-1">
              <Truck className="w-4 h-4 text-rose-300" />
              <span>Transport Deduction</span>
            </div>
            <div className="text-2xl font-black text-rose-300">
              ₹{recommendation.transportCostPerKg.toFixed(2)}
              <span className="text-xs font-normal text-slate-300">/kg</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">₹750 total freight (Tata Ace)</div>
          </div>

          {/* 4. Highlighted Estimated Net Realization */}
          <div className="bg-gradient-to-br from-amber-500/25 via-brand-500/30 to-emerald-600/40 backdrop-blur-md rounded-2xl p-4 border-2 border-amber-400/60 shadow-lg shadow-amber-500/10">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Est. Net Realization</span>
            </div>
            <div className="text-3xl font-black text-amber-300">
              ₹{recommendation.estimatedNetRealizationPerKg.toFixed(2)}
              <span className="text-xs font-bold text-white">/kg</span>
            </div>
            <div className="text-xs text-slate-200 mt-1 font-semibold">
              Total In-Hand: ₹{(recommendation.estimatedNetRealizationPerKg * recommendation.quantityKg).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Action Window & Direct CTA */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-emerald-700/60 bg-black/25 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 rounded-b-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-300 font-medium">Recommendation Action Window</div>
              <div className="text-sm sm:text-base font-bold text-white">
                {recommendation.recommendedSellingWindow}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/recommendations"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition text-center"
            >
              Explain AI Rationale
            </Link>
            <Link
              href="/buyers"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-400/20 transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Connect with Buyer A</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
