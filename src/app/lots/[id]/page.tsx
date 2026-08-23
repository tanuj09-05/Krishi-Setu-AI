'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Scale,
  Coins,
  Truck,
  Clock,
  CheckCircle2,
  ArrowRightLeft,
} from 'lucide-react';
import { OfferActionModal } from '../../../components/lots/OfferActionModal';
import { BuyerOffer } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';

export default function LotDetailsPage() {
  const params = useParams();
  const { lots, respondToOffer } = useApp();

  const lotId = params.id as string;
  const lot = lots.find((l) => l.id === lotId || l.lotNumber === lotId) || lots[0];

  const [selectedOffer, setSelectedOffer] = useState<BuyerOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!lot) {
    return (
      <div className="p-12 text-center text-stone-500">
        Lot not found.{' '}
        <Link href="/lots" className="text-brand-700 underline">
          Back to lots
        </Link>
      </div>
    );
  }

  const handleOpenOfferModal = (offer: BuyerOffer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleOfferResponse = async (
    action: 'accept' | 'reject' | 'counter',
    counterPrice?: number
  ) => {
    if (!selectedOffer) return;
    await respondToOffer(lot.id, selectedOffer.id, action, counterPrice);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Back Link */}
      <Link
        href="/lots"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-brand-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to All Lots
      </Link>

      {/* Lot Hero */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">{lot.lotNumber}</span>
              <Badge variant="success" size="md">{lot.qualityGrade.split(' ')[0]} Grade</Badge>
              <span className="text-xs text-stone-400">Listed {lot.createdAt}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {lot.cropName}
              <span className="font-normal text-stone-400 ml-2 text-lg">({lot.variety})</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Harvested <strong className="text-gray-700">{lot.harvestDate}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <strong className="text-gray-700">{lot.location}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-stone-400" />
                Moisture <strong className="text-gray-700">{lot.moisturePercentage || 12}%</strong>
              </span>
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="flex items-center gap-4 bg-stone-50 px-5 py-4 rounded-xl border border-stone-200 shrink-0">
            <div>
              <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Lot Size</p>
              <p className="text-xl font-bold text-gray-900 tabular-nums mt-0.5">{lot.quantityKg.toLocaleString('en-IN')} kg</p>
            </div>
            <div className="w-px h-10 bg-stone-200" />
            <div>
              <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Target Price</p>
              <p className="text-xl font-bold text-brand-700 tabular-nums mt-0.5">₹{lot.expectedPricePerKg.toFixed(2)}/kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Coins className="w-3.5 h-3.5" />
            </span>
            Incoming Buyer Bids ({lot.offers?.length || 0})
          </h2>
          <p className="text-xs text-stone-400">Review each offer to accept, reject, or counter</p>
        </div>

        {lot.offers && lot.offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lot.offers.map((offer) => {
              const isBest = offer.id === 'offer_rel_01';
              const isAccepted = offer.status === 'accepted';
              const isCountered = offer.status === 'countered';
              const isRejected = offer.status === 'rejected';

              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-xl border shadow-card transition-all flex flex-col ${
                    isAccepted
                      ? 'border-brand-300 ring-1 ring-brand-200'
                      : isBest
                      ? 'border-amber-300 shadow-highlight'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="p-4 flex-1">
                    {/* Buyer header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-500 border border-stone-200 flex items-center justify-center font-bold text-xs">
                          {offer.buyerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{offer.buyerName}</h3>
                          <p className="text-[10px] text-stone-500">{offer.buyerType}</p>
                        </div>
                      </div>
                      {isBest && !isAccepted && <Badge variant="warning" size="sm">Best Offer</Badge>}
                      {isAccepted && <Badge variant="success" size="sm" dot>Deal Locked</Badge>}
                    </div>

                    {/* Pricing */}
                    <div className="bg-stone-50 rounded-lg p-3.5 space-y-2 text-xs mb-3 border border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Offered Gross</span>
                        <strong className="text-gray-900 tabular-nums">₹{offer.offeredPricePerKg.toFixed(2)}/kg</strong>
                      </div>
                      <div className="flex items-center justify-between text-rose-500">
                        <span>Transport</span>
                        <span className="font-semibold tabular-nums">−₹{offer.estimatedTransportPerKg.toFixed(2)}/kg</span>
                      </div>
                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="font-semibold text-gray-800">Net Take-Home</span>
                        <strong className="text-brand-700 text-sm tabular-nums">₹{offer.estimatedNetRealizationPerKg.toFixed(2)}/kg</strong>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="text-xs text-stone-600 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        Payment: <strong>{offer.paymentTerms}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-stone-400" />
                        <strong>{offer.pickupOffered ? 'Farm gate pickup included' : 'Self drop required'}</strong>
                      </div>
                      {offer.notes && (
                        <p className="text-[11px] text-stone-400 italic">"{offer.notes}"</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-3 border-t border-stone-100">
                    {isAccepted ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-brand-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Deal Escrow Active
                        </span>
                        <Link
                          href="/transactions"
                          className="px-3 py-1.5 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-800 transition-colors text-xs"
                        >
                          View Settlement →
                        </Link>
                      </div>
                    ) : isCountered ? (
                      <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center justify-between">
                        <span>Counter sent: <strong>₹{offer.counterPricePerKg}/kg</strong></span>
                        <span className="text-stone-400">Awaiting response</span>
                      </div>
                    ) : isRejected ? (
                      <p className="text-xs text-rose-500 font-medium text-center">Offer declined</p>
                    ) : (
                      <button
                        onClick={() => handleOpenOfferModal(offer)}
                        className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors duration-150 active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Review & Negotiate Offer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Coins}
            title="No offers received yet"
            description="Buyers in the Nashik-Pune cluster are reviewing this listing. Offers will appear here."
          />
        )}
      </div>

      {/* Offer Modal */}
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
