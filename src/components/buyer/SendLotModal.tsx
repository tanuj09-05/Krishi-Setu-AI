'use client';

import React, { useState } from 'react';
import { X, Send, Building, ShieldCheck, Calculator } from 'lucide-react';
import { InstitutionalBuyer, DigitalLot } from '../../types';
import { useApp } from '../../context/AppContext';

interface SendLotModalProps {
  buyer: InstitutionalBuyer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SendLotModal: React.FC<SendLotModalProps> = ({ buyer, isOpen, onClose }) => {
  const { lots, showToast } = useApp();
  const [selectedLotId, setSelectedLotId] = useState<string>(lots[0]?.id || '');
  const [offeredPrice, setOfferedPrice] = useState<number>(buyer?.offeredPricePerKg || 24);
  const [notes, setNotes] = useState<string>('Ready for farm gate pickup. Fresh harvest with uniform grading.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !buyer) return null;

  const selectedLot = lots.find((l) => l.id === selectedLotId) || lots[0];
  const lotQuantity = selectedLot?.quantityKg || 500;
  const transportPerKg = buyer.pickupServiceAvailable ? 1.5 : 2.0;
  const netRealizationPerKg = Math.max(0, offeredPrice - transportPerKg);
  const totalNetPayout = netRealizationPerKg * lotQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        'Lot Sent to Buyer',
        `Your ${lotQuantity}kg ${selectedLot?.cropName || 'crop'} lot proposal was submitted to ${buyer.name}. Response expected within 2 hours.`
      );
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-menu border border-stone-200 overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 leading-snug">Send Lot Proposal</h3>
              <p className="text-2xs text-stone-500">Direct linkage with {buyer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Select Digital Lot to Pitch
            </label>
            <select
              value={selectedLotId}
              onChange={(e) => setSelectedLotId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs sm:text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.lotNumber} · {l.cropName} ({l.quantityKg} kg) · Grade {l.qualityGrade.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Offered Unit Price (₹/kg)
              </label>
              <span className="text-2xs text-brand-700 font-medium">
                Buyer rate: ₹{buyer.offeredPricePerKg}/kg
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-xs pointer-events-none">₹</span>
              <input
                type="number"
                step="0.5"
                min="5"
                max="500"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-2 bg-white border border-stone-200 rounded-md text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Quality & Pickup Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-md text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
              placeholder="Provide crate packing or pickup details..."
            />
          </div>

          {/* Realization preview */}
          <div className="p-3 bg-brand-50/70 border border-brand-200/80 rounded-lg space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Estimated Net Realization:</span>
              <strong className="text-brand-900 font-bold tabular-nums">₹{netRealizationPerKg.toFixed(2)}/kg</strong>
            </div>
            <div className="flex items-center justify-between text-2xs text-stone-500">
              <span>Total Estimated Payout:</span>
              <span className="font-semibold text-stone-900 tabular-nums">₹{totalNetPayout.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : 'Submit Pitch to Buyer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
