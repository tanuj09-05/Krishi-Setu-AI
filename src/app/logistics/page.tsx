'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { TransportEstimator } from '../../components/logistics/TransportEstimator';
import { MOCK_VEHICLE_OPTIONS } from '../../data/mockData';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';

export default function LogisticsPage() {
  const { logistics, farmer } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Rural Freight & Fleet Matching"
        eyebrowIcon={Truck}
        title="Logistics & Transport"
        description="Transparent per-km vehicle booking to prevent arbitrary transport overcharging."
      />

      {/* Transport Estimator (untouched — has complex form logic) */}
      <TransportEstimator />

      {/* Vehicle Fleet */}
      <div>
        <SectionHeader
          icon={Truck}
          iconAccent="green"
          title={`Standardized Fleet · ${farmer.district} District`}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_VEHICLE_OPTIONS.map((veh) => (
            <div
              key={veh.id}
              className="bg-white rounded-xl p-4 border border-stone-200 shadow-card hover:shadow-card-md transition-shadow flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="success" size="sm">{veh.availability}</Badge>
                <span className="text-xs font-semibold text-amber-600">★ {veh.driverRating}</span>
              </div>

              <h3 className="font-semibold text-sm text-gray-900 mb-3">{veh.vehicleType}</h3>

              <div className="space-y-1.5 text-xs mb-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Payload</span>
                  <strong className="text-gray-800 tabular-nums">
                    {veh.capacityKg.toLocaleString('en-IN')} kg max
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Rate</span>
                  <strong className="text-brand-700 tabular-nums">₹{veh.baseRatePerKm}/km</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Loading/Unloading</span>
                  <span className="text-gray-700">₹{veh.loadingUnloadingCost} flat</span>
                </div>
              </div>

              <div className="text-[10px] text-stone-400 flex items-center gap-1 pt-3 border-t border-stone-100">
                <ShieldCheck className="w-3 h-3 text-brand-600 shrink-0" />
                Verified driver · e-way bill support
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Bookings */}
      {logistics.length > 0 && (
        <div>
          <SectionHeader
            icon={Navigation}
            iconAccent="blue"
            title="Active Bookings & Dispatch Status"
          />
          <div className="space-y-3">
            {logistics.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-4 border border-stone-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                      {booking.trackingNumber}
                    </span>
                    <Badge variant="success" size="sm" dot>
                      {booking.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {booking.cropName} ({booking.quantityKg.toLocaleString('en-IN')} kg) → {booking.destinationName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <strong className="text-gray-700">{booking.pickupAddress}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <strong className="text-gray-700">{booking.pickupTime}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100 shrink-0">
                  <div>
                    <p className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider">Driver</p>
                    <p className="text-xs font-semibold text-gray-900 mt-0.5">{booking.driverName}</p>
                    <p className="text-[10px] text-brand-700 flex items-center gap-0.5 mt-0.5">
                      <Phone className="w-2.5 h-2.5" /> {booking.driverPhone}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-stone-200" />
                  <div className="text-right">
                    <p className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider">Freight</p>
                    <p className="text-base font-bold text-rose-500 tabular-nums mt-0.5">₹{booking.totalFreightCost}</p>
                    <p className="text-[10px] text-stone-400">₹{booking.costPerKg.toFixed(2)}/kg</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
