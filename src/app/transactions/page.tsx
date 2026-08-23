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
        eyebrow="Protected Settlement Engine"
        eyebrowIcon={Receipt}
        title="Payment & Escrow Transactions"
        description="Full transparency on gross deal values, logistics deductions, and direct bank settlement receipts."
        action={
          <div className="bg-brand-900 text-white px-5 py-3 rounded-xl border border-brand-700/50 text-right shrink-0">
            <p className="text-[9px] text-brand-400 font-semibold uppercase tracking-widest">Total Net Realized</p>
            <p className="text-xl font-bold text-white tabular-nums mt-0.5">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">A/C **4921</p>
          </div>
        }
      />

      {transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Your completed deal settlements will appear here with full escrow timelines."
        />
      ) : (
        <div className="space-y-5">
          {transactions.map((txn) => {
            const isCompleted = txn.paymentStatus === 'completed';

            return (
              <div
                key={txn.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden"
              >
                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">{txn.lotNumber}</span>
                      <Badge variant={isCompleted ? 'success' : 'warning'} size="sm" dot>
                        {isCompleted ? 'Settled' : 'In Escrow'}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      {txn.cropName}
                      <span className="font-normal text-stone-400 text-sm ml-1.5">({txn.quantityKg.toLocaleString('en-IN')} kg)</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Buyer: <strong className="text-gray-700">{txn.buyerName}</strong> · {txn.createdAt}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Agreed Price</p>
                    <p className="text-lg font-bold text-gray-900 tabular-nums mt-0.5">₹{txn.agreedPricePerKg.toFixed(2)}/kg</p>
                    {txn.utrNumber && (
                      <p className="text-[10px] font-mono text-brand-700 mt-0.5">UTR: {txn.utrNumber}</p>
                    )}
                  </div>
                </div>

                {/* Breakdown tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  {[
                    {
                      label: 'Gross Value',
                      value: `₹${txn.grossAmount.toLocaleString('en-IN')}`,
                      sub: `${txn.quantityKg} kg × ₹${txn.agreedPricePerKg}`,
                      color: 'text-gray-900',
                    },
                    {
                      label: 'Transport',
                      value: `−₹${txn.logisticsCost.toLocaleString('en-IN')}`,
                      sub: 'Direct carrier',
                      color: 'text-rose-500',
                    },
                    {
                      label: 'Mandi Cess',
                      value: `−₹${txn.mandiFeesOrPlatformDeduction.toLocaleString('en-IN')}`,
                      sub: '0% direct buyer',
                      color: 'text-amber-600',
                    },
                    {
                      label: 'Net Realization',
                      value: `₹${txn.netRealizationAmount.toLocaleString('en-IN')}`,
                      sub: `₹${txn.netRealizationPerKg.toFixed(2)}/kg`,
                      color: 'text-brand-800',
                      highlight: true,
                    },
                  ].map((box, i) => (
                    <div
                      key={i}
                      className={`px-4 py-3.5 border-r last:border-r-0 border-t sm:border-t-0 border-stone-100 ${
                        box.highlight ? 'bg-brand-50' : ''
                      }`}
                    >
                      <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider mb-1">{box.label}</p>
                      <p className={`text-sm font-bold tabular-nums ${box.color}`}>{box.value}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">{box.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div className="px-5 py-4 bg-stone-50/50 border-t border-stone-100">
                  <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider mb-3">Settlement Timeline</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {txn.timeline.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs ${
                          step.completed
                            ? 'bg-white border-brand-200'
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              step.completed ? 'text-brand-600' : 'text-stone-300'
                            }`}
                          />
                          <span className={`font-semibold text-[10px] ${step.completed ? 'text-gray-900' : 'text-stone-400'}`}>
                            {step.step}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 leading-snug">{step.description}</p>
                        <p className="text-[9px] text-stone-400 mt-1">{step.date}</p>
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
