'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, Info, TrendingUp, ShieldCheck, Truck, Scale, ThumbsUp } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 2-Col Reasons Breakdown */}
      <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-card border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-100 text-brand-700">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Explainable AI Decision Factors
            </h3>
            <p className="text-xs text-slate-500">
              Why the algorithm chose Buyer A over nearby APMC mandis and outstation markets
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border transition ${
                reason.type === 'positive'
                  ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                  : reason.type === 'warning'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {reason.type === 'positive' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {reason.type === 'warning' && (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              {reason.type === 'neutral' && (
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              )}

              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {reason.text}
                </p>
              </div>

              {reason.impactScore && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
                  {reason.impactScore}% match
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 1-Col Risk Assessment Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-card border border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Trade Risk Analysis</h3>
              <p className="text-xs text-slate-400">Guarding against unforeseen losses</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-bold mb-0.5">
                Crop Spoilage Risk
              </div>
              <div className="text-emerald-400 font-bold text-sm flex items-center justify-between">
                <span>{riskAnalysis.spoilageRisk}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-bold mb-0.5">
                Arrivals / Price Drop Risk
              </div>
              <div className="text-amber-400 font-bold text-sm flex items-center justify-between">
                <span>{riskAnalysis.priceDropRisk}</span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-bold mb-0.5">
                Payment Default Risk
              </div>
              <div className="text-emerald-400 font-bold text-sm flex items-center justify-between">
                <span>{riskAnalysis.paymentRisk}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span>Fair trade metrics monitored by KrishiSetu Trust Engine</span>
        </div>
      </div>
    </div>
  );
};
