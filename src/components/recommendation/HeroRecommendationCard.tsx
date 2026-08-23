'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Truck,
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
  const confidence = recommendation.confidencePercentage;

  return (
    <div className="bg-[#0d1810] text-white rounded-2xl overflow-hidden border border-white/10 shadow-card-md">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-white/8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <p className="text-[9px] font-semibold text-brand-400 uppercase tracking-widest">AI Recommendation Engine</p>
            <p className="text-sm font-semibold text-white leading-snug">
              Best opportunity · {recommendation.cropName} ({recommendation.quantityKg.toLocaleString('en-IN')} kg)
            </p>
          </div>
        </div>
        {/* Confidence bar */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-brand-400">{confidence}%</span>
          <span className="text-[10px] text-slate-500">confidence</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
        {/* Buyer */}
        <div className="bg-[#0d1810] px-4 py-4">
          <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Building className="w-3 h-3" /> Recommended Buyer
          </p>
          <p className="text-sm font-semibold text-white leading-snug truncate">
            {recommendation.recommendedDestination.name.split('(')[0].trim()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Truck className="w-2.5 h-2.5 text-brand-500" />
            {recommendation.recommendedDestination.location}
          </p>
        </div>

        {/* Gross Price */}
        <div className="bg-[#0d1810] px-4 py-4">
          <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Coins className="w-3 h-3" /> Gross Price
          </p>
          <p className="text-xl font-bold text-white tabular-nums">
            ₹{recommendation.expectedPricePerKg.toFixed(2)}
            <span className="text-xs font-normal text-slate-400">/kg</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Direct Farm Gate</p>
        </div>

        {/* Transport */}
        <div className="bg-[#0d1810] px-4 py-4">
          <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Truck className="w-3 h-3" /> Transport
          </p>
          <p className="text-xl font-bold text-rose-400 tabular-nums">
            −₹{recommendation.transportCostPerKg.toFixed(2)}
            <span className="text-xs font-normal text-slate-400">/kg</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            ₹{(recommendation.transportCostPerKg * recommendation.quantityKg).toLocaleString('en-IN')} total
          </p>
        </div>

        {/* Net Realization — highlighted */}
        <div className="bg-brand-900/60 px-4 py-4 border-l border-brand-700/40">
          <p className="text-[9px] font-semibold text-brand-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Net Realization
          </p>
          <p className="text-2xl font-bold text-amber-300 tabular-nums">
            ₹{recommendation.estimatedNetRealizationPerKg.toFixed(2)}
            <span className="text-xs font-bold text-white">/kg</span>
          </p>
          <p className="text-[10px] text-brand-300 font-semibold mt-0.5">
            ₹{(recommendation.estimatedNetRealizationPerKg * recommendation.quantityKg).toLocaleString('en-IN')} in-hand
          </p>
        </div>
      </div>

      {/* Footer: window + CTAs */}
      <div className="px-5 py-4 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            {recommendation.recommendedSellingWindow}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/recommendations"
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            AI Rationale
          </Link>
          <Link
            href="/buyers"
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors active:scale-95 flex items-center gap-1.5"
          >
            Connect with Buyer
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
