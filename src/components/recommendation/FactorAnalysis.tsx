'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, Info, ShieldCheck, Scale, ThumbsUp } from 'lucide-react';
import { RecommendationReason } from '../../types';

interface FactorAnalysisProps {
  reasons: RecommendationReason[];
  riskAnalysis?: {
    spoilageRisk: string;
    priceDropRisk: string;
    paymentRisk: string;
  };
}

export const FactorAnalysis: React.FC<FactorAnalysisProps> = ({
  reasons,
  riskAnalysis = {
    spoilageRisk: 'Low (4-5 days shelf life)',
    priceDropRisk: 'Moderate (Arrivals rising by Day 4)',
    paymentRisk: 'Minimal (Digital Escrow Protected)',
  },
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 2-Col Reasons Breakdown */}
      <div className="md:col-span-2 bg-white rounded-xl p-5 shadow-card border border-stone-200/80">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
          <ThumbsUp className="w-4 h-4 text-stone-500" />
          <div>
            <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
              Explainable AI Decision Factors
            </h3>
            <p className="text-xs text-stone-500">
              Why the algorithm prioritized Buyer A over nearby APMC mandis
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg border transition ${
                reason.type === 'positive'
                  ? 'bg-brand-50/40 border-brand-200/70 text-stone-800'
                  : reason.type === 'warning'
                  ? 'bg-amber-50/50 border-amber-200/70 text-stone-800'
                  : 'bg-stone-50 border-stone-200/80 text-stone-800'
              }`}
            >
              {reason.type === 'positive' && (
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              )}
              {reason.type === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
              )}
              {reason.type === 'neutral' && (
                <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              )}

              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {reason.text}
                </p>
              </div>

              {reason.impactScore && (
                <span className="text-2xs font-semibold px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 shrink-0 tabular-nums">
                  {reason.impactScore}% match
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 1-Col Risk Assessment Card */}
      <div className="bg-white rounded-xl p-5 shadow-card border border-stone-200/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
            <ShieldCheck className="w-4 h-4 text-stone-500" />
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Trade Risk Assessment</h3>
              <p className="text-2xs text-stone-500">Protection against market volatility</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
              <span className="text-2xs text-stone-400 uppercase tracking-wider font-semibold block mb-0.5">
                Crop Spoilage Risk
              </span>
              <div className="text-brand-800 font-semibold text-xs flex items-center justify-between">
                <span>{riskAnalysis.spoilageRisk}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
              <span className="text-2xs text-stone-400 uppercase tracking-wider font-semibold block mb-0.5">
                Arrivals & Price Drop Risk
              </span>
              <div className="text-accent-amber font-semibold text-xs flex items-center justify-between">
                <span>{riskAnalysis.priceDropRisk}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-amber"></span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
              <span className="text-2xs text-stone-400 uppercase tracking-wider font-semibold block mb-0.5">
                Payment Default Risk
              </span>
              <div className="text-brand-800 font-semibold text-xs flex items-center justify-between">
                <span>{riskAnalysis.paymentRisk}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 text-2xs text-stone-500 flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span>Monitored by KrishiSetu Trust Engine</span>
        </div>
      </div>
    </div>
  );
};
