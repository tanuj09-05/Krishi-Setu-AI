'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { DigitalLot } from '../../types';
import { Badge } from '../ui/Badge';

interface LotCardProps {
  lot: DigitalLot;
  onViewOffersClick?: (lot: DigitalLot) => void;
}

const getStatusBadge = (lot: DigitalLot) => {
  switch (lot.status) {
    case 'active_listed':
      return <Badge variant="neutral" dot>Listed</Badge>;
    case 'offer_received':
      return <Badge variant="warning" dot pulse>{lot.offers.length} Offer{lot.offers.length > 1 ? 's' : ''}</Badge>;
    case 'deal_locked':
      return <Badge variant="success" dot>Deal Locked</Badge>;
    case 'in_transit':
      return <Badge variant="info" dot>In Transit</Badge>;
    case 'settled':
      return <Badge variant="neutral">Settled</Badge>;
    default:
      return <Badge variant="neutral">Draft</Badge>;
  }
};

export const LotCard: React.FC<LotCardProps> = ({ lot }) => {
  const hasOffers = lot.offers && lot.offers.length > 0;
  const bestOffer = lot.bestOffer || (hasOffers ? lot.offers[0] : undefined);

  return (
    <div className="bg-white rounded-xl border border-stone-200/80 shadow-card hover:border-stone-300 transition-all duration-150 flex flex-col justify-between">
      <div className="p-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-2xs font-mono text-stone-400">{lot.lotNumber}</span>
              {getStatusBadge(lot)}
            </div>
            <h3 className="font-semibold text-stone-900 text-sm leading-snug">
              {lot.cropName}
              <span className="font-normal text-stone-500 ml-1 text-xs">({lot.variety})</span>
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xs text-stone-400 font-medium block">Qty</span>
            <span className="text-sm font-bold text-stone-900 tabular-nums">
              {lot.quantityKg.toLocaleString('en-IN')} kg
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-1.5 text-xs text-stone-600 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Harvest Date</span>
            <span className="font-medium text-stone-700">{lot.harvestDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Location</span>
            <span className="font-medium text-stone-700 truncate max-w-[150px]">{lot.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Quality Spec</span>
            <span className="font-medium text-stone-800 text-2xs bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
              {lot.qualityGrade.split(' ')[0]} {lot.qualityGrade.split(' ')[1]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Target Price</span>
            <span className="font-semibold text-stone-900 tabular-nums">₹{lot.expectedPricePerKg.toFixed(2)}/kg</span>
          </div>
        </div>

        {/* Best Offer Callout */}
        {bestOffer ? (
          <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-200/80 mb-1">
            <div className="flex items-center justify-between text-2xs text-stone-500 mb-1">
              <span className="font-semibold text-stone-700">Top Bid · {bestOffer.buyerName.split(' ')[0]}</span>
              <span className="text-brand-700 font-medium">Net Take-Home</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600 tabular-nums">₹{bestOffer.offeredPricePerKg}/kg gross</span>
              <span className="text-sm font-bold text-brand-800 tabular-nums">₹{bestOffer.estimatedNetRealizationPerKg}/kg</span>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-stone-200 rounded-lg py-2 text-center text-2xs text-stone-400">
            Network active · awaiting incoming bids
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="px-4 py-2.5 bg-stone-50/50 border-t border-stone-100">
        <Link
          href={`/lots/${lot.id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 text-stone-800 font-semibold text-xs rounded-md shadow-subtle transition-colors"
        >
          <span>{hasOffers ? `Review ${lot.offers.length} Offer${lot.offers.length > 1 ? 's' : ''}` : 'View Details'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
        </Link>
      </div>
    </div>
  );
};
