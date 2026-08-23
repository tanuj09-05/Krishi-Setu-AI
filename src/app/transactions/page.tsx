'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  Building,
  Coins,
  Scale,
} from 'lucide-react';

export default function TransactionsPage() {
  const { transactions, farmer } = useApp();

  const totalEarnings = transactions.reduce((acc, t) => acc + t.netRealizationAmount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-card border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-brand-700">
              <Receipt className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Protected Settlement Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Payment & Escrow Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full transparency on gross deal values, logistics deductions, and direct bank settlement receipts.
          </p>
        </div>

        {/* Summary Payout Pill */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-700/60 text-right min-w-[200px]">
          <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
            Total Net Realized Payout
          </span>
          <div className="text-2xl font-black text-white mt-0.5">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-300">Bank Account Linked (A/C **4921)</span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-6">
        {transactions.map((txn) => {
          const isCompleted = txn.paymentStatus === 'completed';

          return (
            <div
              key={txn.id}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6"
            >
              {/* Top Row: Deal & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {txn.lotNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        isCompleted
                          ? 'bg-emerald-100 text-brand-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {isCompleted ? 'Bank Settlement Done ✓' : 'Secured in Escrow'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {txn.cropName} ({txn.quantityKg.toLocaleString('en-IN')} kg)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Buyer: <strong>{txn.buyerName}</strong> • {txn.createdAt}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 font-semibold block">Agreed Deal Price</span>
                  <div className="text-lg font-bold text-slate-900">
                    ₹{txn.agreedPricePerKg.toFixed(2)}/kg
                  </div>
                  {txn.utrNumber && (
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold block">
                      UTR: {txn.utrNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* 4-Box Realization Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    1. Gross Value
                  </span>
                  <div className="text-base font-black text-slate-900 mt-1">
                    ₹{txn.grossAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">{txn.quantityKg} kg × ₹{txn.agreedPricePerKg}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-rose-400 uppercase font-bold block">
                    2. Transport Freight
                  </span>
                  <div className="text-base font-black text-rose-600 mt-1">
                    -₹{txn.logisticsCost.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">Direct carrier quote</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-amber-500 uppercase font-bold block">
                    3. Mandi Cess / Fees
                  </span>
                  <div className="text-base font-black text-amber-700 mt-1">
                    -₹{txn.mandiFeesOrPlatformDeduction.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">0% for direct buyers</span>
                </div>

                <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] text-brand-800 uppercase font-black block">
                    4. Final Net Realization
                  </span>
                  <div className="text-lg font-black text-brand-800 mt-1">
                    ₹{txn.netRealizationAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    ₹{txn.netRealizationPerKg.toFixed(2)}/kg Take-Home
                  </span>
                </div>
              </div>

              {/* Transaction Milestone Timeline */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                  Settlement Milestone Timeline
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {txn.timeline.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border text-xs ${
                        step.completed
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            step.completed ? 'text-brand-600' : 'text-slate-300'
                          }`}
                        />
                        <span>{step.step}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{step.description}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{step.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
