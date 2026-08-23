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
        eyebrow="Decision Support Engine"
        eyebrowIcon={Sparkles}
        title="AI Sale Timing & Buyer Matching"
        description="Comprehensive optimization assessing supply waves, regional price curves, freight deductions, and buyer credit ratings."
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
                  <option key={c.id} value={c.name}>{c.name}</option>
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

      {/* 1. Hero Recommendation Briefing */}
      {recommendation && <HeroRecommendationCard recommendation={recommendation} />}

      {/* 2. Statistical Price Forecast Chart */}
      {recommendation && (
        <PriceForecastChart
          data={recommendation.priceForecast7Days}
          cropName={selectedCropForAnalysis}
          confidenceScore={recommendation.confidencePercentage}
        />
      )}

      {/* 3. Explainable Factor Analysis & Trade Risk */}
      {recommendation && (
        <FactorAnalysis
          reasons={recommendation.reasons}
          riskAnalysis={recommendation.riskAnalysis}
        />
      )}

      {/* 4. Alternative Destinations Realization Matrix */}
      {recommendation && (
        <div>
          <SectionHeader
            icon={Coins}
            title="Alternative Destinations Net Realization Comparison"
          />
          <MandiComparisonTable
            data={recommendation.breakdown}
            cropName={selectedCropForAnalysis}
            quantityKg={selectedQuantityKg}
          />
        </div>
      )}

      {/* Bottom Action Callout */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">Ready to execute this optimal recommendation?</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Connect directly with verified corporate buyers or list your produce for network-wide bidding.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/lots/new"
            className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors"
          >
            Create Digital Lot
          </Link>
          <Link
            href="/buyers"
            className="px-4 py-2 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-md shadow-subtle transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <span>Proceed to Buyer Matching</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
