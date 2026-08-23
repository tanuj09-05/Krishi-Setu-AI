'use client';

import React from 'react';
import Link from 'next/link';
import {
  Boxes,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
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
      return <Badge variant="success" dot>Listed</Badge>;
    case 'offer_received':
      return <Badge variant="warning" dot pulse>{lot.offers.length} Offer{lot.offers.length > 1 ? 's' : ''}</Badge>;
    case 'deal_locked':
      return <Badge variant="info" dot>Deal Locked</Badge>;
    case 'in_transit':
      return <Badge variant="purple" dot>In Transit</Badge>;
    case 'settled':
      return <Badge variant="neutral" dot>Settled</Badge>;
    default:
      return <Badge variant="neutral">Draft</Badge>;
  }
};

export const LotCard: React.FC<LotCardProps> = ({ lot }) => {
  const hasOffers = lot.offers && lot.offers.length > 0;
  const bestOffer = lot.bestOffer || (hasOffers ? lot.offers[0] : undefined);

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-card hover:shadow-card-md hover:border-stone-300 transition-all duration-200 flex flex-col">
      <div className="p-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-medium text-stone-400">{lot.lotNumber}</span>
              {getStatusBadge(lot)}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">
              {lot.cropName}
              <span className="font-normal text-stone-400 ml-1 text-xs">({lot.variety})</span>
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-stone-400 font-medium">Qty</p>
            <p className="text-sm font-bold text-gray-900 tabular-nums">{lot.quantityKg.toLocaleString('en-IN')} kg</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-stone-600 mb-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-stone-400">
              <Calendar className="w-3 h-3" /> Harvested
            </span>
            <span className="font-medium text-gray-700">{lot.harvestDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-stone-400">
              <MapPin className="w-3 h-3" /> Location
            </span>
            <span className="font-medium text-gray-700 truncate max-w-[160px]">{lot.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Grade</span>
            <span className="font-semibold text-brand-800 text-[10px] bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100">
              {lot.qualityGrade.split(' ')[0]} {lot.qualityGrade.split(' ')[1]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Target Price</span>
            <span className="font-bold text-gray-900 tabular-nums">₹{lot.expectedPricePerKg.toFixed(2)}/kg</span>
          </div>
        </div>

        {/* Best Offer */}
        {bestOffer ? (
          <div className="bg-brand-50 border border-brand-100 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-brand-700 mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Best Active Offer · {bestOffer.buyerName.split(' ')[0]}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-stone-500">Offered</p>
                <p className="text-sm font-bold text-gray-900 tabular-nums">₹{bestOffer.offeredPricePerKg}/kg</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-brand-700 font-semibold uppercase tracking-wider">Net Take-Home</p>
                <p className="text-sm font-bold text-brand-800 tabular-nums">₹{bestOffer.estimatedNetRealizationPerKg}/kg</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-stone-200 rounded-lg p-3 mb-3 text-center">
            <p className="text-xs text-stone-400">Live on buyer network · awaiting bids</p>
          </div>
        )}
      </div>

      {/* Footer action */}
      <div className="px-4 py-3 border-t border-stone-100">
        <Link
          href={`/lots/${lot.id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors duration-150 active:scale-95"
        >
          <span>{hasOffers ? `Manage ${lot.offers.length} Offer${lot.offers.length > 1 ? 's' : ''}` : 'View Lot Details'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
