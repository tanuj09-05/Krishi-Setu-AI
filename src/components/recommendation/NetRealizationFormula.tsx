'use client';

import React from 'react';
import { Calculator, Minus } from 'lucide-react';
import { Badge } from '../ui/Badge';

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
    <div className="bg-[#0d1810] text-white rounded-2xl p-5 border border-white/10 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-brand-700/30 text-brand-400 border border-brand-600/30">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              The Net Realization Core Formula
              <span className="text-[9px] bg-brand-600 text-white font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Key Differentiator
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Why KrishiSetu AI looks beyond headline mandi prices to calculate your actual in-pocket profit.
            </p>
          </div>
        </div>
      </div>

      {/* Formula Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 items-center text-center">
        {/* Step 1: Selling Price */}
        <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/8">
          <span className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider block">
            Offered Price
          </span>
          <div className="text-xl font-bold text-white mt-1 tabular-nums">
            ₹{sellingPrice.toFixed(2)}
            <span className="text-xs font-normal text-slate-400">/kg</span>
          </div>
          <span className="text-[10px] text-slate-500">Buyer / Mandi quote</span>
        </div>

        {/* Minus Sign */}
        <div className="hidden md:flex justify-center text-amber-400">
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </div>

        {/* Step 2: Transport Cost */}
        <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/8">
          <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider block">
            Transport Cost
          </span>
          <div className="text-xl font-bold text-rose-400 mt-1 tabular-nums">
            −₹{transportCost.toFixed(2)}
            <span className="text-xs font-normal text-slate-400">/kg</span>
          </div>
          <span className="text-[10px] text-slate-500">Distance & freight</span>
        </div>

        {/* Minus Sign */}
        <div className="hidden md:flex justify-center text-amber-400">
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </div>

        {/* Step 3: Cess & Storage */}
        <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/8">
          <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
            Cess & Handling
          </span>
          <div className="text-xl font-bold text-amber-400 mt-1 tabular-nums">
            −₹{(storageCost + mandiCess).toFixed(2)}
            <span className="text-xs font-normal text-slate-400">/kg</span>
          </div>
          <span className="text-[10px] text-slate-500">Mandi fees & weighment</span>
        </div>
      </div>

      {/* Result Callout */}
      <div className="mt-4 pt-3 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-900/40 rounded-xl p-3.5 border border-brand-700/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            =
          </div>
          <div className="text-left">
            <div className="text-[10px] text-brand-300 font-medium">Actual Farmer Take-Home Payout</div>
            <div className="text-sm sm:text-base font-semibold text-white">
              Estimated Net Realization: <span className="text-amber-300 font-bold text-lg tabular-nums">₹{netRealization.toFixed(2)}/kg</span>
            </div>
          </div>
        </div>

        <div className="text-xs bg-black/40 px-3.5 py-2 rounded-lg text-slate-200 border border-white/10 text-center sm:text-right">
          For <strong>500 kg {cropName}</strong> lot = <strong className="text-brand-400 text-sm tabular-nums">₹{(netRealization * 500).toLocaleString('en-IN')}</strong> Net Revenue
        </div>
      </div>
    </div>
  );
};
