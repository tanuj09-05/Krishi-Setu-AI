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
        eyebrow="Institutional Linkages"
        eyebrowIcon={Users}
        title="Verified Corporate Buyer Demand Board"
        description="Connect directly with verified corporate retailers, food processing companies, and exporters with 100% escrow payment terms."
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by buyer or hub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-md text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700 w-44 sm:w-56"
              />
            </div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              <option value="All">All Crops ({buyersList.length})</option>
              {MOCK_CROPS.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Escrow Guarantee Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 border border-stone-200/80 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-stone-900">100% Escrow-Guaranteed Direct Payments</p>
            <p className="text-2xs text-stone-500 mt-0.2">
              All buyers lock full settlement amounts into RBI-compliant escrow before dispatch. Zero default risk.
            </p>
          </div>
        </div>
        <span className="text-2xs font-semibold text-brand-800 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded shrink-0 self-start sm:self-auto">
          Avg. Settlement: T+0 to 24 Hours
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

      {/* Modal for Pitching Lot */}
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
