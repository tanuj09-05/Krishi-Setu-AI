'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertCircle,
  Calendar,
  Sparkles,
  Info,
  Clock,
  ChevronRight,
  ShieldCheck,
  LineChart,
} from 'lucide-react';
import { ForecastPoint, PriceHistoryPoint } from '../../types';
import { marketService } from '../../services/marketService';

interface PriceForecastChartProps {
  data: ForecastPoint[];
  cropName?: string;
  recommendedDayIndex?: number;
  confidenceScore?: number;
}

export const PriceForecastChart: React.FC<PriceForecastChartProps> = ({
  data,
  cropName = 'Tomato',
  recommendedDayIndex = 2,
  confidenceScore = 91,
}) => {
  const [timeframe, setTimeframe] = useState<7 | 30 | 90>(30);
  const [historyPoints, setHistoryPoints] = useState<PriceHistoryPoint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'forecast' | 'history' | 'combined'>('combined');

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoadingHistory(true);
        const history = await marketService.getPriceHistory(cropName, undefined, timeframe);
        setHistoryPoints(history);
      } catch (err) {
        console.warn('Error loading price history:', err);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadHistory();
  }, [cropName, timeframe]);

  // Combine historical and forecast data for statistical projection
  const currentSpot = historyPoints.length > 0 ? historyPoints[historyPoints.length - 1].modalPrice : 23.0;
  const peakForecast = data.length > 0 ? Math.max(...data.map((d) => d.expectedPrice)) : 24.1;
  const minHistorical = historyPoints.length > 0 ? Math.min(...historyPoints.map((h) => h.modalPrice)) : 18.0;
  const maxHistorical = historyPoints.length > 0 ? Math.max(...historyPoints.map((h) => h.modalPrice)) : 24.0;
  const overallMax = Math.max(maxHistorical, peakForecast) + 1.5;
  const overallMin = Math.max(5.0, Math.min(minHistorical, ...data.map((d) => d.lowerEstimate || d.expectedPrice)) - 1.5);
  const scaleRange = overallMax - overallMin || 1;

  // Sample historical data down to max 14 points for clean SVG rendering
  const sampledHistory = historyPoints.filter((_, idx) => {
    if (timeframe === 7) return true;
    if (timeframe === 30) return idx % 2 === 0 || idx === historyPoints.length - 1;
    return idx % 6 === 0 || idx === historyPoints.length - 1;
  });

  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-stone-200/80 space-y-5">
      {/* Header & Mode Switchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-stone-500" />
            <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
              {cropName} Price Momentum & 7-Day Statistical Forecast
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Historical price trajectory mapped against anticipated arrival surges and buyer demand.
          </p>
        </div>

        {/* Timeframe & View Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200/60 text-xs">
            {([7, 30, 90] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  timeframe === t ? 'bg-white text-stone-900 shadow-subtle' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t}D
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200/60 text-xs">
            <button
              onClick={() => setActiveTab('combined')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'combined' ? 'bg-white text-stone-900 shadow-subtle' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Full Series
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'forecast' ? 'bg-white text-brand-800 shadow-subtle' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              7-Day Forecast
            </button>
          </div>
        </div>
      </div>

      {/* Metric Callouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
          <span className="text-2xs text-stone-500 uppercase tracking-wider block">Current Price</span>
          <span className="text-base font-bold text-stone-900 mt-0.5 block tabular-nums">₹{currentSpot.toFixed(1)}/kg</span>
          <span className="text-2xs text-stone-400">Modal mandi rate</span>
        </div>

        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
          <span className="text-2xs text-stone-500 uppercase tracking-wider block">Projected Peak</span>
          <span className="text-base font-bold text-brand-800 mt-0.5 block tabular-nums">₹{peakForecast.toFixed(1)}/kg</span>
          <span className="text-2xs text-brand-700">In Day 2–3 window</span>
        </div>

        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
          <span className="text-2xs text-stone-500 uppercase tracking-wider block">{timeframe}D Low / High</span>
          <span className="text-base font-bold text-stone-900 mt-0.5 block tabular-nums">
            ₹{minHistorical.toFixed(1)} – ₹{maxHistorical.toFixed(1)}
          </span>
          <span className="text-2xs text-stone-400">Historical range</span>
        </div>

        <div className="p-3 bg-brand-50/70 rounded-lg border border-brand-200">
          <span className="text-2xs text-brand-800 uppercase tracking-wider font-semibold block">Recommendation</span>
          <span className="text-sm font-bold text-brand-900 mt-0.5 block">Sell on Day 2–3</span>
          <span className="text-2xs text-brand-700">{confidenceScore}% statistical confidence</span>
        </div>
      </div>

      {/* SVG Chart Visualization */}
      <div className="relative h-60 w-full bg-stone-50/50 rounded-lg p-4 border border-stone-200/60 flex flex-col justify-between">
        {/* Y-Axis Guidelines & Labels */}
        <div className="absolute inset-x-4 inset-y-4 flex flex-col justify-between pointer-events-none text-2xs text-stone-400">
          {[overallMax, (overallMax + overallMin) / 2, overallMin].map((val, i) => (
            <div key={i} className="flex items-center w-full">
              <span className="w-10 tabular-nums">₹{val.toFixed(1)}</span>
              <div className="flex-1 border-b border-stone-200/70 border-dashed ml-2"></div>
            </div>
          ))}
        </div>

        {/* SVG Visualization Canvas */}
        <div className="relative flex-1 pl-12 pr-4 pt-3 pb-6 flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
            {/* 1. Historical Line (Solid Slate) */}
            {activeTab !== 'forecast' && sampledHistory.length > 1 && (
              <polyline
                fill="none"
                stroke="#78716c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sampledHistory
                  .map((pt, i) => {
                    const x = (i / (sampledHistory.length - 1 + (activeTab === 'combined' ? data.length : 0))) * 1000;
                    const y = 200 - ((pt.modalPrice - overallMin) / scaleRange) * 180 - 10;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* 2. Forecast Confidence Range Polygon (Soft Sage Area) */}
            {activeTab !== 'history' && data.length > 0 && (
              <polygon
                fill="rgba(34, 197, 94, 0.08)"
                points={[
                  ...data.map((d, i) => {
                    const startOffset = activeTab === 'combined' ? (sampledHistory.length - 1) : 0;
                    const totalPoints = (activeTab === 'combined' ? sampledHistory.length - 1 + data.length : data.length - 1) || 1;
                    const x = ((startOffset + i) / totalPoints) * 1000;
                    const upper = d.upperEstimate || (d.expectedPrice + 1.2);
                    const y = 200 - ((upper - overallMin) / scaleRange) * 180 - 10;
                    return `${x},${y}`;
                  }),
                  ...data
                    .slice()
                    .reverse()
                    .map((d, i) => {
                      const revIdx = data.length - 1 - i;
                      const startOffset = activeTab === 'combined' ? (sampledHistory.length - 1) : 0;
                      const totalPoints = (activeTab === 'combined' ? sampledHistory.length - 1 + data.length : data.length - 1) || 1;
                      const x = ((startOffset + revIdx) / totalPoints) * 1000;
                      const lower = d.lowerEstimate || (d.expectedPrice - 1.2);
                      const y = 200 - ((lower - overallMin) / scaleRange) * 180 - 10;
                      return `${x},${y}`;
                    }),
                ].join(' ')}
              />
            )}

            {/* 3. Forecast Trend Line (Green Dashed) */}
            {activeTab !== 'history' && data.length > 0 && (
              <polyline
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data
                  .map((d, i) => {
                    const startOffset = activeTab === 'combined' ? (sampledHistory.length - 1) : 0;
                    const totalPoints = (activeTab === 'combined' ? sampledHistory.length - 1 + data.length : data.length - 1) || 1;
                    const x = ((startOffset + i) / totalPoints) * 1000;
                    const y = 200 - ((d.expectedPrice - overallMin) / scaleRange) * 180 - 10;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Peak Forecast Highlight Dot */}
            {activeTab !== 'history' && data.length > recommendedDayIndex && (
              <g>
                <circle
                  cx={
                    (( (activeTab === 'combined' ? sampledHistory.length - 1 : 0) + recommendedDayIndex) /
                      (activeTab === 'combined' ? sampledHistory.length - 1 + data.length : data.length - 1 || 1)) *
                    1000
                  }
                  cy={200 - ((data[recommendedDayIndex].expectedPrice - overallMin) / scaleRange) * 180 - 10}
                  r="5"
                  fill="#15803d"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-2xs text-stone-500 pt-2 border-t border-stone-200/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-stone-500 inline-block"></span>
              <span>Historical Price</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-brand-600 border-dashed inline-block"></span>
              <span className="text-brand-800 font-medium">7D AI Projected Price</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-brand-100 border border-brand-200 inline-block"></span>
              <span>Confidence Range</span>
            </span>
          </div>

          <span className="text-stone-400 hidden sm:inline">
            Confidence: <strong className="text-stone-700">{confidenceScore}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
