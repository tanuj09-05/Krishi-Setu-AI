'use client';

import React from 'react';
import {
  Building,
  CheckCircle,
  Star,
  Truck,
  MapPin,
  Clock,
  Send,
} from 'lucide-react';
import { InstitutionalBuyer } from '../../types';
import { Badge } from '../ui/Badge';

interface BuyerCardProps {
  buyer: InstitutionalBuyer;
  onSendLotClick: (buyer: InstitutionalBuyer) => void;
  recommendedPricePerKg?: number;
}

export const BuyerCard: React.FC<BuyerCardProps> = ({
  buyer,
  onSendLotClick,
  recommendedPricePerKg,
}) => {
  const isTopMatch = buyer.id === 'buyer_reliance_fresh';

  return (
    <div
      className={`bg-white rounded-xl border shadow-card hover:border-stone-300 transition-all duration-150 flex flex-col justify-between ${
        isTopMatch ? 'border-brand-300 ring-1 ring-brand-200/60' : 'border-stone-200/80'
      }`}
    >
      <div className="p-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 shrink-0 font-bold text-xs">
              <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-stone-900 text-sm leading-snug truncate">{buyer.name}</h3>
                {buyer.verified && (
                  <span title="Verified Buyer">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-2xs text-stone-500">{buyer.companyType}</p>
            </div>
          </div>
          {isTopMatch && (
            <Badge variant="success" size="sm">Top Match</Badge>
          )}
        </div>

        {/* Requirements */}
        <div className="space-y-1.5 text-xs mb-3">
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Crop Demanded</span>
            <span className="font-semibold text-stone-800">{buyer.cropRequired}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Requirement</span>
            <span className="font-medium text-stone-800 tabular-nums">{buyer.requiredQuantityKg.toLocaleString('en-IN')} kg</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Quality Spec</span>
            <span className="font-medium text-stone-800 text-2xs bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
              {buyer.qualityRequirement}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </span>
            <span className="font-medium text-stone-700">{buyer.distanceKm} km · {buyer.procurementHub.split(',')[0]}</span>
          </div>
        </div>

        {/* Price & Reliability Tiles */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-200/70">
            <span className="text-2xs text-stone-500 font-medium uppercase tracking-wider block">Buy Price</span>
            <div className="text-base font-bold text-stone-900 mt-0.5 tabular-nums">
              ₹{buyer.offeredPricePerKg.toFixed(2)}
              <span className="text-2xs font-normal text-stone-400">/kg</span>
            </div>
            <span className="text-2xs text-stone-500 mt-0.5 flex items-center gap-1">
              <Truck className="w-3 h-3 text-stone-400" />
              {buyer.pickupServiceAvailable ? 'Farm pickup' : 'Self drop'}
            </span>
          </div>

          <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-200/70">
            <span className="text-2xs text-stone-500 font-medium uppercase tracking-wider block">Reliability</span>
            <div className="text-base font-bold text-stone-900 mt-0.5 tabular-nums">
              {buyer.paymentReliability}%
            </div>
            <span className="text-2xs text-stone-500 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {buyer.paymentTerms}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-stone-50/50 border-t border-stone-100 flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-stone-500">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="font-semibold text-stone-700">{buyer.rating}</span>
          <span className="text-2xs text-stone-400">({buyer.reviewsCount})</span>
        </div>
        <button
          onClick={() => onSendLotClick(buyer)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors active:scale-95"
        >
          <Send className="w-3 h-3" />
          <span>Send Lot</span>
        </button>
      </div>
    </div>
  );
};
