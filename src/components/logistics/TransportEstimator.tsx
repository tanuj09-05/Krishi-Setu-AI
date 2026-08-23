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
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-stone-200/80">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
        <Truck className="w-4 h-4 text-stone-500" />
        <div>
          <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
            Agri-Logistics Freight Estimator & Dispatch
          </h3>
          <p className="text-xs text-stone-500">
            Transparent per-km vehicle matching to minimize transit deductions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* Destination */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Destination Market / Hub
          </label>
          <select
            value={selectedDestination}
            onChange={handleDestinationChange}
            className="w-full bg-stone-50 border border-stone-200 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
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

        {/* Quantity & Distance */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Quantity (kg)
            </label>
            <input
              type="number"
              step="50"
              min="50"
              value={quantityKg}
              onChange={(e) => setQuantityKg(parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Distance (km)
            </label>
            <input
              type="number"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Carrier Vehicle Type
          </label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
          >
            {MOCK_VEHICLE_OPTIONS.map((v) => (
              <option key={v.id} value={v.vehicleType}>
                {v.vehicleType} (Up to {v.capacityKg} kg)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Calculation Result */}
      <div className="bg-stone-50/80 rounded-lg p-4 border border-stone-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <span className="text-2xs text-stone-400 font-medium uppercase block">Total Freight Quote</span>
            <span className="text-lg font-bold text-accent-rose tabular-nums">₹{estimate.totalCost}</span>
          </div>
          <div className="h-7 w-px bg-stone-200 hidden sm:block" />
          <div>
            <span className="text-2xs text-stone-400 font-medium uppercase block">Freight Rate / kg</span>
            <span className="text-base font-bold text-stone-900 tabular-nums">₹{estimate.costPerKg.toFixed(2)}/kg</span>
          </div>
          <div className="h-7 w-px bg-stone-200 hidden sm:block" />
          <div>
            <span className="text-2xs text-stone-400 font-medium uppercase block">Pickup Address</span>
            <span className="text-xs font-semibold text-stone-800">
              Farm Gate, {farmer.village}, {farmer.district}
            </span>
          </div>
        </div>

        {isBooked ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-md border border-brand-200">
            <CheckCircle className="w-4 h-4" />
            <span>Driver Assigned · Santosh Jadhav</span>
          </div>
        ) : (
          <button
            onClick={handleBooking}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors active:scale-95 shrink-0"
          >
            <span>Book Dispatch Vehicle</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
