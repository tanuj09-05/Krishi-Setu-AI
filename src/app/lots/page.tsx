'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Boxes, Plus } from 'lucide-react';
import { LotCard } from '../../components/lots/LotCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

const FILTER_TABS = [
  { id: 'all',     label: 'All Lots'       },
  { id: 'active',  label: 'Active & Offers' },
  { id: 'locked',  label: 'Deal Locked'    },
  { id: 'settled', label: 'Settled'         },
];

export default function LotsPage() {
  const { lots } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLots = lots.filter((lot) => {
    if (filterStatus === 'active')  return lot.status === 'active_listed' || lot.status === 'offer_received';
    if (filterStatus === 'locked')  return lot.status === 'deal_locked' || lot.status === 'in_transit';
    if (filterStatus === 'settled') return lot.status === 'settled';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Produce Inventory"
        eyebrowIcon={Boxes}
        title="Digital Lots & Buyer Bids"
        description="Manage your harvest listings, review incoming institutional bids, and negotiate optimal prices."
        action={
          <Link
            href="/lots/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-md shadow-subtle transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Lot</span>
          </Link>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200">
        {FILTER_TABS.map((tab) => {
          const count = tab.id === 'all'
            ? lots.length
            : tab.id === 'active'
            ? lots.filter(l => l.status === 'active_listed' || l.status === 'offer_received').length
            : tab.id === 'locked'
            ? lots.filter(l => l.status === 'deal_locked' || l.status === 'in_transit').length
            : lots.filter(l => l.status === 'settled').length;

          const isActive = filterStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-brand-700 text-brand-800 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`ml-1.5 text-2xs px-1.5 py-0.2 rounded font-semibold ${
                  isActive ? 'bg-brand-100 text-brand-800' : 'bg-stone-100 text-stone-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lots Grid */}
      {filteredLots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLots.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Boxes}
          title="No lots in this category"
          description="Create a digital lot to receive direct bids from corporate buyers and food processors."
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
      )}
    </div>
  );
}
