'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Building,
  TrendingUp,
  Truck,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { NetRealizationBreakdown } from '../../types';

interface MandiComparisonTableProps {
  data: NetRealizationBreakdown[];
  cropName?: string;
  quantityKg?: number;
}

export const MandiComparisonTable: React.FC<MandiComparisonTableProps> = ({
  data,
  cropName = 'Tomato',
  quantityKg = 500,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'mandi' | 'buyer'>('all');
  const [sortBy, setSortBy] = useState<'netRealization' | 'grossPrice' | 'transport'>(
    'netRealization'
  );

  let filtered = data.filter((item) => {
    if (filterType === 'mandi') return item.destinationType === 'mandi';
    if (filterType === 'buyer') return item.destinationType === 'buyer';
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'netRealization') return b.netRealizationPerKg - a.netRealizationPerKg;
    if (sortBy === 'grossPrice') return b.grossPricePerKg - a.grossPricePerKg;
    if (sortBy === 'transport') return a.transportCostPerKg - b.transportCostPerKg;
    return 0;
  });

  return (
    <div className="bg-white rounded-3xl shadow-card border border-slate-200 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-brand-700">
              <Store className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Market & Buyer Net Realization Matrix ({cropName} • {quantityKg} kg)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by actual in-pocket profit after deducting transport freight, loading, and mandi cess.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Options
            </button>
            <button
              onClick={() => setFilterType('buyer')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterType === 'buyer' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Institutional Buyers
            </button>
            <button
              onClick={() => setFilterType('mandi')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterType === 'mandi' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              APMC Mandis
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-4 sm:px-6">Market / Buyer Destination</th>
              <th className="py-3.5 px-4 text-right">Offered Gross Price</th>
              <th className="py-3.5 px-4 text-right">Transport Freight</th>
              <th className="py-3.5 px-4 text-right">Cess & Handling</th>
              <th className="py-3.5 px-4 text-right font-black text-slate-900 bg-emerald-50/50">
                Est. Net Realization
              </th>
              <th className="py-3.5 px-4 text-right">Total Net Payout</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {filtered.map((item, idx) => {
              const isBest = item.isTopRecommendation || idx === 0;

              return (
                <tr
                  key={item.destinationName}
                  className={`transition group ${
                    isBest
                      ? 'bg-emerald-50/40 hover:bg-emerald-50/70 border-l-4 border-l-brand-600'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Destination & Badges */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          item.destinationType === 'buyer'
                            ? 'bg-brand-100 text-brand-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.destinationType === 'buyer' ? (
                          <Building className="w-4 h-4" />
                        ) : (
                          <Store className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{item.destinationName}</span>
                          {isBest && (
                            <span className="bg-brand-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                              <Sparkles className="w-3 h-3" /> Best Net Profit
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="capitalize">
                            {item.destinationType === 'buyer' ? 'Direct Procurement Hub' : 'APMC Regulated Mandi'}
                          </span>
                          <span>•</span>
                          <span>{item.destinationType === 'buyer' ? 'T+0 Digital Escrow' : '2-3 Days Cash/RTGS'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Gross Price */}
                  <td className="py-4 px-4 text-right font-semibold text-slate-800">
                    ₹{item.grossPricePerKg.toFixed(2)}
                    <span className="text-[11px] font-normal text-slate-400">/kg</span>
                  </td>

                  {/* Transport */}
                  <td className="py-4 px-4 text-right font-medium text-rose-600">
                    -₹{item.transportCostPerKg.toFixed(2)}
                    <span className="text-[11px] font-normal text-slate-400">/kg</span>
                  </td>

                  {/* Cess */}
                  <td className="py-4 px-4 text-right font-medium text-amber-700">
                    {item.mandiCessAndFeesPerKg > 0 ? (
                      <>
                        -₹{item.mandiCessAndFeesPerKg.toFixed(2)}
                        <span className="text-[11px] font-normal text-slate-400">/kg</span>
                      </>
                    ) : (
                      <span className="text-slate-400">₹0.00</span>
                    )}
                  </td>

                  {/* Net Realization (Highlighted Column) */}
                  <td className="py-4 px-4 text-right font-black text-slate-900 bg-emerald-50/60 text-base">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-xl ${
                        isBest ? 'bg-brand-600 text-white shadow-sm' : 'text-emerald-800'
                      }`}
                    >
                      ₹{item.netRealizationPerKg.toFixed(2)}
                      <span className={`text-xs font-normal ${isBest ? 'text-emerald-100' : 'text-slate-500'}`}>
                        /kg
                      </span>
                    </span>
                  </td>

                  {/* Total Net Payout */}
                  <td className="py-4 px-4 text-right font-bold text-slate-900">
                    ₹{item.totalNetRevenue.toLocaleString('en-IN')}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-center">
                    {item.destinationType === 'buyer' ? (
                      <Link
                        href="/buyers"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95"
                      >
                        <span>Match Buyer</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        href="/logistics"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                      >
                        <span>View Freight</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Note below comparison */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          💡 <strong>Notice:</strong> High gross price at distant mandis (like Azadpur Delhi ₹26/kg) drops to ₹21.61/kg Net after ₹4.00/kg transport + cess!
        </span>
        <Link href="/recommendations" className="text-brand-700 font-bold hover:underline shrink-0">
          View full AI Decision Breakdown →
        </Link>
      </div>
    </div>
  );
};
