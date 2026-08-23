'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ArrowRightLeft, ShieldCheck, Truck, Calculator } from 'lucide-react';
import { BuyerOffer, DigitalLot } from '../../types';

interface OfferActionModalProps {
  lot: DigitalLot;
  offer: BuyerOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onRespond: (action: 'accept' | 'reject' | 'counter', counterPrice?: number) => void;
}

export const OfferActionModal: React.FC<OfferActionModalProps> = ({
  lot,
  offer,
  isOpen,
  onClose,
  onRespond,
}) => {
  const [isCountering, setIsCountering] = useState(false);
  const [counterPrice, setCounterPrice] = useState<number>(offer ? offer.offeredPricePerKg + 1.5 : 25.5);

  if (!isOpen || !offer) return null;

  const totalGross = offer.offeredPricePerKg * lot.quantityKg;
  const transportDeduction = offer.estimatedTransportPerKg * lot.quantityKg;
  const netTakeHome = totalGross - transportDeduction;

  const handleAccept = () => {
    onRespond('accept');
    onClose();
  };

  const handleReject = () => {
    onRespond('reject');
    onClose();
  };

  const handleCounter = (e: React.FormEvent) => {
    e.preventDefault();
    onRespond('counter', counterPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-menu border border-stone-200 overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-2xs font-semibold uppercase tracking-wider text-brand-700 block">
              Negotiation & Deal Lock
            </span>
            <h3 className="font-bold text-base text-stone-900 mt-0.5">
              Offer from {offer.buyerName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
              <span className="text-2xs text-stone-500 uppercase tracking-wider block">Offered Price</span>
              <span className="text-lg font-bold text-stone-900 mt-0.5 block tabular-nums">
                ₹{offer.offeredPricePerKg.toFixed(2)}/kg
              </span>
              <span className="text-2xs text-stone-400">{offer.buyerType}</span>
            </div>

            <div className="p-3 bg-brand-50 rounded-lg border border-brand-200/80">
              <span className="text-2xs text-brand-800 uppercase tracking-wider font-semibold block">Net Take-Home</span>
              <span className="text-lg font-bold text-brand-900 mt-0.5 block tabular-nums">
                ₹{offer.estimatedNetRealizationPerKg.toFixed(2)}/kg
              </span>
              <span className="text-2xs text-brand-700">₹{netTakeHome.toLocaleString('en-IN')} total in-hand</span>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="space-y-2 text-xs border border-stone-200/80 rounded-lg p-3 bg-stone-50/50">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Lot & Quantity:</span>
              <span className="font-semibold text-stone-900">{lot.cropName} ({lot.quantityKg} kg)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Gross Total:</span>
              <span className="font-semibold text-stone-900 tabular-nums">₹{totalGross.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-accent-rose">
              <span>Estimated Logistics Deduction:</span>
              <span className="font-semibold tabular-nums">−₹{transportDeduction.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Logistics Terms:</span>
              <span className="font-medium text-stone-700">
                {offer.pickupOffered ? 'Farm gate pickup included' : 'Self drop to hub required'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Payment Terms:</span>
              <span className="font-medium text-stone-700">{offer.paymentTerms}</span>
            </div>
          </div>

          {/* Counter Offer Form */}
          {isCountering ? (
            <form onSubmit={handleCounter} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Propose Counter Price (₹/kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-xs pointer-events-none">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    min="5"
                    max="500"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-stone-300 rounded-md text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    required
                  />
                </div>
                <p className="text-2xs text-stone-500 mt-1">
                  Buyer will receive your proposal with updated net realization calculations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCountering(false)}
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors"
                >
                  Send Counter Proposal
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleReject}
                className="w-full sm:w-auto px-3 py-2 text-xs font-medium text-accent-rose hover:bg-rose-50 border border-rose-200 rounded-md transition-colors"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => setIsCountering(true)}
                className="w-full sm:w-auto flex-1 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-300 rounded-md transition-colors"
              >
                Counter Offer
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="w-full sm:w-auto flex-1 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors active:scale-95 flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accept & Lock Deal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
