'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  Building,
  Star,
  ShieldCheck,
  Truck,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BuyerCard } from '../../components/buyer/BuyerCard';
import { SendLotModal } from '../../components/buyer/SendLotModal';
import { MOCK_BUYERS, MOCK_CROPS } from '../../data/mockData';
import { InstitutionalBuyer } from '../../types';
import { buyerService } from '../../services/buyerService';

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
        if (data && data.length > 0) {
          setBuyersList(data);
        }
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

  const filteredBuyers = buyersList.filter((buyer) => {
    const matchesSearch =
      buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.procurementHub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.companyType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-card border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-brand-700">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Direct Institutional Linkages
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Verified Institutional Buyers & Demand Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Connect directly with verified corporate retailers, food processors, and export houses with guaranteed escrow payment terms.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by buyer or hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Crops ({buyersList.length})</option>
            {MOCK_CROPS.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trust Guarantee Pill Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 shadow-lg border border-emerald-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/30 text-brand-300 border border-brand-400/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">
              100% Escrow-Guaranteed Direct Payments
            </h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              All buyers listed on KrishiSetu lock full payment into secured escrow before dispatch. Zero default risk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-100 bg-emerald-800/80 px-4 py-2 rounded-xl border border-emerald-600/50">
          <span>Average Settlement: 24 Hours</span>
        </div>
      </div>

      {/* Buyer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuyers.map((buyer) => (
          <BuyerCard
            key={buyer.id}
            buyer={buyer}
            onSendLotClick={handleOpenSendLot}
          />
        ))}
      </div>

      {filteredBuyers.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base">No matching buyers found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keywords or crop filter.
          </p>
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
