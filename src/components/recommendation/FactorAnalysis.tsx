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
      <div className="md:col-span-2 bg-white rounded-xl p-5 shadow-card border border-stone-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-100">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              Explainable AI Decision Factors
            </h3>
            <p className="text-xs text-stone-500">
              Why the algorithm chose Buyer A over nearby APMC mandis and outstation markets
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg border transition ${
                reason.type === 'positive'
                  ? 'bg-brand-50/50 border-brand-200/80 text-brand-950'
                  : reason.type === 'warning'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}
            >
              {reason.type === 'positive' && (
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              )}
              {reason.type === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              {reason.type === 'neutral' && (
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              )}

              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {reason.text}
                </p>
              </div>

              {reason.impactScore && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700 shrink-0">
                  {reason.impactScore}% match
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 1-Col Risk Assessment Card */}
      <div className="bg-[#0d1810] text-white rounded-xl p-5 shadow-card border border-white/10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Trade Risk Analysis</h3>
              <p className="text-[11px] text-slate-400">Guarding against unforeseen losses</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-white/5 rounded-lg p-3 border border-white/8">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                Crop Spoilage Risk
              </div>
              <div className="text-brand-400 font-semibold text-xs flex items-center justify-between">
                <span>{riskAnalysis.spoilageRisk}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/8">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                Arrivals / Price Drop Risk
              </div>
              <div className="text-amber-400 font-semibold text-xs flex items-center justify-between">
                <span>{riskAnalysis.priceDropRisk}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/8">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                Payment Default Risk
              </div>
              <div className="text-brand-400 font-semibold text-xs flex items-center justify-between">
                <span>{riskAnalysis.paymentRisk}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/8 text-[10px] text-slate-400 flex items-center gap-1.5">
          <Scale className="w-3 h-3 text-brand-400 shrink-0" />
          <span>Fair trade metrics monitored by KrishiSetu Trust Engine</span>
        </div>
      </div>
    </div>
  );
};
