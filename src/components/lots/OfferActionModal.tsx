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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-400 block">
              Negotiation & Deal Lock
            </span>
            <h3 className="font-bold text-base sm:text-lg text-white">
              Offer from {offer.buyerName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Buyer Trust & Rating */}
          <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-500 block">Buyer Category:</span>
              <strong className="text-slate-900 font-bold">{offer.buyerType}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Payment Terms:</span>
              <strong className="text-emerald-700 font-bold">{offer.paymentTerms}</strong>
            </div>
          </div>

          {/* Offer Details Breakdown */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Offered Price:</span>
              <span className="text-base font-black text-slate-900">₹{offer.offeredPricePerKg.toFixed(2)}/kg</span>
            </div>
            <div className="flex items-center justify-between text-rose-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Est. Transport Freight:
              </span>
              <span className="font-semibold">-₹{offer.estimatedTransportPerKg.toFixed(2)}/kg</span>
            </div>
            <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-brand-950 font-black text-sm">
              <span>Your Estimated Net Realization:</span>
              <span className="text-base text-brand-700">₹{offer.estimatedNetRealizationPerKg.toFixed(2)}/kg</span>
            </div>
          </div>

          {/* Total Net Revenue Preview */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-center">
            <span className="text-xs text-slate-400 block mb-1">
              Total In-Bank Payout for {lot.quantityKg} kg {lot.cropName}:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              ₹{netTakeHome.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Protected via Safe Agri-Escrow until weight & grade confirmation.
            </span>
          </div>

          {/* Counter Offer Input Mode */}
          {isCountering ? (
            <form onSubmit={handleCounter} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Proposed Counter Price (₹/kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCountering(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition"
                >
                  Send Counter Proposal (₹{counterPrice}/kg)
                </button>
              </div>
            </form>
          ) : (
            /* Action Buttons: Accept / Counter / Reject */
            <div className="pt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition"
              >
                <XCircle className="w-4 h-4" />
                <span>Decline</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCountering(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs border border-amber-200 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Counter</span>
              </button>

              <button
                type="button"
                onClick={handleAccept}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/30 transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Lock</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
