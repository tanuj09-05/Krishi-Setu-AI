'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Sparkles,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { MandiComparisonTable } from '../../components/market/MandiComparisonTable';
import { NetRealizationFormula } from '../../components/recommendation/NetRealizationFormula';
import { PriceForecastChart } from '../../components/recommendation/PriceForecastChart';
import { recommendationService } from '../../services/recommendationService';
import { marketService } from '../../services/marketService';
import { MOCK_CROPS, MOCK_MANDIS } from '../../data/mockData';
import { AISaleRecommendation, PriceTrendMetrics } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';

export default function MarketsPage() {
  const { selectedCropForAnalysis, setSelectedCropForAnalysis, selectedQuantityKg, setSelectedQuantityKg } = useApp();
  const [recommendation, setRecommendation] = useState<AISaleRecommendation | null>(null);
  const [trendMetrics, setTrendMetrics] = useState<PriceTrendMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [rec, trend] = await Promise.all([
          recommendationService.getRecommendationForCrop(selectedCropForAnalysis, selectedQuantityKg),
          marketService.getPriceTrend(selectedCropForAnalysis, undefined, 30),
        ]);
        setRecommendation(rec);
        if (trend) setTrendMetrics(trend);
      } catch (err) {
        console.warn('Error loading market data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCropForAnalysis, selectedQuantityKg]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Market Intelligence"
        eyebrowIcon={Store}
        title="Price Discovery & Net Realization Matrix"
        description="Discover where your harvest yields the maximum take-home profit after factoring in freight and mandi deductions."
        action={
          <div className="flex items-center gap-2">
            <div>
              <label className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Crop</label>
              <select
                value={selectedCropForAnalysis}
                onChange={(e) => setSelectedCropForAnalysis(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              >
                {MOCK_CROPS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.localName.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Quantity</label>
              <select
                value={selectedQuantityKg}
                onChange={(e) => setSelectedQuantityKg(parseInt(e.target.value))}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              >
                <option value="500">500 kg</option>
                <option value="1200">1,200 kg</option>
                <option value="2500">2,500 kg</option>
                <option value="5000">5,000 kg</option>
              </select>
            </div>
          </div>
        }
      />

      {/* Net Realization Formula */}
      {recommendation && (
        <NetRealizationFormula
          sellingPrice={recommendation.expectedPricePerKg}
          transportCost={recommendation.transportCostPerKg}
          storageCost={recommendation.storageCostPerKg}
          mandiCess={0}
          netRealization={recommendation.estimatedNetRealizationPerKg}
          cropName={selectedCropForAnalysis}
        />
      )}

      {/* Price Forecast Chart */}
      {recommendation && (
        <PriceForecastChart
          data={recommendation.priceForecast7Days}
          cropName={selectedCropForAnalysis}
          confidenceScore={recommendation.confidencePercentage}
        />
      )}

      {/* Mandi Comparison Table */}
      {recommendation ? (
        <MandiComparisonTable
          data={recommendation.breakdown}
          cropName={selectedCropForAnalysis}
          quantityKg={selectedQuantityKg}
        />
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center shadow-card">
          <p className="text-xs text-stone-400">Loading market intelligence data...</p>
        </div>
      )}

      {/* Regional Mandi Pulse & Buyer Advantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* APMC Mandi Pulse */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card">
          <h3 className="text-xs sm:text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2 pb-2 border-b border-stone-100">
            <MapPin className="w-4 h-4 text-stone-500" />
            <span>Nearby APMC Mandi Pulse</span>
          </h3>
          <div className="space-y-2">
            {MOCK_MANDIS.slice(0, 3).map((mandi) => (
              <div
                key={mandi.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200/60 text-xs"
              >
                <div>
                  <p className="font-semibold text-stone-900">{mandi.name}</p>
                  <p className="text-2xs text-stone-500 mt-0.5">
                    {mandi.distanceKm} km · Arrivals: {mandi.arrivalVolumeQuintals} Quintals ({mandi.arrivalTrend})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-stone-400 font-medium block">Modal Price</span>
                  <span className="text-sm font-bold text-stone-900 tabular-nums">₹{mandi.currentPricePerKg}/kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Direct Institutional Matching Wins */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 mb-1 flex items-center gap-2 pb-2 border-b border-stone-100">
              <Sparkles className="w-4 h-4 text-brand-700" />
              <span>Direct Buyer Linkage Advantages</span>
            </h3>
            <p className="text-xs text-stone-500 mt-2 mb-3 leading-relaxed">
              Institutional buyer contracts eliminate intermediary brokerage, mandi cess, and multiple handling loading fees.
            </p>

            <ul className="space-y-2 text-xs text-stone-700">
              {[
                '0% Mandi Cess on direct farm gate & collection hub sales',
                'T+0 to T+1 Instant digital payouts via Safe Escrow',
                'Minimal transit spoilage with scheduled pickup slots',
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-2xs text-stone-500 font-medium">Ready to review active buyers?</span>
            <Link
              href="/buyers"
              className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1"
            >
              <span>View Buyers Board</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
