'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Filter,
  Sparkles,
  TrendingUp,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  LineChart,
} from 'lucide-react';
import { MandiComparisonTable } from '../../components/market/MandiComparisonTable';
import { NetRealizationFormula } from '../../components/recommendation/NetRealizationFormula';
import { PriceForecastChart } from '../../components/recommendation/PriceForecastChart';
import { recommendationService } from '../../services/recommendationService';
import { marketService } from '../../services/marketService';
import { MOCK_CROPS, MOCK_MANDIS } from '../../data/mockData';
import { AISaleRecommendation, PriceTrendMetrics } from '../../types';

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
        console.warn('Error loading market intelligence data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCropForAnalysis, selectedQuantityKg]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-card border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-brand-700">
              <Store className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Market Intelligence & Price Discovery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Mandi vs Institutional Buyer Net Realization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover where your produce yields the maximum net profit after transport freight and mandi deductions.
          </p>
        </div>

        {/* Interactive Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Select Crop
            </label>
            <select
              value={selectedCropForAnalysis}
              onChange={(e) => setSelectedCropForAnalysis(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
            >
              {MOCK_CROPS.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.localName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Lot Size (kg)
            </label>
            <select
              value={selectedQuantityKg}
              onChange={(e) => setSelectedQuantityKg(parseInt(e.target.value))}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
            >
              <option value="500">500 kg (Small Lot)</option>
              <option value="1200">1,200 kg (Bolero Truck)</option>
              <option value="2500">2,500 kg (Medium Lot)</option>
              <option value="5000">5,000 kg (Full Eicher Truck)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Formula Explainer */}
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

      {/* Interactive Price Chart with 7D/30D/90D historical series & 7D prototype forecast */}
      {recommendation && (
        <PriceForecastChart
          data={recommendation.priceForecast7Days}
          cropName={selectedCropForAnalysis}
          confidenceScore={recommendation.confidencePercentage}
        />
      )}

      {/* Mandi vs Buyer Comparison Table */}
      {recommendation ? (
        <MandiComparisonTable
          data={recommendation.breakdown}
          cropName={selectedCropForAnalysis}
          quantityKg={selectedQuantityKg}
        />
      ) : (
        <div className="p-12 text-center text-slate-400">Loading market analysis...</div>
      )}

      {/* Arrival Trends & Regional Mandi Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearby APMC Mandis Details */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200">
          <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Nearby APMC Mandi Real-Time Pulse</span>
          </h3>

          <div className="space-y-3">
            {MOCK_MANDIS.slice(0, 3).map((mandi) => (
              <div
                key={mandi.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{mandi.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {mandi.distanceKm} km away • Arrivals: <strong>{mandi.arrivalVolumeQuintals} Quintals</strong> ({mandi.arrivalTrend})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Modal Price</span>
                  <span className="text-base font-black text-slate-900">₹{mandi.currentPricePerKg}/kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Buyer Hub Advantages */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-card border border-emerald-700/50 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Why Direct Buyer Matching Wins</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Institutional buyers eliminate middlemen commissions, mandi cess, and multiple handling loading fees.
            </p>

            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>0% Mandi Cess</strong> on direct farm gate & collection hub sales</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>T+0 to T+1 Instant digital payouts</strong> via Safe Escrow</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>Lower transit spoilage</strong> due to scheduled pickup slots</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs">
            <span className="text-emerald-300 font-semibold">Ready to connect with verified buyers?</span>
            <Link
              href="/buyers"
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              View Buyers Board →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
