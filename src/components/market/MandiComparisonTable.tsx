'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Building,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { NetRealizationBreakdown } from '../../types';
import { Badge } from '../ui/Badge';

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
    <div className="bg-white rounded-xl shadow-card border border-stone-200 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-100">
              <Store className="w-4 h-4" />
            </span>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              Market & Buyer Net Realization Matrix ({cropName} · {quantityKg} kg)
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Ranked by actual in-pocket profit after deducting transport freight, loading, and mandi cess.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md font-medium text-xs transition ${
                filterType === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-stone-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('buyer')}
              className={`px-3 py-1 rounded-md font-medium text-xs transition ${
                filterType === 'buyer' ? 'bg-white text-brand-700 shadow-sm' : 'text-stone-600 hover:text-gray-900'
              }`}
            >
              Buyers
            </button>
            <button
              onClick={() => setFilterType('mandi')}
              className={`px-3 py-1 rounded-md font-medium text-xs transition ${
                filterType === 'mandi' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-600 hover:text-gray-900'
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
            <tr className="bg-stone-50 text-[10px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <th className="py-3 px-4 sm:px-5">Destination</th>
              <th className="py-3 px-3 text-right">Offered Gross</th>
              <th className="py-3 px-3 text-right">Transport</th>
              <th className="py-3 px-3 text-right">Cess & Handling</th>
              <th className="py-3 px-3 text-right font-bold text-brand-900 bg-brand-50/50">
                Est. Net Realization
              </th>
              <th className="py-3 px-3 text-right">Total Net</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs">
            {filtered.map((item, idx) => {
              const isBest = item.isTopRecommendation || idx === 0;

              return (
                <tr
                  key={item.destinationName}
                  className={`transition group ${
                    isBest
                      ? 'bg-brand-50/30 hover:bg-brand-50/50 border-l-2 border-l-brand-600'
                      : 'hover:bg-stone-50/60'
                  }`}
                >
                  {/* Destination & Badges */}
                  <td className="py-3.5 px-4 sm:px-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          item.destinationType === 'buyer'
                            ? 'bg-brand-50 text-brand-700 border border-brand-100'
                            : 'bg-amber-50 text-amber-800 border border-amber-100'
                        }`}
                      >
                        {item.destinationType === 'buyer' ? (
                          <Building className="w-3.5 h-3.5" />
                        ) : (
                          <Store className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <span>{item.destinationName}</span>
                          {isBest && (
                            <Badge variant="success" size="sm">
                              <Sparkles className="w-2.5 h-2.5" /> Best Profit
                            </Badge>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <span className="capitalize">
                            {item.destinationType === 'buyer' ? 'Direct Procurement Hub' : 'APMC Mandi'}
                          </span>
                          <span>·</span>
                          <span>{item.destinationType === 'buyer' ? 'T+0 Escrow' : '2–3 Days Cash/RTGS'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Gross Price */}
                  <td className="py-3.5 px-3 text-right font-medium text-gray-800 tabular-nums">
                    ₹{item.grossPricePerKg.toFixed(2)}
                    <span className="text-[10px] font-normal text-stone-400">/kg</span>
                  </td>

                  {/* Transport */}
                  <td className="py-3.5 px-3 text-right font-medium text-rose-600 tabular-nums">
                    −₹{item.transportCostPerKg.toFixed(2)}
                    <span className="text-[10px] font-normal text-stone-400">/kg</span>
                  </td>

                  {/* Cess */}
                  <td className="py-3.5 px-3 text-right font-medium text-amber-700 tabular-nums">
                    {item.mandiCessAndFeesPerKg > 0 ? (
                      <>
                        −₹{item.mandiCessAndFeesPerKg.toFixed(2)}
                        <span className="text-[10px] font-normal text-stone-400">/kg</span>
                      </>
                    ) : (
                      <span className="text-stone-400">₹0.00</span>
                    )}
                  </td>

                  {/* Net Realization (Highlighted Column) */}
                  <td className="py-3.5 px-3 text-right font-bold text-gray-900 bg-brand-50/40">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-lg tabular-nums ${
                        isBest ? 'bg-brand-700 text-white font-semibold' : 'text-brand-800'
                      }`}
                    >
                      ₹{item.netRealizationPerKg.toFixed(2)}
                      <span className={`text-[10px] font-normal ${isBest ? 'text-brand-100' : 'text-stone-500'}`}>
                        /kg
                      </span>
                    </span>
                  </td>

                  {/* Total Net Payout */}
                  <td className="py-3.5 px-3 text-right font-bold text-gray-900 tabular-nums">
                    ₹{item.totalNetRevenue.toLocaleString('en-IN')}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 text-center">
                    {item.destinationType === 'buyer' ? (
                      <Link
                        href="/buyers"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95"
                      >
                        <span>Match</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <Link
                        href="/logistics"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-gray-800 text-xs font-medium rounded-lg transition"
                      >
                        <span>Freight</span>
                        <ChevronRight className="w-3 h-3" />
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
      <div className="p-3.5 bg-stone-50 border-t border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          💡 <strong>Notice:</strong> High gross price at distant mandis (like Azadpur Delhi ₹26/kg) drops to ₹21.61/kg Net after ₹4.00/kg transport + cess!
        </span>
        <Link href="/recommendations" className="text-brand-700 font-semibold hover:underline shrink-0">
          AI Decision Breakdown →
        </Link>
      </div>
    </div>
  );
};
