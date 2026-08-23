'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import {
  Boxes,
  Plus,
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
    'Uniform sized red tomatoes, harvested fresh. Graded into standard 20kg crates.'
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
    'w-full px-3 py-2 bg-white border border-stone-200 rounded-md text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700 transition';

  const labelClass = 'block text-xs font-semibold text-stone-700 mb-1';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Listing Engine"
        eyebrowIcon={Plus}
        title="Create Digital Produce Lot"
        description="List your crop harvest to receive competitive bids and AI-matched institutional contracts."
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-stone-200/80 shadow-card space-y-4">
          {/* Crop & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Crop Type</label>
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
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className={inputClass}
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

          {/* Target Selling Price */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass} style={{ marginBottom: 0 }}>
                Target Price (₹/kg)
              </label>
              <span className="text-2xs text-brand-700 font-semibold">
                AI Suggested: ₹24.00/kg
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-xs pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="0.5"
                min="5"
                max="500"
                value={expectedPricePerKg}
                onChange={(e) => setExpectedPricePerKg(parseFloat(e.target.value) || 0)}
                className={`${inputClass} pl-7 text-sm font-bold`}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Lot Description & Handling Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Mention crate packing, vehicle accessibility, or grading notes..."
            />
          </div>

          {/* Photos */}
          <div>
            <label className={labelClass}>Harvest Photos</label>
            <div className="border border-dashed border-stone-200 hover:border-stone-400 rounded-lg p-4 text-center bg-stone-50/50 cursor-pointer transition-colors">
              <Camera className="w-5 h-5 text-stone-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-stone-700">Sample Photos Attached (2 Photos)</p>
              <p className="text-2xs text-stone-400 mt-0.5">
                AI Quality Analysis: Grade A verified
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Net Profit Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Calculator className="w-4 h-4 text-stone-500" />
              <h3 className="font-semibold text-xs sm:text-sm text-stone-900">Live Profit Calculation</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Gross Expected:</span>
                <span className="font-semibold text-stone-900 tabular-nums">₹{totalGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-accent-rose">
                <span>Est. Freight (₹{estTransportPerKg}/kg):</span>
                <span className="font-semibold tabular-nums">−₹{totalTransport.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Mandi Cess / Brokerage:</span>
                <span className="font-semibold text-brand-700">₹0.00 (Direct)</span>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <span className="text-2xs text-stone-400 uppercase tracking-wider font-semibold block mb-0.5">
                  Est. Net Take-Home
                </span>
                <div className="text-2xl font-bold text-brand-800 tabular-nums">
                  ₹{estNetPerKg.toFixed(2)}
                  <span className="text-xs font-normal text-stone-500">/kg</span>
                </div>
              </div>

              <div className="bg-stone-50 rounded-lg p-3 border border-stone-200/60 text-center">
                <span className="text-2xs text-stone-500 block mb-0.5">Total In-Hand Bank Settlement</span>
                <span className="text-lg font-bold text-stone-900 tabular-nums">₹{totalNet.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-md shadow-subtle text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Lot on Network'}</span>
            </button>
          </div>

          <div className="bg-stone-50 rounded-lg p-3.5 border border-stone-200/60 text-xs text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-800">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span>Escrow Protected Listing</span>
            </div>
            <p className="text-2xs leading-relaxed text-stone-500">
              Verified buyers in the Nashik-Pune cluster will be notified instantly. You maintain full authority to accept or reject bids.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
