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
    <div className="bg-white rounded-xl shadow-card border border-stone-200/80 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-stone-500" />
            <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
              Market & Buyer Net Realization Matrix
            </h3>
            <span className="text-2xs font-medium text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
              {cropName} · {quantityKg} kg
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Ranked by actual in-pocket payout after deducting transport freight, handling, and mandi cess.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200/60 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              filterType === 'all' ? 'bg-white text-stone-900 shadow-subtle' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Destinations
          </button>
          <button
            onClick={() => setFilterType('buyer')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              filterType === 'buyer' ? 'bg-white text-brand-800 shadow-subtle' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Buyers
          </button>
          <button
            onClick={() => setFilterType('mandi')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              filterType === 'mandi' ? 'bg-white text-stone-900 shadow-subtle' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            APMC Mandis
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/80 text-2xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <th className="py-2.5 px-4 sm:px-5">Destination</th>
              <th className="py-2.5 px-3 text-right">Offered Gross</th>
              <th className="py-2.5 px-3 text-right">Transport</th>
              <th className="py-2.5 px-3 text-right">Cess & Handling</th>
              <th className="py-2.5 px-3 text-right font-bold text-stone-900 bg-brand-50/40">
                Est. Net Realization
              </th>
              <th className="py-2.5 px-3 text-right">Total Payout</th>
              <th className="py-2.5 px-3 text-center">Action</th>
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
                      ? 'bg-brand-50/20 hover:bg-brand-50/40'
                      : 'hover:bg-stone-50/60'
                  }`}
                >
                  {/* Destination */}
                  <td className="py-3 px-4 sm:px-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1 rounded-md shrink-0 border ${
                          item.destinationType === 'buyer'
                            ? 'bg-brand-50 text-brand-700 border-brand-200/70'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        {item.destinationType === 'buyer' ? (
                          <Building className="w-3.5 h-3.5" />
                        ) : (
                          <Store className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                          <span>{item.destinationName}</span>
                          {isBest && (
                            <Badge variant="success" size="sm">
                              Best Realization
                            </Badge>
                          )}
                        </div>
                        <div className="text-2xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <span>
                            {item.destinationType === 'buyer' ? 'Direct Hub' : 'APMC Mandi'}
                          </span>
                          <span>·</span>
                          <span>{item.destinationType === 'buyer' ? 'T+0 Escrow Settlement' : '2–3 Days Payment'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Gross Price */}
                  <td className="py-3 px-3 text-right font-medium text-stone-800 tabular-nums">
                    ₹{item.grossPricePerKg.toFixed(2)}
                    <span className="text-2xs font-normal text-stone-400">/kg</span>
                  </td>

                  {/* Transport */}
                  <td className="py-3 px-3 text-right font-medium text-accent-rose tabular-nums">
                    −₹{item.transportCostPerKg.toFixed(2)}
                    <span className="text-2xs font-normal text-stone-400">/kg</span>
                  </td>

                  {/* Cess */}
                  <td className="py-3 px-3 text-right font-medium text-stone-700 tabular-nums">
                    {item.mandiCessAndFeesPerKg > 0 ? (
                      <>
                        −₹{item.mandiCessAndFeesPerKg.toFixed(2)}
                        <span className="text-2xs font-normal text-stone-400">/kg</span>
                      </>
                    ) : (
                      <span className="text-stone-400">₹0.00</span>
                    )}
                  </td>

                  {/* Net Realization (Highlighted Column) */}
                  <td className="py-3 px-3 text-right font-bold text-stone-900 bg-brand-50/30">
                    <span
                      className={`inline-block px-2 py-0.5 rounded tabular-nums ${
                        isBest ? 'bg-brand-700 text-white font-semibold' : 'text-brand-800 font-bold'
                      }`}
                    >
                      ₹{item.netRealizationPerKg.toFixed(2)}
                      <span className={`text-2xs font-normal ${isBest ? 'text-brand-100' : 'text-stone-400'}`}>
                        /kg
                      </span>
                    </span>
                  </td>

                  {/* Total Net Payout */}
                  <td className="py-3 px-3 text-right font-bold text-stone-900 tabular-nums">
                    ₹{item.totalNetRevenue.toLocaleString('en-IN')}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-center">
                    {item.destinationType === 'buyer' ? (
                      <Link
                        href="/buyers"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded shadow-subtle transition active:scale-95"
                      >
                        <span>Match</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <Link
                        href="/logistics"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-medium rounded transition"
                      >
                        <span>Freight</span>
                        <ChevronRight className="w-3 h-3 text-stone-400" />
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
      <div className="p-3 bg-stone-50/70 border-t border-stone-200/80 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          💡 High gross price at distant mandis (like Azadpur Delhi ₹26/kg) drops to ₹21.61/kg Net after ₹4.00/kg transport + cess.
        </span>
        <Link href="/recommendations" className="text-brand-700 font-semibold hover:underline shrink-0">
          AI Decision Breakdown →
        </Link>
      </div>
    </div>
  );
};
