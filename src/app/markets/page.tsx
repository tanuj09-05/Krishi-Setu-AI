'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Sparkles,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { MandiComparisonTable } from '../../components/market/MandiComparisonTable';
import { NetRealizationFormula } from '../../components/recommendation/NetRealizationFormula';
import { PriceForecastChart } from '../../components/recommendation/PriceForecastChart';
import { recommendationService } from '../../services/recommendationService';
import { marketService } from '../../services/marketService';
import { MOCK_CROPS, MOCK_MANDIS } from '../../data/mockData';
import { AISaleRecommendation, PriceTrendMetrics } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

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
        eyebrow="Market Intelligence & Price Discovery"
        eyebrowIcon={Store}
        title="Mandi vs Buyer Net Realization"
        description="Discover where your produce yields the maximum net profit after transport and mandi deductions."
        action={
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider mb-1">Crop</p>
              <select
                value={selectedCropForAnalysis}
                onChange={(e) => setSelectedCropForAnalysis(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              >
                {MOCK_CROPS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.localName.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider mb-1">Lot Size</p>
              <select
                value={selectedQuantityKg}
                onChange={(e) => setSelectedQuantityKg(parseInt(e.target.value))}
                className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
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
          <p className="text-sm text-stone-400">Loading market analysis…</p>
        </div>
      )}

      {/* Bottom row: APMC Mandis + Why Direct Buyer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* APMC Mandi Pulse */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-card">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            Nearby APMC Mandi Pulse
          </h3>
          <div className="space-y-2">
            {MOCK_MANDIS.slice(0, 3).map((mandi) => (
              <div
                key={mandi.id}
                className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors text-xs"
              >
                <div>
                  <p className="font-semibold text-gray-900">{mandi.name}</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {mandi.distanceKm} km ·{' '}
                    <span className="font-medium">{mandi.arrivalVolumeQuintals} Quintals</span>
                    {' '}({mandi.arrivalTrend})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider">Modal Price</p>
                  <p className="text-sm font-bold text-gray-900 tabular-nums">₹{mandi.currentPricePerKg}/kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Direct Buyer Wins */}
        <div className="bg-[#0d1810] text-white rounded-xl p-5 border border-white/10 shadow-card flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Why Direct Buyer Matching Wins
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Institutional buyers eliminate middlemen commissions, mandi cess, and multiple handling fees.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-300 flex-1">
            {[
              '0% Mandi Cess on direct farm gate & collection hub sales',
              'T+0 to T+1 Instant digital payouts via Safe Escrow',
              'Lower transit spoilage due to scheduled pickup slots',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between">
            <p className="text-xs text-brand-400 font-medium">Ready to connect?</p>
            <Link
              href="/buyers"
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-semibold rounded-lg text-xs transition-colors"
            >
              View Buyers →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
