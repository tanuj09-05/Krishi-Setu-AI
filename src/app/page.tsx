'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Sprout,
  Store,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { MOCK_CROPS } from '../data/mockData';
import { AISaleRecommendation } from '../types';
import { recommendationService } from '../services/recommendationService';

export default function HomePage() {
  const { farmer, lots } = useApp();
  const { currentUser } = useAuth();
  const [recommendation, setRecommendation] = useState<AISaleRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const primaryCropName = lots[0]?.cropName || 'Tomato';
  const primaryCropQty = lots[0]?.quantityKg || 500;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const rec = await recommendationService.getRecommendationForCrop(primaryCropName, primaryCropQty);
        if (rec) setRecommendation(rec);
      } catch (err) {
        console.warn('Home recommendation load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [primaryCropName, primaryCropQty]);

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : farmer.name ? farmer.name.split(' ')[0] : 'Farmer';
  const userLocation = currentUser?.location || (farmer.village ? `${farmer.village}, ${farmer.district}` : 'Maharashtra');
  const pendingOffers = lots.reduce((acc, l) => acc + (l.offers?.filter(o => o.status === 'pending').length ?? 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-7 animate-fade-in py-2">

      {/* Greeting & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          Good morning, {firstName}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Here is your crop advice and market summary for today in {userLocation}.
        </p>
      </div>

      {/* 1. TOP ADVICE HERO: What should I do today? */}
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">{primaryCropName === 'Tomato' ? '🍅' : primaryCropName === 'Onion' ? '🧅' : primaryCropName === 'Wheat' ? '🌾' : '🌱'}</span>
            <div>
              <span className="text-xs font-semibold text-stone-900 block leading-tight">
                {primaryCropName} · {primaryCropQty.toLocaleString('en-IN')} kg Harvest Lot
              </span>
              <span className="text-2xs text-stone-400">Farm gate ready · {userLocation}</span>
            </div>
          </div>
          <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200">
            Recommended Action
          </span>
        </div>

        <div>
          <span className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
            Advice for Today
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            Sell within the next 2–3 days
          </h2>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Direct buyer demand from verified procurement hubs is peak this week. Post-harvest prices are projected to soften as outstation wholesale arrivals increase over the weekend.
          </p>
        </div>

        {/* Expected In-Pocket Realization */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-2xs text-stone-500 font-medium block">Expected Offer</span>
            <span className="text-base font-bold text-stone-900 mt-0.5 block tabular-nums">
              ₹{(recommendation?.expectedPricePerKg || 24).toFixed(2)}<span className="text-2xs font-normal text-stone-400">/kg</span>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-brand-50 border border-brand-200/80">
            <span className="text-2xs text-brand-800 font-medium block">You'll Receive (In-Hand)</span>
            <span className="text-base font-bold text-brand-900 mt-0.5 block tabular-nums">
              ~₹{(Math.round((recommendation?.estimatedNetRealizationPerKg || 22.5) * primaryCropQty)).toLocaleString('en-IN')}
              <span className="text-2xs font-normal text-brand-700"> total</span>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/70 col-span-2 sm:col-span-1">
            <span className="text-2xs text-stone-500 font-medium block">Best Window</span>
            <span className="text-xs font-semibold text-stone-800 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>Next 48–72 Hours</span>
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-2xs text-stone-400">
            ✓ 0% Mandi Cess · Farm Gate Pickup Available · T+0 Escrow Payment
          </span>
          <Link
            href={`/sell?crop=${encodeURIComponent(primaryCropName)}&qty=${primaryCropQty}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors active:scale-95 shrink-0"
          >
            <span>View Selling Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. MY CROPS SNAPSHOT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-stone-500" />
            <span>My Crops ({lots.length})</span>
          </h2>
          <Link
            href="/crops"
            className="text-xs font-medium text-brand-700 hover:text-brand-800 transition-colors"
          >
            View all crops →
          </Link>
        </div>

        {lots.length > 0 ? (
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-card divide-y divide-stone-100 overflow-hidden">
            {lots.slice(0, 3).map((lot) => {
              const estValue = lot.expectedPricePerKg * lot.quantityKg;
              const hasOffers = lot.offers && lot.offers.length > 0;

              return (
                <Link
                  key={lot.id}
                  href={`/lots/${lot.id}`}
                  className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-stone-50/60 transition-colors block group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-xs sm:text-sm text-stone-900 group-hover:text-brand-800 transition-colors truncate">
                        {lot.cropName}
                      </p>
                      <span className="text-2xs text-stone-400">({lot.variety})</span>
                    </div>
                    <p className="text-2xs text-stone-500 mt-0.5">
                      {lot.quantityKg.toLocaleString('en-IN')} kg · {hasOffers ? `${lot.offers.length} Buyer Bid Received` : 'Ready to Sell'}
                    </p>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <span className="text-2xs text-stone-400 block font-medium">Est. Value</span>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 tabular-nums block">
                        ₹{estValue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600 transition-colors hidden sm:block" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card text-center space-y-2">
            <p className="text-xs font-semibold text-stone-800">You haven't added any crops yet.</p>
            <p className="text-2xs text-stone-500">List your harvest to receive buyer offers and track optimal selling windows.</p>
            <Link
              href="/lots/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Crop</span>
            </Link>
          </div>
        )}
      </div>

      {/* 3. TODAY'S MARKET SNAPSHOT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-stone-500" />
            <span>Today's Local Market Rates</span>
          </h2>
          <Link
            href="/market"
            className="text-xs font-medium text-brand-700 hover:text-brand-800 transition-colors"
          >
            See full market →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MOCK_CROPS.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={`/market?crop=${encodeURIComponent(c.name)}`}
              className="bg-white rounded-lg p-3 border border-stone-200/80 hover:border-stone-300 shadow-card transition-colors group block"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">{c.icon}</span>
                <span className={`text-2xs font-semibold ${
                  c.priceTrend === 'rising' ? 'text-brand-700' : 'text-accent-rose'
                }`}>
                  {c.priceTrend === 'rising' ? '↑ +8%' : '↓ -3%'}
                </span>
              </div>
              <p className="font-semibold text-xs text-stone-900 truncate">{c.name}</p>
              <p className="text-xs font-bold text-stone-900 mt-0.5 tabular-nums">
                ₹{c.currentAvgPricePerKg.toFixed(1)}/kg
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. IMPORTANT ALERTS */}
      {pendingOffers > 0 && (
        <div className="bg-brand-50/70 border border-brand-200/80 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-semibold text-stone-900">
              You have {pendingOffers} pending buyer bid on your crop lot
            </p>
            <p className="text-stone-600 mt-0.5 text-2xs">
              Review incoming bids and choose whether to accept, counter-offer, or decline.
            </p>
          </div>
          <Link
            href="/crops"
            className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded shadow-subtle shrink-0 transition-colors"
          >
            Review Bid
          </Link>
        </div>
      )}

    </div>
  );
}
