'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import {
  Boxes,
  PlusCircle,
  Calendar,
  Camera,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { QualityGrade } from '../../../types';
import { MOCK_CROPS } from '../../../data/mockData';
import { PageHeader } from '../../../components/ui/PageHeader';

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

  // Live net realization calculations
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

  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-gray-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition';

  const labelClass = 'block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Standardized Digital Listing"
        eyebrowIcon={PlusCircle}
        title="Create New Digital Lot"
        description="List your harvest on the KrishiSetu network for AI price matching and verified buyer bids."
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-card space-y-5">
          {/* Crop & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Crop</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className={inputClass}
              >
                {MOCK_CROPS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.localName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Variety / Cultivar</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className={inputClass}
                placeholder="e.g. Abhinav, Garwa, JS-335"
                required
              />
            </div>
          </div>

          {/* Quantity & Harvest Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Total Quantity (kg)</label>
              <input
                type="number"
                min="50"
                step="50"
                value={quantityKg}
                onChange={(e) => setQuantityKg(parseInt(e.target.value) || 0)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Harvest Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className={`${inputClass} pl-9`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Quality Grade & Moisture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Quality Grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                className={inputClass}
              >
                <option value="Grade A (Export/Premium)">Grade A — Export / Premium</option>
                <option value="Grade B (Supermarket/Standard)">Grade B — Supermarket / Standard</option>
                <option value="Grade C (Processing/Bulk)">Grade C — Processing / Bulk</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Moisture % / Sorting</label>
              <input
                type="number"
                min="5"
                max="30"
                value={moisturePercentage}
                onChange={(e) => setMoisturePercentage(parseInt(e.target.value) || 0)}
                className={inputClass}
                placeholder="10–14%"
              />
            </div>
          </div>

          {/* Target Price */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass} style={{ marginBottom: 0 }}>
                Target Selling Price (₹/kg)
              </label>
              <span className="text-[11px] text-brand-700 font-semibold">
                AI Suggested: ₹24.00/kg
              </span>
            </div>
            <div className="relative mt-1.5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-sm pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="0.5"
                min="5"
                max="500"
                value={expectedPricePerKg}
                onChange={(e) => setExpectedPricePerKg(parseFloat(e.target.value) || 0)}
                className={`${inputClass} pl-8 text-base font-bold`}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Lot Description & Pickup Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Mention crate packing, tractor accessibility, or specific grading parameters..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Harvest Images</label>
            <div className="border-2 border-dashed border-stone-200 hover:border-brand-400 rounded-xl p-5 text-center bg-stone-50/50 cursor-pointer transition-colors group">
              <Camera className="w-7 h-7 text-stone-300 group-hover:text-brand-500 mx-auto mb-2 transition-colors" />
              <p className="text-xs font-semibold text-gray-700">2 Sample Photos Attached ✓</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Visual grade auto-classified as Grade A (94% confidence)
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Calculator & Submit */}
        <div className="space-y-4">
          {/* Net Profit Preview */}
          <div className="bg-[#0d1810] text-white rounded-2xl p-5 border border-white/10 shadow-card-md">
            <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-white/8">
              <div className="p-2 rounded-lg bg-brand-700/30 text-brand-400">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Live Net Profit Preview</h3>
                <p className="text-[10px] text-slate-500">Instant deductions estimate</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Gross Expected</span>
                <span className="font-semibold text-white tabular-nums">₹{totalGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-rose-400">Freight (₹{estTransportPerKg}/kg)</span>
                <span className="font-semibold text-rose-400 tabular-nums">−₹{totalTransport.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mandi Brokerage / Cess</span>
                <span className="font-semibold text-brand-400">₹0.00 (Direct)</span>
              </div>

              <div className="pt-3 border-t border-white/8">
                <p className="text-[9px] text-brand-400 font-semibold uppercase tracking-widest mb-1">Net per kg</p>
                <p className="text-3xl font-bold text-amber-300 tabular-nums">
                  ₹{estNetPerKg.toFixed(2)}
                  <span className="text-xs font-normal text-slate-400">/kg</span>
                </p>
              </div>

              <div className="bg-white/8 rounded-lg p-3 text-center">
                <p className="text-[10px] text-slate-400 mb-0.5">Total In-Hand Bank Credit</p>
                <p className="text-xl font-bold text-white tabular-nums">₹{totalNet.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold rounded-xl shadow-sm text-sm transition-colors duration-150 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing Lot…' : 'Publish Lot on Network'}</span>
              </button>
            </div>
          </div>

          {/* Smart contract protection note */}
          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-card">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              <p className="text-xs font-semibold text-gray-900">Smart Contract Protection</p>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Verified buyers in the Nashik-Pune cluster are notified instantly. You maintain full control to accept or reject any bid.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
