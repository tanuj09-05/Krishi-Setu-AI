'use client';

import React from 'react';
import { Calculator, Minus, Equal, ArrowRight } from 'lucide-react';

interface NetRealizationFormulaProps {
  sellingPrice?: number;
  transportCost?: number;
  storageCost?: number;
  mandiCess?: number;
  netRealization?: number;
  cropName?: string;
}

export const NetRealizationFormula: React.FC<NetRealizationFormulaProps> = ({
  sellingPrice = 24.0,
  transportCost = 1.5,
  storageCost = 0.0,
  mandiCess = 0.0,
  netRealization = 22.5,
  cropName = 'Tomato',
}) => {
  return (
    <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-stone-500" />
          <h3 className="font-semibold text-xs sm:text-sm text-stone-900">
            Net Realization Breakdown
          </h3>
          <span className="text-2xs text-stone-400 font-medium hidden sm:inline">
            · True In-Pocket Take-Home vs. Headline Mandi Rates
          </span>
        </div>
        <span className="text-2xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
          Direct vs Mandi Formula
        </span>
      </div>

      {/* Formula Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center text-center">
        {/* Step 1: Selling Price */}
        <div className="bg-stone-50/70 rounded-lg p-3 border border-stone-200/60">
          <span className="text-2xs text-stone-500 font-medium uppercase tracking-wider block">
            Offered Price
          </span>
          <div className="text-base sm:text-lg font-bold text-stone-900 mt-0.5 tabular-nums">
            ₹{sellingPrice.toFixed(2)}
            <span className="text-2xs font-normal text-stone-400">/kg</span>
          </div>
          <span className="text-2xs text-stone-400">Buyer quote</span>
        </div>

        {/* Minus Sign */}
        <div className="hidden md:flex justify-center text-stone-400">
          <Minus className="w-4 h-4" />
        </div>

        {/* Step 2: Transport Cost */}
        <div className="bg-stone-50/70 rounded-lg p-3 border border-stone-200/60">
          <span className="text-2xs text-stone-500 font-medium uppercase tracking-wider block">
            Transport Freight
          </span>
          <div className="text-base sm:text-lg font-bold text-accent-rose mt-0.5 tabular-nums">
            −₹{transportCost.toFixed(2)}
            <span className="text-2xs font-normal text-stone-400">/kg</span>
          </div>
          <span className="text-2xs text-stone-400">Route logistics</span>
        </div>

        {/* Minus Sign */}
        <div className="hidden md:flex justify-center text-stone-400">
          <Minus className="w-4 h-4" />
        </div>

        {/* Step 3: Cess & Storage */}
        <div className="bg-stone-50/70 rounded-lg p-3 border border-stone-200/60">
          <span className="text-2xs text-stone-500 font-medium uppercase tracking-wider block">
            Cess & Handling
          </span>
          <div className="text-base sm:text-lg font-bold text-stone-800 mt-0.5 tabular-nums">
            −₹{(storageCost + mandiCess).toFixed(2)}
            <span className="text-2xs font-normal text-stone-400">/kg</span>
          </div>
          <span className="text-2xs text-stone-400">0% on direct hub</span>
        </div>
      </div>

      {/* Result Callout */}
      <div className="mt-3.5 pt-3.5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-50/50 rounded-lg px-4 py-2.5 border border-brand-200/60">
        <div className="flex items-center gap-2">
          <Equal className="w-4 h-4 text-brand-700 shrink-0" />
          <span className="text-xs text-stone-700">
            Net In-Pocket Payout: <strong className="text-brand-900 font-bold tabular-nums">₹{netRealization.toFixed(2)}/kg</strong>
          </span>
        </div>

        <div className="text-2xs text-stone-500">
          For a 500 kg {cropName} lot = <strong className="text-brand-800 font-semibold tabular-nums">₹{(netRealization * 500).toLocaleString('en-IN')}</strong> direct credit
        </div>
      </div>
    </div>
  );
};
