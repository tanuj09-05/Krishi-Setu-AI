'use client';

import React from 'react';
import Link from 'next/link';
import {
  Boxes,
  Calendar,
  MapPin,
  Sparkles,
  TrendingUp,
  Tag,
  ArrowRight,
  ShieldCheck,
  Coins,
} from 'lucide-react';
import { DigitalLot } from '../../types';

interface LotCardProps {
  lot: DigitalLot;
  onViewOffersClick?: (lot: DigitalLot) => void;
}

export const LotCard: React.FC<LotCardProps> = ({ lot, onViewOffersClick }) => {
  const hasOffers = lot.offers && lot.offers.length > 0;
  const bestOffer = lot.bestOffer || (hasOffers ? lot.offers[0] : undefined);

  const getStatusBadge = (status: DigitalLot['status']) => {
    switch (status) {
      case 'active_listed':
        return <span className="bg-emerald-100 text-brand-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">Listed • Active</span>;
      case 'offer_received':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">{lot.offers.length} Offers Waiting</span>;
      case 'deal_locked':
        return <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200">Deal Locked</span>;
      case 'in_transit':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">In Transit</span>;
      case 'settled':
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-300">Settled & Paid</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Draft</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-slate-200 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Lot Header & Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">{lot.lotNumber}</span>
              {getStatusBadge(lot.status)}
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mt-1">
              {lot.cropName} <span className="text-sm font-normal text-slate-500">({lot.variety})</span>
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Quantity</span>
            <span className="text-base font-black text-slate-900">{lot.quantityKg.toLocaleString('en-IN')} kg</span>
          </div>
        </div>

        {/* Quality & Specifications */}
        <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs mb-4 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Quality Grade:</span>
            <span className="font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200 text-[11px]">
              {lot.qualityGrade}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Harvest Date:</span>
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {lot.harvestDate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Farm Location:</span>
            <span className="font-medium text-slate-700 flex items-center gap-1 truncate max-w-[180px]">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {lot.location}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Target Farmer Base Price:</span>
            <span className="font-bold text-slate-900">₹{lot.expectedPricePerKg.toFixed(2)}/kg</span>
          </div>
        </div>

        {/* Best Offer Callout */}
        {bestOffer ? (
          <div className="bg-gradient-to-br from-emerald-50 to-brand-50/50 border border-emerald-200 rounded-2xl p-3.5 mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Best Active Offer
              </span>
              <span className="text-[11px] text-slate-500">{bestOffer.buyerName.split(' ')[0]}</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500">Offered: </span>
                <strong className="text-sm text-slate-900">₹{bestOffer.offeredPricePerKg}/kg</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Net Take-Home</span>
                <span className="text-base font-black text-brand-800">₹{bestOffer.estimatedNetRealizationPerKg}/kg</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-3 text-center text-xs text-slate-500 mb-4">
            Lot is live on buyer discovery network. Incoming bids will appear here.
          </div>
        )}
      </div>

      {/* Card Action Footers */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <Link
          href={`/lots/${lot.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95"
        >
          <span>{hasOffers ? `Manage ${lot.offers.length} Offers` : 'View Lot Details'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
