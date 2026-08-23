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
  CheckCircle2,
  AlertTriangle,
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
  const buyerName = recommendation.recommendedDestination.name.split('(')[0].trim();
  const totalInHand = recommendation.estimatedNetRealizationPerKg * recommendation.quantityKg;

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-card overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-stone-50/80 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-600"></span>
          <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
            Optimal Selling Recommendation
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-xs text-stone-600 font-medium">
            {recommendation.cropName} ({recommendation.quantityKg.toLocaleString('en-IN')} kg)
          </span>
        </div>

        {/* Confidence Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-2xs text-stone-400 font-medium">AI Confidence:</span>
          <div className="w-16 h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-stone-800 tabular-nums">{confidence}%</span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Core Recommendation Callout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <p className="text-2xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Recommended Action
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              Sell to {buyerName} within the next 2–3 days
            </h2>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{recommendation.recommendedSellingWindow}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/recommendations"
              className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors"
            >
              Why this pick?
            </Link>
            <Link
              href="/buyers"
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-md shadow-subtle transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <span>Connect with Buyer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4-Item Financial Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg bg-stone-50/70 border border-stone-200/60">
            <span className="text-2xs text-stone-500 font-medium uppercase tracking-wider block">
              Gross Offer Price
            </span>
            <div className="text-lg font-bold text-stone-900 mt-1 tabular-nums">
              ₹{recommendation.expectedPricePerKg.toFixed(2)}
              <span className="text-2xs font-normal text-stone-500">/kg</span>
            </div>
            <span className="text-2xs text-stone-400 mt-0.5 block truncate">
              {recommendation.recommendedDestination.location}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-stone-50/70 border border-stone-200/60">
            <span className="text-2xs text-stone-500 font-medium uppercase tracking-wider block">
              Transport Freight
            </span>
            <div className="text-lg font-bold text-accent-rose mt-1 tabular-nums">
              −₹{recommendation.transportCostPerKg.toFixed(2)}
              <span className="text-2xs font-normal text-stone-500">/kg</span>
            </div>
            <span className="text-2xs text-stone-400 mt-0.5 block">
              ₹{(recommendation.transportCostPerKg * recommendation.quantityKg).toLocaleString('en-IN')} freight
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-stone-50/70 border border-stone-200/60">
            <span className="text-2xs text-stone-500 font-medium uppercase tracking-wider block">
              Mandi Cess / Deduction
            </span>
            <div className="text-lg font-bold text-stone-900 mt-1 tabular-nums">
              ₹0.00
              <span className="text-2xs font-normal text-stone-500">/kg</span>
            </div>
            <span className="text-2xs text-brand-700 font-medium mt-0.5 block">
              0% direct buyer
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-brand-50/80 border border-brand-200">
            <span className="text-2xs text-brand-800 font-semibold uppercase tracking-wider block">
              Est. Net Realization
            </span>
            <div className="text-xl font-bold text-brand-900 mt-1 tabular-nums">
              ₹{recommendation.estimatedNetRealizationPerKg.toFixed(2)}
              <span className="text-2xs font-normal text-stone-500">/kg</span>
            </div>
            <span className="text-2xs text-brand-700 font-semibold mt-0.5 block">
              ₹{totalInHand.toLocaleString('en-IN')} take-home
            </span>
          </div>
        </div>

        {/* Intelligence Rationale Bullets */}
        {recommendation.reasons && recommendation.reasons.length > 0 && (
          <div className="pt-1">
            <p className="text-2xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Decision Drivers
            </p>
            <div className="space-y-1.5">
              {recommendation.reasons.slice(0, 2).map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                  <span>{reason.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
