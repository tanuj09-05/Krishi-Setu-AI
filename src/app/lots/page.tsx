'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  PlusCircle,
  Filter,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { LotCard } from '../../components/lots/LotCard';
import { DigitalLot } from '../../types';

export default function LotsPage() {
  const { lots } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLots = lots.filter((lot) => {
    if (filterStatus === 'active') return lot.status === 'active_listed' || lot.status === 'offer_received';
    if (filterStatus === 'locked') return lot.status === 'deal_locked' || lot.status === 'in_transit';
    if (filterStatus === 'settled') return lot.status === 'settled';
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-card border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Boxes className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Digital Produce Inventory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            My Digital Lots & Buyer Bids
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your harvest listings, review incoming institutional bids, and negotiate optimal prices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/lots/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-sm transition active:scale-95 text-xs sm:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Lot</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-1.5 rounded-2xl max-w-xl">
        {[
          { id: 'all', label: `All Lots (${lots.length})` },
          { id: 'active', label: 'Active & Offers' },
          { id: 'locked', label: 'Deals Locked' },
          { id: 'settled', label: 'Settled & Paid' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition text-center ${
              filterStatus === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => (
          <LotCard key={lot.id} lot={lot} />
        ))}
      </div>

      {filteredLots.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card">
          <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No lots in this category</h3>
          <p className="text-xs text-slate-500 mt-1">Create a new digital lot to receive buyer offers.</p>
          <Link
            href="/lots/new"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Digital Lot</span>
          </Link>
        </div>
      )}
    </div>
  );
}
