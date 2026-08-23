'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import {
  Boxes,
  PlusCircle,
  Sparkles,
  Calendar,
  MapPin,
  Camera,
  Coins,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { QualityGrade } from '../../../types';
import { MOCK_CROPS } from '../../../data/mockData';

export default function CreateLotPage() {
  const router = useRouter();
  const { createLot, farmer } = useApp();

  const [cropName, setCropName] = useState<string>('Tomato');
  const [variety, setVariety] = useState<string>('Abhinav (Hybrid Red)');
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [expectedPricePerKg, setExpectedPricePerKg] = useState<number>(24.0);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A (Export/Premium)');
  const [moisturePercentage, setMoisturePercentage] = useState<number>(12);
  const [description, setDescription] = useState<string>(
    'Uniform sized red tomatoes, hand-picked this morning. Sorted into standard 20kg crates.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Live Net Realization calculations
  const estTransportPerKg = 1.5;
  const estNetPerKg = Math.max(0, expectedPricePerKg - estTransportPerKg);
  const totalGross = expectedPricePerKg * quantityKg;
  const totalTransport = estTransportPerKg * quantityKg;
  const totalNet = estNetPerKg * quantityKg;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newLot = await createLot({
        farmerId: farmer.id,
        farmerName: farmer.name,
        cropName,
        variety,
        quantityKg,
        harvestDate,
        expectedPricePerKg,
        qualityGrade,
        moisturePercentage,
        location: `Farm Gate, ${farmer.village}, ${farmer.district}`,
        farmPincode: '422202',
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        ],
      });

      router.push(`/lots/${newLot.id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl shadow-card border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-brand-700">
            <PlusCircle className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Standardized Digital Listing
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Create New Digital Lot
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          List your harvest on the KrishiSetu network for automated AI price matching and verified buyer bids.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-5">
          {/* Crop & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Crop
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
              >
                {MOCK_CROPS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.localName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Variety / Cultivar
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. Abhinav, Garwa, JS-335"
                required
              />
            </div>
          </div>

          {/* Quantity & Harvest Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Quantity (kg)
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={quantityKg}
                onChange={(e) => setQuantityKg(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Harvest Date
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          {/* Quality Grade & Moisture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quality Grade
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
              >
                <option value="Grade A (Export/Premium)">Grade A (Export/Premium - High Color/Uniform)</option>
                <option value="Grade B (Supermarket/Standard)">Grade B (Supermarket/Standard)</option>
                <option value="Grade C (Processing/Bulk)">Grade C (Processing/Bulk Pulp)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Moisture % / Sorting
              </label>
              <input
                type="number"
                min="5"
                max="30"
                value={moisturePercentage}
                onChange={(e) => setMoisturePercentage(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500"
                placeholder="10-14%"
              />
            </div>
          </div>

          {/* Expected Base Price */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Selling Price (₹/kg)
              </label>
              <span className="text-[11px] text-brand-700 font-semibold">
                AI Suggested: ₹24.00/kg (Buyer A)
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                step="0.5"
                min="5"
                max="500"
                value={expectedPricePerKg}
                onChange={(e) => setExpectedPricePerKg(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Lot Description & Pickup Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-brand-500"
              placeholder="Mention crate packing, tractor accessibility, or specific grading parameters..."
            />
          </div>

          {/* Image Upload Showcase */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Harvest Images (Visual Quality Verification)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-2xl p-4 text-center bg-slate-50/50 cursor-pointer transition">
              <Camera className="w-8 h-8 text-brand-600 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-800 block">
                2 Sample Harvest Photos Attached ✓
              </span>
              <span className="text-[11px] text-slate-400">
                Visual grade auto-classified as Grade A (94% confidence)
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Net Realization Calculator & Submission */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-950 via-brand-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-brand-500/30">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-800/60">
              <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Live Net Profit Preview</h3>
                <span className="text-[10px] text-emerald-300">Instant deductions estimate</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Gross Expected Value:</span>
                <span className="font-bold text-white">₹{totalGross.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-rose-300">
                <span>Est. Freight (₹{estTransportPerKg}/kg):</span>
                <span className="font-bold">-₹{totalTransport.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Mandi Brokerage / Cess:</span>
                <span className="font-bold text-emerald-400">₹0.00 (Direct Buyer)</span>
              </div>

              <div className="pt-3 border-t border-emerald-800/80">
                <span className="text-[11px] text-emerald-300 uppercase font-black tracking-wider block">
                  Net Realization Per Kg
                </span>
                <div className="text-3xl font-black text-amber-300 mt-0.5">
                  ₹{estNetPerKg.toFixed(2)}
                  <span className="text-xs font-normal text-slate-300">/kg</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3 text-center mt-2">
                <span className="text-[10px] text-slate-300 block">Total In-Hand Bank Credit:</span>
                <span className="text-xl font-black text-white">₹{totalNet.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-800/60">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-400/20 text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Listing Digital Lot...' : 'Publish Lot on Network'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Smart Contract Protection</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Once published, verified buyers in the Nashik-Pune cluster will be notified instantly. You maintain full control to accept or reject any bid.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
