'use client';

import React from 'react';
import { Calculator, ArrowRight, Minus, Equal, Info } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-emerald-900 via-brand-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-brand-500/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-400/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              The Net Realization Core Formula
              <span className="text-[10px] bg-brand-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Key Differentiator
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Why KrishiSetu AI looks beyond headline mandi prices to calculate your actual in-pocket profit.
            </p>
          </div>
        </div>
      </div>

      {/* Formula Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 items-center text-center">
        {/* Step 1: Selling Price */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10">
          <span className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider block">
            Offered Price
          </span>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">
            ₹{sellingPrice.toFixed(2)}
            <span className="text-xs font-normal text-slate-300">/kg</span>
          </div>
          <span className="text-[10px] text-slate-400">Buyer / Mandi quote</span>
        </div>

        {/* Minus Sign */}
        <div className="hidden md:flex justify-center text-amber-400">
          <Minus className="w-6 h-6 stroke-[3]" />
        </div>

        {/* Step 2: Transport Cost */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10">
          <span className="text-[11px] text-rose-300 font-semibold uppercase tracking-wider block">
            Transport Cost
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-300 mt-1">
            -₹{transportCost.toFixed(2)}
            <span className="text-xs font-normal text-slate-300">/kg</span>
          </div>
          <span className="text-[10px] text-slate-400">Distance & freight</span>
        </div>

        {/* Minus Sign */}
        <div className="hidden md:flex justify-center text-amber-400">
          <Minus className="w-6 h-6 stroke-[3]" />
        </div>

        {/* Step 3: Cess & Storage */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10">
          <span className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider block">
            Cess & Handling
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
            -₹{(storageCost + mandiCess).toFixed(2)}
            <span className="text-xs font-normal text-slate-300">/kg</span>
          </div>
          <span className="text-[10px] text-slate-400">Mandi fees & weighment</span>
        </div>
      </div>

      {/* Result Callout */}
      <div className="mt-4 pt-4 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-500/20 rounded-2xl p-4 border border-brand-400/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-lg shadow-md">
            =
          </div>
          <div className="text-left">
            <div className="text-xs text-emerald-200 font-medium">Actual Farmer Take-Home Payout</div>
            <div className="text-lg sm:text-xl font-bold text-white">
              Estimated Net Realization: <span className="text-emerald-300 font-black text-2xl">₹{netRealization.toFixed(2)}/kg</span>
            </div>
          </div>
        </div>

        <div className="text-xs bg-black/40 px-3.5 py-2 rounded-xl text-slate-200 border border-white/10 text-center sm:text-right">
          For <strong>500 kg {cropName}</strong> lot = <strong className="text-emerald-400 text-sm">₹{(netRealization * 500).toLocaleString('en-IN')}</strong> Net Revenue
        </div>
      </div>
    </div>
  );
};
