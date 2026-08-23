'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { HeroRecommendationCard } from '../../components/recommendation/HeroRecommendationCard';
import { PriceForecastChart } from '../../components/recommendation/PriceForecastChart';
import { FactorAnalysis } from '../../components/recommendation/FactorAnalysis';
import { NetRealizationFormula } from '../../components/recommendation/NetRealizationFormula';
import { MandiComparisonTable } from '../../components/market/MandiComparisonTable';
import { recommendationService } from '../../services/recommendationService';
import { MOCK_CROPS } from '../../data/mockData';
import { AISaleRecommendation } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';

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
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Autonomous Recommendation Engine"
        eyebrowIcon={Sparkles}
        title="AI Sale Timing & Buyer Recommendation"
        description="Transparent scoring considering price curves, arrival surges, freight penalties, and buyer credit ratings."
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
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider mb-1">Qty</p>
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

      {/* 1. Hero Recommendation Panel */}
      {recommendation && <HeroRecommendationCard recommendation={recommendation} />}

      {/* 2. Price Forecast Chart */}
      {recommendation && (
        <PriceForecastChart
          data={recommendation.priceForecast7Days}
          cropName={selectedCropForAnalysis}
          confidenceScore={recommendation.confidencePercentage}
        />
      )}

      {/* 3. Explainable Factor Analysis */}
      {recommendation && (
        <FactorAnalysis
          reasons={recommendation.reasons}
          riskAnalysis={recommendation.riskAnalysis}
        />
      )}

      {/* 4. Comparison Table */}
      {recommendation && (
        <div>
          <SectionHeader
            icon={Coins}
            iconAccent="green"
            title="Alternative Destinations — Net Realization Comparison"
          />
          <MandiComparisonTable
            data={recommendation.breakdown}
            cropName={selectedCropForAnalysis}
            quantityKg={selectedQuantityKg}
          />
        </div>
      )}

      {/* CTA Bar */}
      <div className="bg-[#0d1810] text-white rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10 shadow-card-md">
        <div>
          <h3 className="text-sm font-semibold text-white">Ready to execute the recommended sale?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect with Buyer A immediately or list a digital lot for competitive bidding.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/lots/new"
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            Create Lot
          </Link>
          <Link
            href="/buyers"
            className="px-4 py-2 text-xs font-semibold text-gray-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors active:scale-95 flex items-center gap-1.5"
          >
            Buyer Matching
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
