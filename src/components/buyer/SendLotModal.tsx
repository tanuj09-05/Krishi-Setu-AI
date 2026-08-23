'use client';

import React, { useState } from 'react';
import { X, Send, Building, ShieldCheck, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
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
  const [notes, setNotes] = useState<string>('Ready for gate pickup. Fresh harvest with uniform sorting.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !buyer) return null;

  const selectedLot = lots.find((l) => l.id === selectedLotId) || lots[0];
  const lotQuantity = selectedLot?.quantityKg || 500;
  const transportPerKg = buyer.pickupServiceAvailable ? 1.5 : 2.0;
  const netRealizationPerKg = offeredPrice - transportPerKg;
  const totalNetPayout = netRealizationPerKg * lotQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        'Lot Sent to Buyer!',
        `Your ${lotQuantity}kg ${selectedLot?.cropName || 'crop'} lot proposal was submitted to ${buyer.name}. Response expected in 2h.`
      );
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-400/30">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Send Lot to Buyer</h3>
              <p className="text-xs text-slate-300">Direct linkage with {buyer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Buyer Spec Banner */}
          <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200/80 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-500 block">Buyer Requirement:</span>
              <strong className="text-brand-900 font-bold text-sm">
                {buyer.cropRequired} ({buyer.qualityRequirement})
              </strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Hub Base Price:</span>
              <strong className="text-brand-700 font-black text-sm">₹{buyer.offeredPricePerKg}/kg</strong>
            </div>
          </div>

          {/* Select Farmer Lot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Your Lot to Send
            </label>
            <select
              value={selectedLotId}
              onChange={(e) => setSelectedLotId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {lots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.lotNumber} — {lot.cropName} ({lot.quantityKg} kg, {lot.qualityGrade.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Proposed Selling Price Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Proposed Price (₹/kg)
              </label>
              <span className="text-[11px] text-slate-500">Buyer quote: ₹{buyer.offeredPricePerKg}/kg</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                step="0.5"
                min="10"
                max="200"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Live Net Realization Preview in Modal */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Proposed Gross Amount ({lotQuantity} kg × ₹{offeredPrice}):</span>
              <span className="font-semibold text-white">₹{(offeredPrice * lotQuantity).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-rose-300">
              <span>Estimated Logistics Deductions (₹{transportPerKg.toFixed(2)}/kg):</span>
              <span className="font-semibold">-₹{(transportPerKg * lotQuantity).toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-emerald-400 font-bold text-sm">
              <span>Your Estimated Net Realization:</span>
              <span className="text-base text-emerald-300 font-black">
                ₹{netRealizationPerKg.toFixed(2)}/kg (₹{totalNetPayout.toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          {/* Notes for Buyer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pickup Instructions & Crop Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Farm gate pickup available anytime after 8 AM..."
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 transition disabled:opacity-50 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Proposal...' : 'Submit Lot to Buyer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
