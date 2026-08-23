'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import {
  Boxes,
  Users,
  Store,
  Plus,
  Receipt,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { HeroRecommendationCard } from '../components/recommendation/HeroRecommendationCard';
import { NetRealizationFormula } from '../components/recommendation/NetRealizationFormula';
import { LotCard } from '../components/lots/LotCard';
import { BuyerCard } from '../components/buyer/BuyerCard';
import { SendLotModal } from '../components/buyer/SendLotModal';
import { StatCard } from '../components/ui/StatCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { MOCK_CROPS, MOCK_BUYERS } from '../data/mockData';
import { InstitutionalBuyer, AISaleRecommendation } from '../types';
import { recommendationService } from '../services/recommendationService';
import { buyerService } from '../services/buyerService';

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
  const totalEarnings = transactions.reduce((acc, t) => acc + t.netRealizationAmount, 0);
  const pendingOffers = lots.reduce((acc, l) => acc + (l.offers?.filter(o => o.status === 'pending').length ?? 0), 0);

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
      { type: 'positive' as const, text: 'Reliance Retail offers the highest Net Realization of ₹22.50/kg after transport deductions.', impactScore: 95 },
      { type: 'positive' as const, text: 'Buyer offers 99.2% payment reliability with T+0 instant digital settlement.', impactScore: 90 },
    ],
    riskAnalysis: { spoilageRisk: 'Low', priceDropRisk: 'Moderate', paymentRisk: 'Minimal (Escrow Backed)' },
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-stone-200/80">
        <div>
          <span className="text-2xs font-semibold text-brand-700 uppercase tracking-wider block mb-0.5">
            {farmer.name} · {farmer.village}, {farmer.district}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Agricultural Market Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Live crop price discovery, freight-adjusted realization, and verified buyer linkages.
          </p>
        </div>
        <Link
          href="/lots/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-md shadow-subtle transition-colors shrink-0 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>List Harvest Lot</span>
        </Link>
      </div>

      {/* Metric Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Active Lots"
          value={activeLots.length}
          trendLabel={activeLots.length > 0 ? `${activeLots.length} on network` : 'None listed'}
        />
        <StatCard
          label="Krishi Trust Score"
          value={farmer.trustScore}
          unit="%"
          trend="up"
          trendLabel="Tier 1 Farmer"
        />
        <StatCard
          label="Total Realized Payout"
          value={`₹${(totalEarnings / 1000).toFixed(0)}k`}
          trendLabel={`${transactions.length} settlements`}
        />
        <StatCard
          label="Pending Buyer Bids"
          value={pendingOffers}
          trend={pendingOffers > 0 ? 'up' : undefined}
          trendLabel={pendingOffers > 0 ? 'Awaiting response' : '0 bids pending'}
        />
      </div>

      {/* Centerpiece: AI Recommendation Briefing */}
      <HeroRecommendationCard
        recommendation={topRec}
        onActionClick={() => handleOpenSendLot(buyersList[0] || MOCK_BUYERS[0])}
      />

      {/* Net Realization Formula Breakdown */}
      <NetRealizationFormula
        sellingPrice={topRec.expectedPricePerKg}
        transportCost={topRec.transportCostPerKg}
        storageCost={topRec.storageCostPerKg}
        mandiCess={0.0}
        netRealization={topRec.estimatedNetRealizationPerKg}
        cropName={topRec.cropName}
      />

      {/* Daily Crop Price Snapshot */}
      <div>
        <SectionHeader
          icon={Store}
          title="Regional Mandi Modal Prices"
          viewAllHref="/markets"
          viewAllLabel="Compare all mandis"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {MOCK_CROPS.map((crop) => (
            <Link
              key={crop.id}
              href={`/markets?crop=${encodeURIComponent(crop.name)}`}
              className="bg-white rounded-lg p-3 border border-stone-200/80 hover:border-stone-300 shadow-card transition-colors block group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">{crop.icon}</span>
                <span className={`text-2xs font-semibold px-1.5 py-0.2 rounded ${
                  crop.priceTrend === 'rising'
                    ? 'text-brand-800 bg-brand-50'
                    : crop.priceTrend === 'falling'
                    ? 'text-accent-rose bg-rose-50'
                    : 'text-stone-600 bg-stone-100'
                }`}>
                  {crop.priceTrend === 'rising' ? '↑ Rising' : crop.priceTrend === 'falling' ? '↓ Falling' : '– Stable'}
                </span>
              </div>
              <p className="font-semibold text-xs text-stone-900 truncate">{crop.name}</p>
              <p className="text-sm font-bold text-stone-900 mt-0.5 tabular-nums">
                ₹{crop.currentAvgPricePerKg.toFixed(1)}
                <span className="text-2xs font-normal text-stone-400">/kg</span>
              </p>
              <p className="text-2xs text-stone-400 mt-0.5">{crop.localName}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Lots & Incoming Offers */}
      <div>
        <SectionHeader
          icon={Boxes}
          title="My Harvest Lots & Bids"
          count={totalLotsCount}
          viewAllHref="/lots"
          viewAllLabel="All lots"
        />
        {lots.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="No lots listed yet"
            description="Create your first digital lot to receive direct bids from corporate buyers."
            action={
              <Link
                href="/lots/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-700 text-white rounded-md text-xs font-semibold hover:bg-brand-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Lot</span>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lots.slice(0, 3).map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        )}
      </div>

      {/* Verified Buyers Demand Board */}
      <div>
        <SectionHeader
          icon={Users}
          title="Verified Institutional Buyers"
          count={buyersList.length}
          viewAllHref="/buyers"
          viewAllLabel="All buyers"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyersList.slice(0, 3).map((buyer) => (
            <BuyerCard
              key={buyer.id}
              buyer={buyer}
              onSendLotClick={handleOpenSendLot}
            />
          ))}
        </div>
      </div>

      {/* Recent Escrow Settlements */}
      {transactions.length > 0 && (
        <div>
          <SectionHeader
            icon={Receipt}
            title="Recent Escrow Settlements"
            count={transactions.length}
            viewAllHref="/transactions"
            viewAllLabel="All transactions"
          />
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-card divide-y divide-stone-100">
            {transactions.slice(0, 3).map((txn) => (
              <div key={txn.id} className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                    {txn.cropName} · {txn.quantityKg.toLocaleString('en-IN')} kg
                  </p>
                  <p className="text-2xs text-stone-500 mt-0.5">
                    {txn.buyerName} · <span className="font-mono text-stone-400">{txn.lotNumber}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm sm:text-base font-bold text-brand-800 tabular-nums">
                    ₹{txn.netRealizationAmount.toLocaleString('en-IN')}
                  </p>
                  <Badge variant={txn.paymentStatus === 'completed' ? 'success' : 'warning'} size="sm">
                    {txn.paymentStatus === 'completed' ? 'Settled' : 'In Escrow'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send Lot Modal */}
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
