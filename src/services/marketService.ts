import { MandiMarket, CropInfo, PriceHistoryPoint, PriceTrendMetrics, PrototypeForecastData } from '../types';
import { MOCK_MANDIS, MOCK_CROPS } from '../data/mockData';
import { api } from '../lib/api';

export const marketService = {
  getAvailableCrops: async (): Promise<CropInfo[]> => {
    const data = await api.getCrops() as any;
    if (data && Array.isArray(data.results || data)) {
      const list = data.results || data;
      if (list.length > 0) {
        return list.map((c: any) => ({
          id: `crop_${c.id}`,
          name: c.name,
          localName: c.local_name || c.name,
          category: c.crop_category,
          icon: c.icon || '🌱',
          unit: c.unit || 'kg',
          defaultShelfLifeDays: c.default_shelf_life_days || 7,
          currentAvgPricePerKg: 24.0,
          priceTrend: 'rising' as const,
          volatility: 'medium' as const,
        }));
      }
    }
    return [...MOCK_CROPS];
  },

  getCropById: async (id: string): Promise<CropInfo | undefined> => {
    return MOCK_CROPS.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase());
  },

  getNearbyMandis: async (cropName?: string, maxDistanceKm?: number): Promise<MandiMarket[]> => {
    const data = await api.getMarkets() as any;
    if (data && Array.isArray(data.results || data)) {
      const list = data.results || data;
      if (list.length > 0) {
        let mandis = list.map((m: any) => ({
          id: `mandi_${m.id}`,
          name: m.name,
          state: m.state,
          district: m.district,
          distanceKm: parseFloat(m.distance_km_default),
          currentPricePerKg: 23.0,
          yesterdayPricePerKg: 22.0,
          modalPricePerKg: 23.0,
          arrivalVolumeQuintals: 1500,
          arrivalTrend: 'steady' as const,
          marketFeePercent: parseFloat(m.market_fee_percent),
          weighmentCostPerKg: parseFloat(m.weighment_cost_per_kg),
          unloadingCostPerKg: parseFloat(m.unloading_cost_per_kg),
          paymentCycleDays: m.payment_cycle_days,
          reliabilityScore: m.reliability_score,
          operatingHours: m.operating_hours,
        }));
        if (maxDistanceKm) {
          mandis = mandis.filter((m: any) => m.distanceKm <= maxDistanceKm);
        }
        return mandis;
      }
    }

    let mandis = [...MOCK_MANDIS];
    if (maxDistanceKm) {
      mandis = mandis.filter((m) => m.distanceKm <= maxDistanceKm);
    }
    return mandis.sort((a, b) => a.distanceKm - b.distanceKm);
  },

  calculateFreightCostPerKg: (distanceKm: number, quantityKg: number = 500): number => {
    if (distanceKm <= 10) return 0.5;
    if (distanceKm <= 30) return 1.2;
    if (distanceKm <= 60) return 1.8;
    if (distanceKm <= 250) return 2.8;
    return Math.round((4.0 * (distanceKm / 1280)) * 100) / 100;
  },

  getMandiById: async (id: string): Promise<MandiMarket | undefined> => {
    return MOCK_MANDIS.find((m) => m.id === id);
  },

  getPriceHistory: async (crop: string = 'Tomato', marketId?: number, days: number = 30): Promise<PriceHistoryPoint[]> => {
    const data = await api.getPriceHistory(crop, marketId, days) as any;
    if (data && Array.isArray(data.prices)) {
      return data.prices.map((p: any) => ({
        date: p.date,
        modalPrice: parseFloat(p.modal_price),
        minPrice: parseFloat(p.min_price),
        maxPrice: parseFloat(p.max_price),
        arrivalVolume: parseFloat(p.arrival_volume),
        marketName: p.market_name,
      }));
    }

    // Client fallback simulation
    const points: PriceHistoryPoint[] = [];
    const base = crop.toLowerCase().includes('tomato') ? 22 : 28;
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const val = Math.round((base - (i * 0.04) + Math.sin(i / 3) * 0.7) * 10) / 10;
      points.push({
        date: d.toISOString().substring(0, 10),
        modalPrice: val,
        minPrice: Math.round((val - 1.0) * 10) / 10,
        maxPrice: Math.round((val + 1.2) * 10) / 10,
        arrivalVolume: 1200 + i * 15,
        marketName: 'Regional Mandi Average',
      });
    }
    return points;
  },

  getPriceTrend: async (crop: string = 'Tomato', marketId?: number, days: number = 30): Promise<PriceTrendMetrics | null> => {
    const data = await api.getPriceTrend(crop, marketId, days) as any;
    if (data && data.trend_direction) {
      return {
        cropId: data.crop_id,
        cropName: data.crop_name,
        marketName: data.market_name,
        timeframeDays: data.timeframe_days,
        dataPointsCount: data.data_points_count,
        currentPrice: parseFloat(data.current_price),
        averagePrice: parseFloat(data.average_price),
        minPrice: parseFloat(data.min_price),
        maxPrice: parseFloat(data.max_price),
        priceChangeAbsolute: parseFloat(data.price_change_absolute),
        percentageChange: parseFloat(data.percentage_change),
        trendDirection: data.trend_direction,
        momentum: data.momentum,
        volatility: data.volatility,
        isSufficientData: data.is_sufficient_data,
        note: data.note,
      };
    }
    return null;
  },

  getPriceForecast: async (crop: string = 'Tomato', marketId?: number, daysAhead: number = 7): Promise<PrototypeForecastData | null> => {
    const data = await api.getPriceForecast(crop, marketId, daysAhead) as any;
    if (data && Array.isArray(data.forecast_points)) {
      return {
        cropId: data.crop_id,
        cropName: data.crop_name,
        modelType: data.model_type,
        currentSpotPrice: parseFloat(data.current_spot_price),
        forecastHorizonDays: data.forecast_horizon_days,
        forecastConfidenceScore: data.forecast_confidence_score,
        isReliableData: data.is_reliable_data,
        peakSellingDay: data.peak_selling_day,
        peakExpectedPrice: parseFloat(data.peak_expected_price),
        peakPriceRange: data.peak_price_range,
        recommendedAction: data.recommended_action,
        forecastPoints: data.forecast_points.map((pt: any) => ({
          day: pt.day_label,
          date: pt.date_formatted || pt.date,
          expectedPrice: parseFloat(pt.predicted_price),
          lowerEstimate: parseFloat(pt.lower_estimate),
          upperEstimate: parseFloat(pt.upper_estimate),
          arrivalIndex: pt.arrival_volume_index,
          isPeakWindow: pt.is_peak_window,
        })),
        explanationNotes: data.explanation_notes,
      };
    }
    return null;
  },
};
