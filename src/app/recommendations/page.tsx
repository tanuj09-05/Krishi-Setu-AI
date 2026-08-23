'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Building,
  Truck,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { HeroRecommendationCard } from '../../components/recommendation/HeroRecommendationCard';
import { PriceForecastChart } from '../../components/recommendation/PriceForecastChart';
import { FactorAnalysis } from '../../components/recommendation/FactorAnalysis';
import { NetRealizationFormula } from '../../components/recommendation/NetRealizationFormula';
import { MandiComparisonTable } from '../../components/market/MandiComparisonTable';
import { recommendationService } from '../../services/recommendationService';
import { MOCK_CROPS } from '../../data/mockData';
import { AISaleRecommendation } from '../../types';

export default function RecommendationsPage() {
  const { selectedCropForAnalysis, setSelectedCropForAnalysis, selectedQuantityKg, setSelectedQuantityKg } = useApp();
  const [recommendation, setRecommendation] = useState<AISaleRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRec() {
      setLoading(true);
      const rec = await recommendationService.getRecommendationForCrop(
        selectedCropForAnalysis,
        selectedQuantityKg
      );
      setRecommendation(rec);
      setLoading(false);
    }
    fetchRec();
  }, [selectedCropForAnalysis, selectedQuantityKg]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-card border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Autonomous Recommendation Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            AI Sale Timing & Buyer Recommendation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent scoring considering price curves, arrival surges, freight penalties, and buyer credit ratings.
          </p>
        </div>

        {/* Dynamic Selector */}
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
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Quantity
            </label>
            <select
              value={selectedQuantityKg}
              onChange={(e) => setSelectedQuantityKg(parseInt(e.target.value))}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
            >
              <option value="500">500 kg (Small Lot)</option>
              <option value="1200">1,200 kg</option>
              <option value="2500">2,500 kg</option>
              <option value="5000">5,000 kg</option>
            </select>
          </div>
        </div>
      </div>

      {/* 1. Hero Recommendation Banner */}
      {recommendation && <HeroRecommendationCard recommendation={recommendation} />}

      {/* 2. 7-Day Forecast & Supply Wave Predictor */}
      {recommendation && (
        <PriceForecastChart
          data={recommendation.priceForecast7Days}
          cropName={selectedCropForAnalysis}
          confidenceScore={recommendation.confidencePercentage}
        />
      )}

      {/* 3. Transparent Explainable Factors & Risk Analysis */}
      {recommendation && (
        <FactorAnalysis
          reasons={recommendation.reasons}
          riskAnalysis={recommendation.riskAnalysis}
        />
      )}

      {/* 4. Complete Net Realization Matrix Table */}
      {recommendation && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-brand-600" />
            <span>Alternative Destinations Realization Comparison</span>
          </h2>
          <MandiComparisonTable
            data={recommendation.breakdown}
            cropName={selectedCropForAnalysis}
            quantityKg={selectedQuantityKg}
          />
        </div>
      )}

      {/* Call to Action Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Ready to execute the recommended sale?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect with Buyer A immediately or list a digital lot for competitive bidding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/lots/new"
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs sm:text-sm border border-white/20 transition"
          >
            Create Digital Lot
          </Link>
          <Link
            href="/buyers"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-600/30 transition flex items-center gap-2"
          >
            <span>Proceed to Buyer Matching</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
