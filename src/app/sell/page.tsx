'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import {
  ArrowUpRight,
  Clock,
  Building,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Calculator,
  Send,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { MOCK_CROPS, MOCK_BUYERS } from '../../data/mockData';
import { InstitutionalBuyer, AISaleRecommendation } from '../../types';
import { recommendationService } from '../../services/recommendationService';
import { buyerService } from '../../services/buyerService';

function SellPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { farmer, showToast, lots } = useApp();

  const initialCrop = searchParams.get('crop') || 'Tomato';
  const initialQty = parseInt(searchParams.get('qty') || '500') || 500;

  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop);
  const [quantityKg, setQuantityKg] = useState<number>(initialQty);
  const [recommendation, setRecommendation] = useState<AISaleRecommendation | null>(null);
  const [buyers, setBuyers] = useState<InstitutionalBuyer[]>(MOCK_BUYERS);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>('buyer_reliance_fresh');
  const [pickupType, setPickupType] = useState<'pickup' | 'drop'>('pickup');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadSellData() {
      try {
        const [rec, fetchedBuyers] = await Promise.all([
          recommendationService.getRecommendationForCrop(selectedCrop, quantityKg),
          buyerService.getAllBuyers(selectedCrop),
        ]);
        if (rec) setRecommendation(rec);
        if (fetchedBuyers && fetchedBuyers.length > 0) {
          setBuyers(fetchedBuyers);
          setSelectedBuyerId(fetchedBuyers[0].id);
        }
      } catch (err) {
        console.warn('Error loading sell data:', err);
      }
    }
    loadSellData();
  }, [selectedCrop, quantityKg]);

  const selectedBuyer = buyers.find((b) => b.id === selectedBuyerId) || buyers[0] || MOCK_BUYERS[0];
  const unitPrice = selectedBuyer?.offeredPricePerKg || 24.0;
  const transportPerKg = pickupType === 'pickup' ? (selectedBuyer?.pickupServiceAvailable ? 1.5 : 2.0) : 0.5;
  const netPerKg = Math.max(0, unitPrice - transportPerKg);
  const totalGross = unitPrice * quantityKg;
  const totalTransport = transportPerKg * quantityKg;
  const totalNet = netPerKg * quantityKg;

  const handleProceed = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast(
        'Proposal Sent Successfully!',
        `Your ${quantityKg}kg ${selectedCrop} lot proposal was sent to ${selectedBuyer.name}. Response expected in 2 hours.`
      );
    }, 600);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-5 animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-brand-700" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-stone-900">Proposal Submitted to {selectedBuyer.name}</h1>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Buyer will review your {quantityKg} kg {selectedCrop} lot. Payment of approximately ₹{totalNet.toLocaleString('en-IN')} will be locked in escrow upon deal confirmation.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 p-4 text-xs text-stone-700 max-w-sm mx-auto space-y-2 text-left shadow-card">
          <div className="flex justify-between">
            <span className="text-stone-400">Buyer</span>
            <strong>{selectedBuyer.name}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Offer Rate</span>
            <strong>₹{unitPrice.toFixed(2)}/kg</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Expected Payout</span>
            <strong className="text-brand-800 text-sm">₹{totalNet.toLocaleString('en-IN')}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Pickup</span>
            <span>{pickupType === 'pickup' ? 'Farm Gate Collection' : 'Self Drop to Hub'}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setIsSuccess(false);
              router.push('/crops');
            }}
            className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold text-xs rounded-md hover:bg-stone-200 transition-colors"
          >
            Go to My Crops
          </button>
          <button
            onClick={() => setIsSuccess(false)}
            className="px-4 py-2 bg-brand-700 text-white font-semibold text-xs rounded-md hover:bg-brand-800 transition-colors"
          >
            Sell Another Crop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-2">
      <PageHeader
        eyebrow="Guided Selling Flow"
        eyebrowIcon={ArrowUpRight}
        title="Sell Your Crop"
        description="Select your crop to see the optimal selling window, compare direct buyers, and view your exact in-hand payout."
      />

      {/* STEP 1 & 2: Crop & Quantity Selection */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-card space-y-4">
        <span className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block">
          Step 1 of 3 · Select Crop & Quantity
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Select Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              {MOCK_CROPS.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.localName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Quantity to Sell (kg)</label>
            <input
              type="number"
              min="50"
              step="50"
              value={quantityKg}
              onChange={(e) => setQuantityKg(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-md text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
        </div>
      </div>

      {/* STEP 3: Recommended Selling Window Advice */}
      <div className="bg-brand-50/70 rounded-xl p-4 sm:p-5 border border-brand-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-brand-800 uppercase tracking-wider block">
            Step 2 · Selling Window Advice
          </span>
          <Badge variant="success" size="sm">Optimal Window</Badge>
        </div>

        <h3 className="text-base font-bold text-stone-900">
          Sell within the next 2–3 days
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          {selectedCrop} prices are currently peak at ₹{unitPrice.toFixed(1)}/kg due to strong procurement demand from corporate retail hubs.
        </p>
      </div>

      {/* STEP 4: Select Trusted Buyer & Transport */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <span className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block">
            Step 3 · Choose Buyer & Transport
          </span>
          <span className="text-2xs text-stone-400">100% Escrow Protected</span>
        </div>

        <div className="space-y-2.5">
          {buyers.map((b) => {
            const isSelected = b.id === selectedBuyerId;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedBuyerId(b.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-500/30'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => setSelectedBuyerId(b.id)}
                    className="text-brand-700 focus:ring-brand-700 w-4 h-4"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-xs sm:text-sm text-stone-900">{b.name}</p>
                      {b.verified && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </div>
                    <p className="text-2xs text-stone-500 mt-0.5">
                      {b.companyType} · {b.distanceKm} km · {b.paymentTerms}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right pl-7 sm:pl-0">
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    ₹{b.offeredPricePerKg.toFixed(2)}/kg
                  </span>
                  <span className="text-2xs text-stone-400 block">{b.paymentReliability}% reliability</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transport Option */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">Transport Method</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPickupType('pickup')}
              className={`p-2.5 rounded-lg border text-left text-xs transition ${
                pickupType === 'pickup'
                  ? 'border-brand-600 bg-brand-50/60 font-semibold text-stone-900'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-700" />
                <span>Farm Gate Pickup</span>
              </div>
              <span className="text-2xs font-normal text-stone-400 block mt-0.5">₹1.50/kg deducted</span>
            </button>

            <button
              type="button"
              onClick={() => setPickupType('drop')}
              className={`p-2.5 rounded-lg border text-left text-xs transition ${
                pickupType === 'drop'
                  ? 'border-brand-600 bg-brand-50/60 font-semibold text-stone-900'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-stone-600" />
                <span>Self Drop to Hub</span>
              </div>
              <span className="text-2xs font-normal text-stone-400 block mt-0.5">₹0.50/kg handling</span>
            </button>
          </div>
        </div>
      </div>

      {/* STEP 5: "You'll Receive" Transparent Payout Box */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-card space-y-3">
        <span className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block">
          Step 4 · What You'll Receive (In-Hand)
        </span>

        <div className="space-y-2 text-xs bg-stone-50 p-3.5 rounded-lg border border-stone-200/60">
          <div className="flex justify-between">
            <span className="text-stone-500">Gross Price ({quantityKg} kg × ₹{unitPrice.toFixed(2)}):</span>
            <strong className="text-stone-900 tabular-nums">₹{totalGross.toLocaleString('en-IN')}</strong>
          </div>
          <div className="flex justify-between text-accent-rose">
            <span>Transport Deduction:</span>
            <span className="font-semibold tabular-nums">−₹{totalTransport.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Mandi Cess / Brokerage:</span>
            <span className="font-semibold text-brand-700">₹0.00 (Direct Linkage)</span>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-2xs text-stone-400 font-semibold uppercase block">
                Total Direct Bank Settlement
              </span>
              <span className="text-xl sm:text-2xl font-bold text-brand-900 tabular-nums">
                ₹{totalNet.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-xs font-semibold text-brand-800 bg-brand-100/80 px-2 py-1 rounded">
              ₹{netPerKg.toFixed(2)}/kg in-hand
            </span>
          </div>
        </div>

        {/* STEP 6: Submit / Lock Deal Button */}
        <button
          type="button"
          onClick={handleProceed}
          disabled={isSubmitting}
          className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm rounded-md shadow-subtle transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Submitting Proposal...' : `Send Proposal to ${selectedBuyer.name}`}</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-2xs text-stone-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
          <span>100% RBI Escrow Protected · Free Cancellation Before Vehicle Dispatch</span>
        </div>
      </div>
    </div>
  );
}

export default function SellPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto py-12 text-center text-xs text-stone-400">Loading selling options...</div>}>
      <SellPageContent />
    </Suspense>
  );
}
