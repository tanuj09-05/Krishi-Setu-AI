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
        <Link href="/lots" className="text-brand-700 underline font-medium">
          Back to all lots
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back navigation */}
      <Link
        href="/lots"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Lots</span>
      </Link>

      {/* Lot Overview Card */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200/80 shadow-card">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-2xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">{lot.lotNumber}</span>
              <Badge variant="success" size="sm">{lot.qualityGrade.split(' ')[0]} Grade</Badge>
              <span className="text-2xs text-stone-400">Listed {lot.createdAt}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {lot.cropName}
              <span className="font-normal text-stone-500 ml-2 text-base">({lot.variety})</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-2.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Harvested: <strong className="text-stone-800">{lot.harvestDate}</strong>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <strong className="text-stone-800">{lot.location}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-stone-400" />
                Moisture: <strong className="text-stone-800">{lot.moisturePercentage || 12}%</strong>
              </span>
            </div>
          </div>

          {/* Quantity & Target Price */}
          <div className="flex items-center gap-4 bg-stone-50 px-4 py-3 rounded-lg border border-stone-200/60 shrink-0">
            <div>
              <span className="text-2xs text-stone-400 uppercase font-medium block">Lot Quantity</span>
              <span className="text-lg font-bold text-stone-900 tabular-nums block mt-0.5">
                {lot.quantityKg.toLocaleString('en-IN')} kg
              </span>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <span className="text-2xs text-stone-400 uppercase font-medium block">Target Price</span>
              <span className="text-lg font-bold text-brand-800 tabular-nums block mt-0.5">
                ₹{lot.expectedPricePerKg.toFixed(2)}/kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Bids Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
          <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <Coins className="w-4 h-4 text-stone-500" />
            <span>Incoming Buyer Bids ({lot.offers?.length || 0})</span>
          </h2>
          <span className="text-2xs text-stone-400">Negotiate or lock deal</span>
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
                  className={`bg-white rounded-xl border shadow-card transition-all flex flex-col justify-between ${
                    isAccepted
                      ? 'border-brand-300 ring-1 ring-brand-200/60'
                      : isBest
                      ? 'border-brand-200'
                      : 'border-stone-200/80'
                  }`}
                >
                  <div className="p-4 flex-1">
                    {/* Buyer header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-stone-100 text-stone-600 border border-stone-200 flex items-center justify-center font-bold text-xs">
                          {offer.buyerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-900 text-sm leading-snug">{offer.buyerName}</h3>
                          <p className="text-2xs text-stone-500">{offer.buyerType}</p>
                        </div>
                      </div>
                      {isBest && !isAccepted && <Badge variant="success" size="sm">Top Offer</Badge>}
                      {isAccepted && <Badge variant="success" size="sm" dot>Deal Locked</Badge>}
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="bg-stone-50 rounded-lg p-3 space-y-1.5 text-xs mb-3 border border-stone-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Offered Gross:</span>
                        <strong className="text-stone-900 tabular-nums">₹{offer.offeredPricePerKg.toFixed(2)}/kg</strong>
                      </div>
                      <div className="flex items-center justify-between text-accent-rose">
                        <span>Transport:</span>
                        <span className="font-medium tabular-nums">−₹{offer.estimatedTransportPerKg.toFixed(2)}/kg</span>
                      </div>
                      <div className="pt-1.5 border-t border-stone-200 flex items-center justify-between">
                        <span className="font-medium text-stone-800">Net Take-Home:</span>
                        <strong className="text-brand-800 text-sm tabular-nums">₹{offer.estimatedNetRealizationPerKg.toFixed(2)}/kg</strong>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="text-xs text-stone-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Payment Terms: <strong>{offer.paymentTerms}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-stone-400" />
                        <span>{offer.pickupOffered ? 'Farm gate pickup included' : 'Self drop required'}</span>
                      </div>
                      {offer.notes && (
                        <p className="text-2xs text-stone-400 italic pt-1">"{offer.notes}"</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-2.5 bg-stone-50/50 border-t border-stone-100">
                    {isAccepted ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-brand-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Escrow Active
                        </span>
                        <Link
                          href="/transactions"
                          className="px-2.5 py-1 bg-brand-700 text-white font-semibold rounded text-xs hover:bg-brand-800 transition-colors"
                        >
                          View Settlement →
                        </Link>
                      </div>
                    ) : isCountered ? (
                      <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 flex items-center justify-between">
                        <span>Counter sent: <strong>₹{offer.counterPricePerKg}/kg</strong></span>
                        <span className="text-stone-400 text-2xs">Awaiting response</span>
                      </div>
                    ) : isRejected ? (
                      <p className="text-xs text-stone-400 font-medium text-center">Offer declined</p>
                    ) : (
                      <button
                        onClick={() => handleOpenOfferModal(offer)}
                        className="w-full py-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Negotiate & Lock Deal</span>
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
            title="No bids received yet"
            description="Verified corporate buyers in the network are reviewing this lot."
          />
        )}
      </div>

      {/* Offer Negotiation Modal */}
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
