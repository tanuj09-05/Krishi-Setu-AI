'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import {
  Boxes,
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  Building,
  Coins,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Scale,
  Send,
} from 'lucide-react';
import { OfferActionModal } from '../../../components/lots/OfferActionModal';
import { BuyerOffer } from '../../../types';

export default function LotDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { lots, respondToOffer } = useApp();

  const lotId = params.id as string;
  const lot = lots.find((l) => l.id === lotId || l.lotNumber === lotId) || lots[0];

  const [selectedOffer, setSelectedOffer] = useState<BuyerOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!lot) {
    return (
      <div className="p-12 text-center text-slate-500">
        Lot not found. <Link href="/lots" className="text-brand-600 underline">Back to lots</Link>
      </div>
    );
  }

  const handleOpenOfferModal = (offer: BuyerOffer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleOfferResponse = async (action: 'accept' | 'reject' | 'counter', counterPrice?: number) => {
    if (!selectedOffer) return;
    await respondToOffer(lot.id, selectedOffer.id, action, counterPrice);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Back Link */}
      <Link
        href="/lots"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Lots</span>
      </Link>

      {/* Lot Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {lot.lotNumber}
            </span>
            <span className="text-xs font-bold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-200">
              {lot.qualityGrade.split(' ')[0]} Grade
            </span>
            <span className="text-xs text-slate-400">• Listed {lot.createdAt}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {lot.cropName} <span className="text-lg font-normal text-slate-500">({lot.variety})</span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Harvested: <strong>{lot.harvestDate}</strong>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Location: <strong>{lot.location}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              Moisture: <strong>{lot.moisturePercentage || 12}%</strong>
            </span>
          </div>
        </div>

        {/* Quantity & Base Target Price Box */}
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Lot Size
            </span>
            <span className="text-xl font-black text-slate-900">{lot.quantityKg.toLocaleString('en-IN')} kg</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Target Price
            </span>
            <span className="text-xl font-black text-brand-700">₹{lot.expectedPricePerKg.toFixed(2)}/kg</span>
          </div>
        </div>
      </div>

      {/* Offers Received Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Coins className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Incoming Buyer Bids & Negotiations ({lot.offers?.length || 0})
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Click &apos;Review Offer&apos; to Accept, Reject or Counter-Offer
          </span>
        </div>

        {lot.offers && lot.offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lot.offers.map((offer) => {
              const isBest = offer.id === 'offer_rel_01';
              const isAccepted = offer.status === 'accepted';
              const isCountered = offer.status === 'countered';
              const isRejected = offer.status === 'rejected';

              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-3xl p-6 shadow-card border transition flex flex-col justify-between ${
                    isAccepted
                      ? 'border-brand-500 bg-brand-50/20'
                      : isBest
                      ? 'border-amber-400 shadow-highlight'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Buyer Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {offer.buyerName}
                          </h3>
                          <span className="text-[11px] text-slate-500">{offer.buyerType}</span>
                        </div>
                      </div>

                      {isBest && !isAccepted && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Best Offer
                        </span>
                      )}
                      {isAccepted && (
                        <span className="bg-brand-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Deal Locked ✓
                        </span>
                      )}
                    </div>

                    {/* Pricing Matrix */}
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs mb-4 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Offered Gross Price:</span>
                        <strong className="text-sm text-slate-900 font-black">
                          ₹{offer.offeredPricePerKg.toFixed(2)}/kg
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-rose-600">
                        <span>Est. Transport Freight:</span>
                        <span className="font-semibold">-₹{offer.estimatedTransportPerKg.toFixed(2)}/kg</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-brand-900 font-bold text-sm">
                        <span>Net Take-Home:</span>
                        <span className="text-base font-black text-brand-700">
                          ₹{offer.estimatedNetRealizationPerKg.toFixed(2)}/kg
                        </span>
                      </div>
                    </div>

                    {/* Terms & Pickup */}
                    <div className="text-xs text-slate-600 space-y-1 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Payment Terms: <strong>{offer.paymentTerms}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pickup: <strong>{offer.pickupOffered ? 'Farm gate pickup included' : 'Self drop'}</strong></span>
                      </div>
                      {offer.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-1">&quot;{offer.notes}&quot;</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100">
                    {isAccepted ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-brand-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Deal Escrow Active
                        </span>
                        <Link
                          href="/transactions"
                          className="px-3 py-1.5 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition"
                        >
                          View Settlement →
                        </Link>
                      </div>
                    ) : isCountered ? (
                      <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                        <span>Counter proposal sent: <strong>₹{offer.counterPricePerKg}/kg</strong></span>
                        <span className="text-[10px] text-slate-500">Awaiting response</span>
                      </div>
                    ) : isRejected ? (
                      <span className="text-xs text-rose-600 font-semibold block text-center">
                        Offer declined
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenOfferModal(offer)}
                        className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Review & Negotiate Offer</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-card">
            <Coins className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No offers received yet</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Buyers in the Nashik-Pune cluster are reviewing this listing.
            </p>
          </div>
        )}
      </div>

      {/* Offer Action Negotiation Modal */}
      <OfferActionModal
        lot={lot}
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRespond={handleOfferResponse}
      />
    </div>
  );
}
