'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Navigation,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { TransportEstimator } from '../../components/logistics/TransportEstimator';
import { MOCK_VEHICLE_OPTIONS } from '../../data/mockData';

export default function LogisticsPage() {
  const { logistics, farmer } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-card border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-brand-700">
              <Truck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rural Freight & Fleet Matching
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Logistics & Transport Optimization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent per-km vehicle booking to prevent arbitrary transport overcharging.
          </p>
        </div>
      </div>

      {/* 1. Interactive Transport Freight Estimator & Booking */}
      <TransportEstimator />

      {/* 2. Available Vehicle Fleet Options */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-brand-600" />
          <span>Standardized Agri-Logistics Fleet in {farmer.district}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_VEHICLE_OPTIONS.map((veh) => (
            <div
              key={veh.id}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-200">
                    {veh.availability}
                  </span>
                  <span className="text-xs font-bold text-amber-600">★ {veh.driverRating}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{veh.vehicleType}</h3>

                <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 text-xs my-4 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Payload Capacity:</span>
                    <strong className="text-slate-900">Up to {veh.capacityKg.toLocaleString('en-IN')} kg</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Base Freight Rate:</span>
                    <strong className="text-brand-700">₹{veh.baseRatePerKm}/km</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Loading / Unloading:</span>
                    <span className="text-slate-700">₹{veh.loadingUnloadingCost} flat</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified driver with digital e-way bill support</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Active Logistics Bookings & GPS Status */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-brand-600" />
          <span>Active Bookings & Dispatch Status</span>
        </h2>

        <div className="space-y-4">
          {logistics.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {booking.trackingNumber}
                  </span>
                  <span className="bg-emerald-100 text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {booking.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-2">
                  {booking.cropName} ({booking.quantityKg} kg) → {booking.destinationName}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Pickup: <strong>{booking.pickupAddress}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Pickup Slot: <strong>{booking.pickupTime}</strong>
                  </span>
                </div>
              </div>

              {/* Driver & Freight Pill */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Driver Assigned</span>
                  <span className="text-sm font-bold text-slate-900 block">{booking.driverName}</span>
                  <span className="text-xs text-brand-700 font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {booking.driverPhone}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Freight</span>
                  <span className="text-base font-black text-rose-600">₹{booking.totalFreightCost}</span>
                  <span className="text-[10px] text-slate-500 block">(₹{booking.costPerKg.toFixed(2)}/kg)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
