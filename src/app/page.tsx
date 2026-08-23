'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ArrowRight,
  Boxes,
  Users,
  Store,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Clock,
  Calendar,
  Building,
  Coins,
  ReceiptText,
} from 'lucide-react';
import { HeroRecommendationCard } from '../components/recommendation/HeroRecommendationCard';
import { NetRealizationFormula } from '../components/recommendation/NetRealizationFormula';
import { LotCard } from '../components/lots/LotCard';
import { BuyerCard } from '../components/buyer/BuyerCard';
import { SendLotModal } from '../components/buyer/SendLotModal';
import { MOCK_CROPS, MOCK_BUYERS } from '../data/mockData';
import { InstitutionalBuyer, AISaleRecommendation } from '../types';
import { recommendationService } from '../services/recommendationService';
import { buyerService } from '../services/buyerService';
import { marketService } from '../services/marketService';

export default function DashboardPage() {
  const { farmer, lots, transactions } = useApp();
  const [selectedBuyerForModal, setSelectedBuyerForModal] = useState<InstitutionalBuyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendation, setRecommendation] = useState<AISaleRecommendation | null>(null);
  const [buyersList, setBuyersList] = useState<InstitutionalBuyer[]>(MOCK_BUYERS);
  const [loadingRec, setLoadingRec] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoadingRec(true);
        const [rec, buyers] = await Promise.all([
          recommendationService.getRecommendationForCrop('Tomato', 500),
          buyerService.getAllBuyers(),
        ]);
        if (rec) setRecommendation(rec);
        if (buyers && buyers.length > 0) setBuyersList(buyers);
      } catch (err) {
        console.warn('Dashboard data fetch error:', err);
      } finally {
        setLoadingRec(false);
      }
    }
    loadDashboardData();
  }, []);

  const activeLots = lots.filter((l) => l.status === 'active_listed' || l.status === 'offer_received');
  const totalLotsCount = lots.length;

  const handleOpenSendLot = (buyer: InstitutionalBuyer) => {
    setSelectedBuyerForModal(buyer);
    setIsModalOpen(true);
  };

  const topRec = recommendation || {
    id: 'rec_default',
    cropId: 'crop_tomato',
    cropName: 'Tomato',
    quantityKg: 500,
    currentDate: 'Today',
    recommendedDestination: {
      id: 'dest_1',
      name: 'Reliance Retail Sourcing Hub (Buyer A)',
      type: 'buyer' as const,
      location: 'Nashik Hub (28 km)',
      distanceKm: 28,
    },
    recommendedSellingWindow: 'Sell within the next 2–3 days (Peak realization window)',
    sellingWindowDays: 3,
    expectedPricePerKg: 24.0,
    transportCostPerKg: 1.5,
    storageCostPerKg: 0.0,
    estimatedNetRealizationPerKg: 22.5,
    confidencePercentage: 91,
    priceForecast7Days: [],
    breakdown: [],
    reasons: [
      { type: 'positive' as const, text: 'Reliance Retail offers the highest Net Realization of ₹22.50/kg after transport.', impactScore: 95 },
      { type: 'positive' as const, text: 'Buyer offers 99.2% payment reliability with T+0 instant digital settlement.', impactScore: 90 },
    ],
    riskAnalysis: { spoilageRisk: 'Low', priceDropRisk: 'Moderate', paymentRisk: 'Minimal (Escrow Backed)' },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Quick Farmer Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-card border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              Welcome back, {farmer.name}
            </span>
            <span className="text-xs text-slate-500">
              • {farmer.village}, {farmer.district}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            KrishiSetu AI Market Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Optimizing your harvest timing, buyer linkages, and net realization take-home payout.
          </p>
        </div>

        {/* Quick Summary Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center min-w-[90px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Active Lots
            </span>
            <span className="text-xl font-black text-slate-900">{activeLots.length}</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center min-w-[110px]">
            <span className="text-[10px] text-brand-700 font-bold uppercase tracking-wider block">
              Trust Rating
            </span>
            <span className="text-xl font-black text-brand-800">{farmer.trustScore}%</span>
          </div>

          <Link
            href="/lots/new"
            className="flex items-center gap-1.5 px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Harvest</span>
          </Link>
        </div>
      </div>

      {/* 1. HERO AI RECOMMENDATION CARD (Signature Feature) */}
      <HeroRecommendationCard
        recommendation={topRec}
        onActionClick={() => handleOpenSendLot(buyersList[0] || MOCK_BUYERS[0])}
      />

      {/* 2. NET REALIZATION CORE FORMULA WIDGET */}
      <NetRealizationFormula
        sellingPrice={topRec.expectedPricePerKg}
        transportCost={topRec.transportCostPerKg}
        storageCost={topRec.storageCostPerKg}
        mandiCess={0.0}
        netRealization={topRec.estimatedNetRealizationPerKg}
        cropName={topRec.cropName}
      />

      {/* 3. Crop Market Snapshot */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-brand-700">
              <Store className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Today&apos;s Crop Market Snapshot</h2>
          </div>
          <Link
            href="/markets"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            <span>Compare All Mandis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MOCK_CROPS.map((crop) => (
            <Link
              key={crop.id}
              href={`/markets?crop=${encodeURIComponent(crop.name)}`}
              className="bg-white rounded-2xl p-4 shadow-card border border-slate-200 hover:border-brand-400 transition block"
            >
              <div className="flex items-center justify-between text-2xl mb-1">
                <span>{crop.icon}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    crop.priceTrend === 'rising'
                      ? 'bg-emerald-100 text-emerald-800'
                      : crop.priceTrend === 'falling'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {crop.priceTrend === 'rising' ? '▲ Rising' : crop.priceTrend === 'falling' ? '▼ Falling' : '■ Steady'}
                </span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{crop.name}</h3>
              <div className="text-base font-black text-slate-900 mt-1">
                ₹{crop.currentAvgPricePerKg.toFixed(1)}
                <span className="text-xs font-normal text-slate-400">/kg</span>
              </div>
              <span className="text-[10px] text-slate-400">{crop.localName}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Active Lots & Incoming Buyer Offers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Boxes className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Your Active Digital Lots & Bids</h2>
          </div>
          <Link
            href="/lots"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            <span>View All Lots ({totalLotsCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lots.slice(0, 3).map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>
      </div>

      {/* 5. Verified Buyers with High Procurement Demand */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-brand-700">
              <Users className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Verified Nearby Institutional Buyers</h2>
          </div>
          <Link
            href="/buyers"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            <span>Explore All Buyers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {buyersList.slice(0, 3).map((buyer) => (
            <BuyerCard
              key={buyer.id}
              buyer={buyer}
              onSendLotClick={handleOpenSendLot}
            />
          ))}
        </div>
      </div>

      {/* 6. Recent Escrow Transactions & Payouts */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <ReceiptText className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Recent Escrow Settlements</h2>
            </div>
            <Link
              href="/transactions"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              <span>View All Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 2).map((txn) => (
              <div key={txn.id} className="py-3.5 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{txn.cropName} ({txn.quantityKg} kg)</span>
                    <span className="text-xs text-slate-400">• {txn.lotNumber}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Sold to: {txn.buyerName}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Net Realization:</div>
                  <div className="text-base font-black text-emerald-600">₹{txn.netRealizationAmount.toLocaleString('en-IN')}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                    {txn.paymentStatus === 'completed' ? 'Direct DBT Settled ✓' : 'Secured in Escrow'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Sending Lot to Buyer */}
      {selectedBuyerForModal && (
        <SendLotModal
          buyer={selectedBuyerForModal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
