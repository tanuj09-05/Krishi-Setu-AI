import { AISaleRecommendation, NetRealizationBreakdown, RecommendationReason } from '../types';
import { MOCK_TOMATO_RECOMMENDATION, MOCK_MANDIS, MOCK_BUYERS } from '../data/mockData';
import { marketService } from './marketService';
import { api } from '../lib/api';

export const recommendationService = {
  getRecommendationForCrop: async (
    cropName: string = 'Tomato',
    quantityKg: number = 500,
    qualityGrade: string = 'Grade A (Export/Premium)'
  ): Promise<AISaleRecommendation> => {
    // 1. Attempt live Django backend recommendation API first
    const backendData = await api.generateRecommendation({
      crop_name: cropName,
      quantity_kg: quantityKg,
      quality_grade: qualityGrade,
    }) as any;

    if (backendData && backendData.explanation) {
      const explanation = backendData.explanation;
      const breakdownList: NetRealizationBreakdown[] = (explanation.breakdown || []).map((item: any) => ({
        destinationName: item.name,
        destinationType: item.type === 'BUYER' ? 'buyer' : 'mandi',
        grossPricePerKg: item.gross_price_per_kg,
        transportCostPerKg: item.transport_cost_per_kg,
        storageAndHandlingPerKg: item.storage_and_handling_per_kg,
        mandiCessAndFeesPerKg: item.mandi_cess_and_fees_per_kg,
        totalDeductionsPerKg: item.total_deductions_per_kg,
        netRealizationPerKg: item.net_realization_per_kg,
        totalGrossAmount: item.total_gross_amount,
        totalDeductions: item.total_deductions,
        totalNetRevenue: item.total_net_revenue,
        isTopRecommendation: item.is_top_recommendation,
      }));

      const reasonsList: RecommendationReason[] = (explanation.reasons || []).map((r: any) => ({
        type: r.type,
        text: r.text,
        impactScore: r.impact_score,
      }));

      const forecastList = (explanation.price_forecast || []).map((f: any) => ({
        day: f.day,
        date: f.date,
        expectedPrice: f.expected_price,
        lowerEstimate: f.lower_estimate,
        upperEstimate: f.upper_estimate,
        arrivalIndex: f.arrival_index,
        isPeakWindow: f.is_peak_window,
      }));

      return {
        id: `rec_${backendData.id}`,
        cropId: `crop_${backendData.crop}`,
        cropName: backendData.crop_name || cropName,
        quantityKg: parseFloat(backendData.quantity),
        currentDate: 'Live from Django AI Engine',
        recommendedDestination: {
          id: 'top_dest',
          name: backendData.recommended_destination_name,
          type: backendData.recommended_destination_type.toLowerCase() === 'buyer' ? 'buyer' : 'mandi',
          location: backendData.destination_location,
          distanceKm: parseFloat(backendData.distance_km),
        },
        recommendedSellingWindow: backendData.recommended_selling_window,
        sellingWindowDays: 3,
        expectedPricePerKg: parseFloat(backendData.expected_price),
        transportCostPerKg: parseFloat(backendData.estimated_transport_per_kg),
        storageCostPerKg: parseFloat(backendData.estimated_storage_cost),
        estimatedNetRealizationPerKg: parseFloat(backendData.estimated_net_realization_per_kg),
        confidencePercentage: backendData.confidence_score,
        actionStrategy: explanation.action_strategy || 'SELL_IN_2_3_DAYS',
        priceForecast7Days: forecastList,
        breakdown: breakdownList,
        reasons: reasonsList,
        trendSummary: explanation.trend_summary,
        forecastMetadata: explanation.forecast_metadata,
        riskAnalysis: explanation.risk_analysis || {
          spoilageRisk: 'Low',
          priceDropRisk: 'Moderate (Arrivals rising by Day 4)',
          paymentRisk: 'Minimal (Escrow Backed)',
        },
      };
    }

    // 2. Fallback to client-side recommendation computation if offline
    if (cropName.toLowerCase().includes('tomato') && quantityKg === 500) {
      return MOCK_TOMATO_RECOMMENDATION;
    }

    const relevantBuyers = MOCK_BUYERS.filter((b) =>
      b.cropRequired.toLowerCase().includes(cropName.toLowerCase())
    );

    const mandiBreakdowns: NetRealizationBreakdown[] = MOCK_MANDIS.map((mandi) => {
      const transport = marketService.calculateFreightCostPerKg(mandi.distanceKm, quantityKg);
      const cess = Math.round((mandi.currentPricePerKg * (mandi.marketFeePercent / 100)) * 100) / 100;
      const handling = mandi.weighmentCostPerKg + mandi.unloadingCostPerKg;
      const totalDeductions = Math.round((transport + cess + handling) * 100) / 100;
      const netPerKg = Math.round((mandi.currentPricePerKg - totalDeductions) * 100) / 100;

      return {
        destinationName: `${mandi.name}`,
        destinationType: 'mandi',
        grossPricePerKg: mandi.currentPricePerKg,
        transportCostPerKg: transport,
        storageAndHandlingPerKg: handling,
        mandiCessAndFeesPerKg: cess,
        totalDeductionsPerKg: totalDeductions,
        netRealizationPerKg: netPerKg,
        totalGrossAmount: Math.round(mandi.currentPricePerKg * quantityKg),
        totalDeductions: Math.round(totalDeductions * quantityKg),
        totalNetRevenue: Math.round(netPerKg * quantityKg),
      };
    });

    const buyerBreakdowns: NetRealizationBreakdown[] = relevantBuyers.map((buyer) => {
      const transport = buyer.pickupServiceAvailable ? 1.5 : marketService.calculateFreightCostPerKg(buyer.distanceKm, quantityKg);
      const netPerKg = Math.round((buyer.offeredPricePerKg - transport) * 100) / 100;

      return {
        destinationName: `${buyer.name} (${buyer.procurementHub})`,
        destinationType: 'buyer',
        grossPricePerKg: buyer.offeredPricePerKg,
        transportCostPerKg: transport,
        storageAndHandlingPerKg: 0,
        mandiCessAndFeesPerKg: 0,
        totalDeductionsPerKg: transport,
        netRealizationPerKg: netPerKg,
        totalGrossAmount: Math.round(buyer.offeredPricePerKg * quantityKg),
        totalDeductions: Math.round(transport * quantityKg),
        totalNetRevenue: Math.round(netPerKg * quantityKg),
      };
    });

    const allOptions = [...buyerBreakdowns, ...mandiBreakdowns].sort(
      (a, b) => b.netRealizationPerKg - a.netRealizationPerKg
    );

    if (allOptions.length > 0) {
      allOptions[0].isTopRecommendation = true;
    }

    const topOption = allOptions[0] || MOCK_TOMATO_RECOMMENDATION.breakdown[0];

    const reasons: RecommendationReason[] = [
      {
        type: 'positive',
        text: `${topOption.destinationName} delivers the highest Net Realization of ₹${topOption.netRealizationPerKg}/kg after accounting for all transport and operational deductions.`,
        impactScore: 94,
      },
      {
        type: 'positive',
        text: `Market supply curve indicates favorable selling window over the next 48–72 hours before regional arrival surge.`,
        impactScore: 89,
      },
      {
        type: 'neutral',
        text: `Quality requirement aligned with ${qualityGrade}. Estimated zero quality deduction risk.`,
        impactScore: 82,
      },
    ];

    const basePrice = topOption.grossPricePerKg;
    const priceForecast7Days = [
      { day: 'Day 1 (Today)', date: 'Today', expectedPrice: basePrice, arrivalIndex: 100 },
      { day: 'Day 2', date: 'Tomorrow', expectedPrice: Math.round((basePrice + 0.5) * 10) / 10, arrivalIndex: 105 },
      { day: 'Day 3 (Peak)', date: '+2 Days', expectedPrice: Math.round((basePrice + 0.8) * 10) / 10, arrivalIndex: 112 },
      { day: 'Day 4', date: '+3 Days', expectedPrice: Math.round((basePrice - 0.6) * 10) / 10, arrivalIndex: 135 },
      { day: 'Day 5', date: '+4 Days', expectedPrice: Math.round((basePrice - 1.8) * 10) / 10, arrivalIndex: 160 },
      { day: 'Day 6', date: '+5 Days', expectedPrice: Math.round((basePrice - 2.5) * 10) / 10, arrivalIndex: 180 },
      { day: 'Day 7', date: '+6 Days', expectedPrice: Math.round((basePrice - 3.2) * 10) / 10, arrivalIndex: 200 },
    ];

    return {
      id: `rec_${cropName.toLowerCase()}_${Date.now()}`,
      cropId: `crop_${cropName.toLowerCase()}`,
      cropName,
      quantityKg,
      currentDate: 'Just now',
      recommendedDestination: {
        id: 'dest_top',
        name: topOption.destinationName,
        type: topOption.destinationType,
        location: 'Nashik Hub Zone',
        distanceKm: 28,
      },
      recommendedSellingWindow: 'Sell within next 2–3 days (Optimal price/arrival window)',
      sellingWindowDays: 3,
      expectedPricePerKg: topOption.grossPricePerKg,
      transportCostPerKg: topOption.transportCostPerKg,
      storageCostPerKg: 0,
      estimatedNetRealizationPerKg: topOption.netRealizationPerKg,
      confidencePercentage: 91,
      priceForecast7Days,
      breakdown: allOptions,
      reasons,
      riskAnalysis: {
        spoilageRisk: 'Low',
        priceDropRisk: 'Moderate',
        paymentRisk: 'Minimal (Escrow Backed)',
      },
    };
  },
};
