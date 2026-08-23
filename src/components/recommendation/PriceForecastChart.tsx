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
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
      {/* Header & Mode Switchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-brand-700">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Market Intelligence & Price Dynamics
            </span>
          </div>
          <h3 className="font-black text-slate-900 text-lg sm:text-xl mt-1">
            {cropName} Historical Prices & 7-Day Prototype Forecast
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent statistical momentum and regional arrival surge trajectory (ML-pluggable).
          </p>
        </div>

        {/* Timeframe & View Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTimeframe(7)}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeframe === 7 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeframe(30)}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeframe === 30 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeframe(90)}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeframe === 90 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              90D
            </button>
          </div>

          <span className="text-xs font-bold text-brand-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Confidence: {confidenceScore}%
          </span>
        </div>
      </div>

      {/* Key Metric Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Current Spot Rate</span>
          <div className="text-lg font-black text-slate-900 mt-0.5">₹{currentSpot.toFixed(2)}/kg</div>
          <span className="text-[10px] text-slate-500">Nashik-Pune APMC avg</span>
        </div>

        <div>
          <span className="text-slate-400 font-bold uppercase text-[10px] block">3-Day Peak Target</span>
          <div className="text-lg font-black text-emerald-600 mt-0.5">₹{peakForecast.toFixed(2)}/kg</div>
          <span className="text-[10px] text-emerald-700 font-bold">+₹{(peakForecast - currentSpot).toFixed(2)}/kg gain</span>
        </div>

        <div>
          <span className="text-slate-400 font-bold uppercase text-[10px] block">{timeframe}D Historical Range</span>
          <div className="text-lg font-black text-slate-800 mt-0.5">
            ₹{minHistorical.toFixed(1)} – ₹{maxHistorical.toFixed(1)}
          </div>
          <span className="text-[10px] text-slate-500">Min to Max spread</span>
        </div>

        <div>
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Supply Influx Alert</span>
          <div className="text-lg font-black text-amber-600 mt-0.5">+70% Influx</div>
          <span className="text-[10px] text-amber-700 font-medium">Expected from Day 4 onwards</span>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-emerald-600 rounded-full"></span>
            <span className="font-bold text-slate-700">Historical Actuals ({timeframe}D)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 border-t-2 border-dashed border-indigo-600"></span>
            <span className="font-bold text-indigo-700">Prototype Forecast (7D)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded"></span>
            <span className="text-slate-500">Uncertainty Range Band</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 italic">
          Solid Line: Historical | Dashed Line: Prototype Forecast
        </span>
      </div>

      {/* Visual Forecast & Historical Composite Bar / Trend Grid */}
      <div className="border border-slate-100 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-white to-slate-50/50">
        <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-64 relative pt-10 pb-4 border-b border-slate-200">
          {/* Optimal 2-3 Day Window Shading */}
          <div className="absolute inset-y-0 left-[14.28%] right-[57.14%] bg-emerald-500/10 border-x-2 border-dashed border-emerald-500/50 pointer-events-none rounded-xl flex items-start justify-center pt-2 z-10">
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-600" /> Optimal Window
            </span>
          </div>

          {data.map((item, idx) => {
            const isOptimal = idx <= 2;
            const isPeak = idx === recommendedDayIndex;
            const heightPercent = Math.max(
              25,
              Math.round(((item.expectedPrice - overallMin) / scaleRange) * 100)
            );
            const lowerPrice = item.lowerEstimate ?? item.expectedPrice - 0.6;
            const upperPrice = item.upperEstimate ?? item.expectedPrice + 0.6;

            return (
              <div
                key={item.day}
                className="flex flex-col items-center h-full justify-end group relative z-20"
              >
                {/* Rich Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-16 bg-slate-900 text-white text-[11px] font-medium py-1.5 px-3 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-30 space-y-0.5">
                  <div className="font-bold text-emerald-400">
                    Predicted: ₹{item.expectedPrice.toFixed(2)}/kg
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Range: ₹{lowerPrice.toFixed(2)} – ₹{upperPrice.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-amber-300">
                    Regional Arrivals: {item.arrivalIndex}%
                  </div>
                </div>

                {/* Price Display */}
                <span
                  className={`text-xs font-black mb-1.5 transition ${
                    isPeak ? 'text-brand-700 scale-110' : 'text-slate-700'
                  }`}
                >
                  ₹{item.expectedPrice.toFixed(1)}
                </span>

                {/* Range Uncertainty Tag */}
                <span className="text-[9px] text-slate-400 font-mono mb-1 hidden sm:block">
                  ±₹{(upperPrice - item.expectedPrice).toFixed(1)}
                </span>

                {/* Bar Pillar with Uncertainty Shadow */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative ${
                    isPeak
                      ? 'bg-gradient-to-t from-brand-600 to-emerald-400 shadow-md shadow-emerald-600/30'
                      : isOptimal
                      ? 'bg-gradient-to-t from-emerald-500 to-emerald-300'
                      : 'bg-gradient-to-t from-slate-300 to-slate-200'
                  }`}
                >
                  {/* Arrival surge inner indicator bar */}
                  <div
                    style={{ height: `${Math.min(100, item.arrivalIndex / 2.2)}%` }}
                    className="w-1.5 bg-amber-400/80 rounded-full mx-auto absolute bottom-1 left-1/2 -translate-x-1/2"
                    title={`Arrival Surge: ${item.arrivalIndex}`}
                  ></div>
                </div>

                {/* Day Label */}
                <span className="text-[11px] font-bold text-slate-700 mt-2 truncate max-w-full">
                  {item.date}
                </span>
                <span className="text-[9px] text-slate-400">{item.day.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent Methodology & ML Pluggable Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-800 block">
            Transparent Prototype Statistical Model
          </span>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            This forecast is derived from moving momentum, seasonal volume patterns, and regional arrival velocity.
            Designed for modular replacement with trained Prophet / LightGBM time-series models without UI changes.
          </p>
        </div>
      </div>
    </div>
  );
};
