'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, ShieldCheck } from 'lucide-react';
import { BuyerCard } from '../../components/buyer/BuyerCard';
import { SendLotModal } from '../../components/buyer/SendLotModal';
import { MOCK_BUYERS, MOCK_CROPS } from '../../data/mockData';
import { InstitutionalBuyer } from '../../types';
import { buyerService } from '../../services/buyerService';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

export default function BuyersPage() {
  const { lots } = useApp();
  const [buyersList, setBuyersList] = useState<InstitutionalBuyer[]>(MOCK_BUYERS);
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBuyerForModal, setSelectedBuyerForModal] = useState<InstitutionalBuyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBuyers() {
      try {
        setLoading(true);
        const data = await buyerService.getAllBuyers(selectedCrop !== 'All' ? selectedCrop : undefined);
        if (data && data.length > 0) setBuyersList(data);
      } catch (err) {
        console.warn('Error loading buyers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBuyers();
  }, [selectedCrop]);

  const handleOpenSendLot = (buyer: InstitutionalBuyer) => {
    setSelectedBuyerForModal(buyer);
    setIsModalOpen(true);
  };

  const filteredBuyers = buyersList.filter((buyer) =>
    buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buyer.procurementHub.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buyer.companyType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Direct Institutional Linkages"
        eyebrowIcon={Users}
        title="Verified Buyer Demand Board"
        description="Connect directly with verified corporate retailers, food processors, and export houses with guaranteed escrow payment."
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search buyers…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-xs text-gray-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition w-44"
              />
            </div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            >
              <option value="All">All Crops</option>
              {MOCK_CROPS.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Escrow guarantee strip */}
      <div className="flex items-center justify-between gap-4 bg-brand-50 border border-brand-200 rounded-xl px-5 py-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-brand-900">100% Escrow-Guaranteed Direct Payments</p>
            <p className="text-[11px] text-brand-600 mt-0.5">
              All buyers lock full payment into secured escrow before dispatch. Zero default risk.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-brand-700 bg-white border border-brand-200 px-3 py-1.5 rounded-lg shrink-0 hidden sm:inline">
          Avg. settlement: 24 hrs
        </span>
      </div>

      {/* Buyer Grid */}
      {filteredBuyers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuyers.map((buyer) => (
            <BuyerCard
              key={buyer.id}
              buyer={buyer}
              onSendLotClick={handleOpenSendLot}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No matching buyers found"
          description="Try adjusting your search keywords or crop filter."
        />
      )}

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
