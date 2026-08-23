'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';

export default function TransactionsPage() {
  const { transactions, farmer } = useApp();
  const totalEarnings = transactions.reduce((acc, t) => acc + t.netRealizationAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Protected Settlements"
        eyebrowIcon={Receipt}
        title="Payment & Escrow Transactions"
        description="Full transparency on gross deal values, logistics deductions, and direct bank settlement receipts."
        action={
          <div className="bg-white border border-stone-200/80 px-4 py-2.5 rounded-lg text-right shrink-0 shadow-subtle">
            <span className="text-2xs text-stone-500 font-medium uppercase tracking-wider block">Total Net Realized Payout</span>
            <span className="text-lg sm:text-xl font-bold text-brand-800 tabular-nums block mt-0.5">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </span>
            <span className="text-2xs text-stone-400">Direct DBT to A/C **4921</span>
          </div>
        }
      />

      {transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Your completed deal settlements and escrow status will appear here."
        />
      ) : (
        <div className="space-y-4">
          {transactions.map((txn) => {
            const isCompleted = txn.paymentStatus === 'completed';

            return (
              <div
                key={txn.id}
                className="bg-white rounded-xl border border-stone-200/80 shadow-card overflow-hidden"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-2xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">{txn.lotNumber}</span>
                      <Badge variant={isCompleted ? 'success' : 'warning'} size="sm" dot>
                        {isCompleted ? 'Settled to Bank' : 'In Escrow'}
                      </Badge>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      {txn.cropName}
                      <span className="font-normal text-stone-500 text-xs ml-1.5">({txn.quantityKg.toLocaleString('en-IN')} kg)</span>
                    </h3>
                    <p className="text-2xs text-stone-500 mt-0.5">
                      Buyer: <strong className="text-stone-700">{txn.buyerName}</strong> · {txn.createdAt}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-2xs text-stone-400 font-medium uppercase block">Agreed Deal Price</span>
                    <span className="text-base font-bold text-stone-900 tabular-nums block mt-0.5">₹{txn.agreedPricePerKg.toFixed(2)}/kg</span>
                    {txn.utrNumber && (
                      <span className="text-2xs font-mono text-brand-700 mt-0.5 block">UTR: {txn.utrNumber}</span>
                    )}
                  </div>
                </div>

                {/* 4-Column Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 bg-stone-50/40 text-xs">
                  <div className="p-3 border-r border-stone-100">
                    <span className="text-2xs text-stone-400 font-medium uppercase block mb-0.5">1. Gross Value</span>
                    <span className="text-sm font-bold text-stone-900 tabular-nums">₹{txn.grossAmount.toLocaleString('en-IN')}</span>
                    <span className="text-2xs text-stone-400 block mt-0.5">{txn.quantityKg} kg × ₹{txn.agreedPricePerKg}</span>
                  </div>

                  <div className="p-3 border-r border-stone-100">
                    <span className="text-2xs text-stone-400 font-medium uppercase block mb-0.5">2. Transport Freight</span>
                    <span className="text-sm font-bold text-accent-rose tabular-nums">−₹{txn.logisticsCost.toLocaleString('en-IN')}</span>
                    <span className="text-2xs text-stone-400 block mt-0.5">Direct carrier rate</span>
                  </div>

                  <div className="p-3 border-r border-stone-100">
                    <span className="text-2xs text-stone-400 font-medium uppercase block mb-0.5">3. Mandi Cess / Fees</span>
                    <span className="text-sm font-bold text-stone-700 tabular-nums">−₹{txn.mandiFeesOrPlatformDeduction.toLocaleString('en-IN')}</span>
                    <span className="text-2xs text-brand-700 block mt-0.5">0% direct buyer</span>
                  </div>

                  <div className="p-3 bg-brand-50/60">
                    <span className="text-2xs text-brand-800 font-semibold uppercase block mb-0.5">4. Net Realization</span>
                    <span className="text-sm font-bold text-brand-900 tabular-nums">₹{txn.netRealizationAmount.toLocaleString('en-IN')}</span>
                    <span className="text-2xs text-brand-700 font-semibold block mt-0.5">₹{txn.netRealizationPerKg.toFixed(2)}/kg in-hand</span>
                  </div>
                </div>

                {/* Milestone Timeline */}
                <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/20">
                  <span className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                    Settlement Milestone Progress
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {txn.timeline.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-md border ${
                          step.completed
                            ? 'bg-white border-stone-200 text-stone-900'
                            : 'bg-stone-50 border-stone-200/50 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <CheckCircle2
                            className={`w-3 h-3 shrink-0 ${
                              step.completed ? 'text-brand-700' : 'text-stone-300'
                            }`}
                          />
                          <span className={`font-semibold text-2xs ${step.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                            {step.step}
                          </span>
                        </div>
                        <p className="text-2xs text-stone-500 leading-tight truncate">{step.description}</p>
                        <span className="text-2xs text-stone-400 mt-0.5 block">{step.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
