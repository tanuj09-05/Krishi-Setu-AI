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
  Coins,
  Scale,
} from 'lucide-react';
import { InstitutionalBuyer } from '../../types';

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
      className={`bg-white rounded-3xl p-5 sm:p-6 shadow-card border transition-all duration-200 flex flex-col justify-between ${
        isTopMatch
          ? 'border-brand-500/80 shadow-highlight bg-gradient-to-b from-emerald-50/30 to-white'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Badges & Verified Pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {buyer.name}
                </h3>
                {buyer.verified && (
                  <span title="Verified Institutional Buyer">
                    <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">{buyer.companyType}</span>
            </div>
          </div>

          {isTopMatch && (
            <span className="bg-brand-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Top AI Pick
            </span>
          )}
        </div>

        {/* Procurement Specs Grid */}
        <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs mb-4 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Crop Demanded:</span>
            <span className="font-bold text-slate-900">{buyer.cropRequired}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Required Quantity:</span>
            <span className="font-semibold text-slate-800">
              {buyer.requiredQuantityKg.toLocaleString('en-IN')} kg
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Quality Spec:</span>
            <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200 text-[11px]">
              {buyer.qualityRequirement}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Hub & Distance:</span>
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {buyer.distanceKm} km ({buyer.procurementHub.split(',')[0]})
            </span>
          </div>
        </div>

        {/* Price & Reliability Row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-brand-800 uppercase tracking-wider block">
              Offered Buying Price
            </span>
            <div className="text-xl font-black text-brand-900 mt-0.5">
              ₹{buyer.offeredPricePerKg.toFixed(2)}
              <span className="text-xs font-normal text-slate-500">/kg</span>
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {buyer.pickupServiceAvailable ? 'Farm gate pickup' : 'Self drop at hub'}
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Payment Reliability
            </span>
            <div className="text-xl font-black text-amber-900 mt-0.5">
              {buyer.paymentReliability}%
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {buyer.paymentTerms}
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold px-2">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{buyer.rating}</span>
          <span className="text-[11px] text-slate-400">({buyer.reviewsCount})</span>
        </div>

        <button
          onClick={() => onSendLotClick(buyer)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Lot / Offer</span>
        </button>
      </div>
    </div>
  );
};
