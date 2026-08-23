'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  Sprout,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

export default function MyCropsPage() {
  const { lots } = useApp();
  const [filter, setFilter] = useState<'all' | 'ready' | 'active'>('all');

  const filteredLots = lots.filter((lot) => {
    if (filter === 'ready') return lot.status === 'active_listed' || !lot.offers || lot.offers.length === 0;
    if (filter === 'active') return lot.offers && lot.offers.length > 0;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-2">
      <PageHeader
        eyebrow="Produce Portfolio"
        eyebrowIcon={Sprout}
        title="My Crops"
        description="All crops currently on your farm, harvest dates, and active buyer negotiations."
        action={
          <Link
            href="/lots/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-md shadow-subtle transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Crop Harvest</span>
          </Link>
        }
      />

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            filter === 'all' ? 'bg-stone-200 text-stone-900 font-semibold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          All Crops ({lots.length})
        </button>
        <button
          onClick={() => setFilter('ready')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            filter === 'ready' ? 'bg-stone-200 text-stone-900 font-semibold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Ready to Sell
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            filter === 'active' ? 'bg-stone-200 text-stone-900 font-semibold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Has Bids
        </button>
      </div>

      {/* Crops List */}
      {filteredLots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLots.map((crop) => {
            const hasOffers = crop.offers && crop.offers.length > 0;
            const bestOffer = crop.offers?.[0];
            const estValue = crop.expectedPricePerKg * crop.quantityKg;

            return (
              <div
                key={crop.id}
                className="bg-white rounded-xl border border-stone-200/90 shadow-card p-5 flex flex-col justify-between hover:border-stone-300 transition-colors"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-stone-900">{crop.cropName}</span>
                        <span className="text-2xs text-stone-400">({crop.variety})</span>
                      </div>
                      <Badge variant={hasOffers ? 'warning' : 'success'} size="sm" dot>
                        {hasOffers ? `${crop.offers.length} Buyer Bid Received` : 'Ready to Sell'}
                      </Badge>
                    </div>

                    <div className="text-right">
                      <span className="text-2xs text-stone-400 block font-medium">Quantity</span>
                      <span className="text-sm font-bold text-stone-900 tabular-nums">
                        {crop.quantityKg.toLocaleString('en-IN')} kg
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-stone-600 mb-4 bg-stone-50/70 p-3 rounded-lg border border-stone-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Estimated Total Value:</span>
                      <span className="font-bold text-stone-900 tabular-nums">
                        ₹{estValue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Target Rate:</span>
                      <span className="font-semibold text-stone-800 tabular-nums">
                        ₹{crop.expectedPricePerKg.toFixed(2)}/kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Harvest Date:</span>
                      <span className="text-stone-700">{crop.harvestDate}</span>
                    </div>
                  </div>

                  {/* Best bid highlight if any */}
                  {bestOffer && (
                    <div className="mb-4 p-2.5 rounded-lg bg-brand-50 border border-brand-200/80 text-xs flex items-center justify-between">
                      <div>
                        <span className="text-2xs text-brand-800 font-semibold block">
                          Bid from {bestOffer.buyerName.split(' ')[0]}
                        </span>
                        <span className="text-2xs text-stone-500">₹{bestOffer.offeredPricePerKg}/kg offered</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-brand-900 tabular-nums">
                          ₹{bestOffer.estimatedNetRealizationPerKg}/kg
                        </span>
                        <span className="text-2xs text-brand-700 block">in-hand</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <Link
                    href={`/lots/${crop.id}`}
                    className="flex-1 text-center py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-semibold text-xs rounded-md transition-colors"
                  >
                    View Crop Info
                  </Link>
                  <Link
                    href={`/sell?crop=${encodeURIComponent(crop.cropName)}&qty=${crop.quantityKg}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors active:scale-95"
                  >
                    <span>Sell Crop</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Sprout}
          title="No crops listed in this filter"
          description="Add a crop harvest to track values and receive buyer bids."
          action={
            <Link
              href="/lots/new"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-brand-700 text-white rounded-md text-xs font-semibold hover:bg-brand-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Crop</span>
            </Link>
          }
        />
      )}
    </div>
  );
}
