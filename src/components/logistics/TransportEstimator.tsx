'use client';

import React, { useState } from 'react';
import { Truck, Calculator, MapPin, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { MOCK_VEHICLE_OPTIONS, MOCK_MANDIS, MOCK_BUYERS } from '../../data/mockData';
import { logisticsService } from '../../services/logisticsService';
import { useApp } from '../../context/AppContext';

export const TransportEstimator: React.FC = () => {
  const { farmer, bookLogistics } = useApp();
  const [selectedDestination, setSelectedDestination] = useState<string>('Reliance Retail Sourcing Hub (Buyer A)');
  const [distanceKm, setDistanceKm] = useState<number>(28);
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Tata Ace (Chhota Hathi)');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const destName = e.target.value;
    setSelectedDestination(destName);

    const buyer = MOCK_BUYERS.find((b) => b.name.includes(destName.split(' ')[0]));
    if (buyer) {
      setDistanceKm(buyer.distanceKm);
      return;
    }
    const mandi = MOCK_MANDIS.find((m) => m.name.includes(destName.split(' ')[0]));
    if (mandi) {
      setDistanceKm(mandi.distanceKm);
    }
  };

  const estimate = logisticsService.estimateTransportCost(distanceKm, quantityKg, selectedVehicle);

  const handleBooking = async () => {
    await bookLogistics({
      lotId: 'lot_tom_01',
      cropName: 'Tomato',
      quantityKg,
      pickupAddress: `Farm Gate, ${farmer.village}, ${farmer.district}`,
      destinationName: selectedDestination,
      destinationAddress: `${selectedDestination} Zone`,
      distanceKm,
      vehicleType: selectedVehicle,
      driverName: 'Santosh Jadhav',
      driverPhone: '+91 98224 88990',
      vehicleNumber: 'MH-15-BH-5501',
      totalFreightCost: estimate.totalCost,
      costPerKg: estimate.costPerKg,
      pickupTime: 'Tomorrow 8:30 AM',
    });
    setIsBooked(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-emerald-100 text-brand-700">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
            Smart Logistics & Freight Cost Estimator
          </h3>
          <p className="text-xs text-slate-500">
            Real-time rural freight matching to keep transport deductions minimal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Destination Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Destination Market / Buyer
          </label>
          <select
            value={selectedDestination}
            onChange={handleDestinationChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500"
          >
            <optgroup label="Direct Institutional Buyers">
              {MOCK_BUYERS.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.distanceKm} km)
                </option>
              ))}
            </optgroup>
            <optgroup label="APMC Mandis">
              {MOCK_MANDIS.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.distanceKm} km)
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Lot Quantity (kg)
          </label>
          <input
            type="number"
            min="100"
            step="100"
            value={quantityKg}
            onChange={(e) => setQuantityKg(parseInt(e.target.value) || 500)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Vehicle Match */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Recommended Vehicle
          </label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500"
          >
            {MOCK_VEHICLE_OPTIONS.map((v) => (
              <option key={v.id} value={v.vehicleType}>
                {v.vehicleType} (Up to {v.capacityKg} kg)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calculated Results Block */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <span className="text-[11px] text-slate-400 block uppercase font-bold">Route Distance</span>
          <span className="text-xl font-black text-white">{distanceKm} km</span>
          <span className="text-[10px] text-slate-400 block">From {farmer.village}</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block uppercase font-bold">Est. Transit Time</span>
          <span className="text-xl font-black text-white">{estimate.transitHours} Hours</span>
          <span className="text-[10px] text-emerald-400 block">Direct Farm Route</span>
        </div>

        <div>
          <span className="text-[11px] text-rose-300 block uppercase font-bold">Total Freight Quote</span>
          <span className="text-xl font-black text-rose-300">₹{estimate.totalCost.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 block">Incl. loading/unloading</span>
        </div>

        <div className="bg-emerald-950/80 rounded-xl p-2.5 border border-emerald-500/30">
          <span className="text-[10px] text-emerald-300 block uppercase font-black">Cost Impact Per Kg</span>
          <span className="text-2xl font-black text-emerald-400">₹{estimate.costPerKg.toFixed(2)}</span>
          <span className="text-[10px] text-slate-300">Deduction from gross</span>
        </div>
      </div>

      {/* Book Transport Action */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Local Agri-Drivers with GPS Tracking</span>
        </div>

        <button
          onClick={handleBooking}
          disabled={isBooked}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition active:scale-95 disabled:bg-slate-300 disabled:text-slate-600"
        >
          <Truck className="w-4 h-4" />
          <span>{isBooked ? 'Transport Booked ✓' : 'Schedule Farm Pickup'}</span>
        </button>
      </div>
    </div>
  );
};
