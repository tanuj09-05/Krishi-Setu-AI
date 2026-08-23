'use client';

import React from 'react';
import {
  Building,
  CheckCircle,
  Star,
  ShieldCheck,
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
      className={`bg-white rounded-xl border shadow-card hover:shadow-card-md transition-all duration-200 flex flex-col ${
        isTopMatch ? 'border-brand-300 ring-1 ring-brand-200' : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      <div className="p-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">{buyer.name}</h3>
                {buyer.verified && (
                  <span title="Verified Buyer"><CheckCircle className="w-3.5 h-3.5 text-brand-600 shrink-0" /></span>
                )}
              </div>
              <p className="text-[10px] text-stone-500">{buyer.companyType}</p>
            </div>
          </div>
          {isTopMatch && (
            <Badge variant="success" size="sm">AI Pick</Badge>
          )}
        </div>

        {/* Specs */}
        <div className="space-y-1.5 text-xs mb-3">
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Crop</span>
            <span className="font-semibold text-gray-800">{buyer.cropRequired}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Quantity Needed</span>
            <span className="font-semibold text-gray-800 tabular-nums">{buyer.requiredQuantityKg.toLocaleString('en-IN')} kg</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Quality</span>
            <span className="font-semibold text-brand-700 text-[10px] bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100">
              {buyer.qualityRequirement}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400 flex items-center gap-1"><MapPin className="w-3 h-3" />Distance</span>
            <span className="font-medium text-gray-700">{buyer.distanceKm} km · {buyer.procurementHub.split(',')[0]}</span>
          </div>
        </div>

        {/* Price & Reliability */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-brand-50 border border-brand-100 rounded-lg p-2.5">
            <p className="text-[9px] font-semibold text-brand-700 uppercase tracking-wider mb-0.5">Buy Price</p>
            <p className="text-base font-bold text-brand-900 tabular-nums">
              ₹{buyer.offeredPricePerKg.toFixed(2)}
              <span className="text-xs font-normal text-stone-400">/kg</span>
            </p>
            <p className="text-[9px] text-brand-600 mt-0.5 flex items-center gap-0.5">
              <Truck className="w-2.5 h-2.5" />
              {buyer.pickupServiceAvailable ? 'Farm pickup' : 'Self drop'}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5">
            <p className="text-[9px] font-semibold text-amber-700 uppercase tracking-wider mb-0.5">Reliability</p>
            <p className="text-base font-bold text-amber-900 tabular-nums">{buyer.paymentReliability}%</p>
            <p className="text-[9px] text-amber-600 mt-0.5 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {buyer.paymentTerms}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-stone-100 flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-stone-500">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="font-semibold text-gray-700">{buyer.rating}</span>
          <span className="text-stone-400">({buyer.reviewsCount})</span>
        </div>
        <button
          onClick={() => onSendLotClick(buyer)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors duration-150 active:scale-95"
        >
          <Send className="w-3 h-3" />
          <span>Send Lot</span>
        </button>
      </div>
    </div>
  );
};
