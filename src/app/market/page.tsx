'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Store,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { PriceForecastChart } from '../../components/recommendation/PriceForecastChart';
import { MOCK_CROPS, MOCK_MANDIS } from '../../data/mockData';
import { recommendationService } from '../../services/recommendationService';
import { AISaleRecommendation } from '../../types';

function MarketPageContent() {
  const searchParams = useSearchParams();
  const initialCrop = searchParams.get('crop') || 'Tomato';

  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop);
  const [recommendation, setRecommendation] = useState<AISaleRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCropDetails() {
      try {
        setLoading(true);
        const rec = await recommendationService.getRecommendationForCrop(selectedCrop, 500);
        if (rec) setRecommendation(rec);
      } catch (err) {
        console.warn('Error loading market data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCropDetails();
  }, [selectedCrop]);

  const currentCropObj = MOCK_CROPS.find((c) => c.name === selectedCrop) || MOCK_CROPS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-2">
      <PageHeader
        eyebrow="Live Price Discovery"
        eyebrowIcon={TrendingUp}
        title="Market Rates"
        description="Current crop prices across local APMC mandis and short-term price momentum forecasts."
      />

      {/* 1. Crop Selection Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {MOCK_CROPS.map((c) => {
          const isSelected = c.name === selectedCrop;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCrop(c.name)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-brand-700 bg-brand-50/70 ring-1 ring-brand-600/30'
                  : 'border-stone-200/80 bg-white hover:border-stone-300'
              }`}
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
              <p className="text-sm font-bold text-stone-900 mt-0.5 tabular-nums">
                ₹{c.currentAvgPricePerKg.toFixed(1)}/kg
              </p>
            </button>
          );
        })}
      </div>

      {/* 2. Selected Crop Overview & Advice Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentCropObj.icon}</span>
              <h2 className="text-lg font-bold text-stone-900">
                {currentCropObj.name} ({currentCropObj.localName})
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Average local market price: <strong className="text-stone-900">₹{currentCropObj.currentAvgPricePerKg.toFixed(2)}/kg</strong>
            </p>
          </div>

          <Link
            href={`/sell?crop=${encodeURIComponent(currentCropObj.name)}&qty=500`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors shrink-0 active:scale-95"
          >
            <span>Sell {currentCropObj.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Short-term movement forecast */}
        <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/70 flex items-start gap-2.5 text-xs text-stone-700">
          <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-stone-900">
              Expected movement: Prices are projected to peak in the next 2–3 days
            </p>
            <p className="text-stone-500 text-2xs mt-0.5 leading-relaxed">
              Wholesale arrivals from neighboring talukas are expected to increase over the weekend. Selling now secures the highest net realization.
            </p>
          </div>
        </div>

        {/* Simple Readable Price Forecast Chart */}
        {recommendation && (
          <PriceForecastChart
            data={recommendation.priceForecast7Days}
            cropName={selectedCrop}
            confidenceScore={recommendation.confidencePercentage}
          />
        )}
      </div>

      {/* 3. Regional Mandi Rates */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-card space-y-3">
        <h3 className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
          <MapPin className="w-4 h-4 text-stone-500" />
          <span>Local APMC Mandi Comparison</span>
        </h3>

        <div className="divide-y divide-stone-100 text-xs">
          {MOCK_MANDIS.map((mandi) => (
            <div key={mandi.id} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">{mandi.name}</p>
                <p className="text-2xs text-stone-500">{mandi.distanceKm} km away · {mandi.state}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-stone-900 tabular-nums block">₹{mandi.currentPricePerKg.toFixed(2)}/kg</span>
                <span className="text-2xs text-stone-400">Modal price</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MarketPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-12 text-center text-xs text-stone-400">Loading market rates...</div>}>
      <MarketPageContent />
    </Suspense>
  );
}
