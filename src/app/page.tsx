'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Boxes,
  Users,
  Store,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Receipt,
  Coins,
  Activity,
  ArrowUpRight,
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
      { type: 'positive' as const, text: 'Reliance Retail offers the highest Net Realization of ₹22.50/kg after transport.', impactScore: 95 },
      { type: 'positive' as const, text: 'Buyer offers 99.2% payment reliability with T+0 instant digital settlement.', impactScore: 90 },
    ],
    riskAnalysis: { spoilageRisk: 'Low', priceDropRisk: 'Moderate', paymentRisk: 'Minimal (Escrow Backed)' },
  };

  return (
    <div className="space-y-7 animate-fade-in">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <p className="text-xs font-medium text-brand-700 mb-1">
            Welcome back, {farmer.name} · {farmer.village}, {farmer.district}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Market Intelligence Dashboard
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Harvest timing, buyer linkages and net realization — optimized.
          </p>
        </div>
        <Link
          href="/lots/new"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors duration-150 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Harvest</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Active Lots"
          value={activeLots.length}
          icon={Boxes}
          accent={activeLots.length > 0 ? 'green' : 'neutral'}
          trendLabel={activeLots.length > 0 ? `${activeLots.length} on network` : 'None listed'}
        />
        <StatCard
          label="Trust Score"
          value={farmer.trustScore}
          unit="%"
          icon={ShieldCheck}
          accent="green"
          trendLabel="Tier 1 Verified"
          trend="up"
        />
        <StatCard
          label="Total Realized"
          value={`₹${(totalEarnings / 1000).toFixed(0)}k`}
          icon={Coins}
          accent={totalEarnings > 0 ? 'green' : 'neutral'}
          trendLabel={`${transactions.length} transactions`}
        />
        <StatCard
          label="Pending Offers"
          value={pendingOffers}
          icon={Activity}
          accent={pendingOffers > 0 ? 'amber' : 'neutral'}
          trendLabel={pendingOffers > 0 ? 'Awaiting response' : 'No offers'}
          trend={pendingOffers > 0 ? 'up' : undefined}
        />
      </div>

      {/* AI Recommendation Hero */}
      <HeroRecommendationCard
        recommendation={topRec}
        onActionClick={() => handleOpenSendLot(buyersList[0] || MOCK_BUYERS[0])}
      />

      {/* Net Realization Formula */}
      <NetRealizationFormula
        sellingPrice={topRec.expectedPricePerKg}
        transportCost={topRec.transportCostPerKg}
        storageCost={topRec.storageCostPerKg}
        mandiCess={0.0}
        netRealization={topRec.estimatedNetRealizationPerKg}
        cropName={topRec.cropName}
      />

      {/* Crop Market Snapshot */}
      <div>
        <SectionHeader
          icon={Store}
          iconAccent="green"
          title="Today's Crop Market Snapshot"
          viewAllHref="/markets"
          viewAllLabel="Compare all mandis"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {MOCK_CROPS.map((crop) => (
            <Link
              key={crop.id}
              href={`/markets?crop=${encodeURIComponent(crop.name)}`}
              className="bg-white rounded-xl p-3.5 shadow-card border border-stone-200 hover:border-brand-300 hover:shadow-card-md transition-all duration-150 group block"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{crop.icon}</span>
                <Badge
                  variant={crop.priceTrend === 'rising' ? 'success' : crop.priceTrend === 'falling' ? 'danger' : 'neutral'}
                  size="sm"
                >
                  {crop.priceTrend === 'rising' ? '↑' : crop.priceTrend === 'falling' ? '↓' : '–'}
                </Badge>
              </div>
              <p className="font-semibold text-xs text-gray-900 truncate">{crop.name}</p>
              <p className="text-base font-bold text-gray-900 mt-0.5 tabular-nums">
                ₹{crop.currentAvgPricePerKg.toFixed(1)}
                <span className="text-xs font-normal text-stone-400">/kg</span>
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">{crop.localName}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Lots */}
      <div>
        <SectionHeader
          icon={Boxes}
          iconAccent="amber"
          title="Your Active Lots & Incoming Bids"
          viewAllHref="/lots"
          viewAllLabel={`View all ${totalLotsCount}`}
        />
        {lots.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="No lots listed yet"
            description="Create your first digital lot to start receiving buyer offers."
            action={
              <Link
                href="/lots/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-700 text-white rounded-lg text-xs font-semibold hover:bg-brand-800 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Create Lot
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

      {/* Verified Buyers */}
      <div>
        <SectionHeader
          icon={Users}
          iconAccent="green"
          title="Verified Institutional Buyers"
          viewAllHref="/buyers"
          viewAllLabel="Explore all buyers"
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

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div>
          <SectionHeader
            icon={Receipt}
            iconAccent="indigo"
            title="Recent Escrow Settlements"
            viewAllHref="/transactions"
            viewAllLabel="View all transactions"
          />
          <div className="bg-white rounded-xl border border-stone-200 shadow-card divide-y divide-stone-100">
            {transactions.slice(0, 3).map((txn) => (
              <div key={txn.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {txn.cropName} · {txn.quantityKg.toLocaleString('en-IN')} kg
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {txn.buyerName} · <span className="font-mono text-stone-400">{txn.lotNumber}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-brand-800 tabular-nums">
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
