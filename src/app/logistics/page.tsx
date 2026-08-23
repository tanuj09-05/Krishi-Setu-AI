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
        eyebrow="Agri-Freight Matching"
        eyebrowIcon={Truck}
        title="Logistics & Dispatch Optimization"
        description="Standardized per-km vehicle matching to prevent transport overcharging and reduce post-harvest transit losses."
      />

      {/* Interactive Freight Estimator */}
      <TransportEstimator />

      {/* Standardized Fleet Options */}
      <div>
        <SectionHeader
          icon={Truck}
          title={`Standardized Fleet · ${farmer.district} Region`}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_VEHICLE_OPTIONS.map((veh) => (
            <div
              key={veh.id}
              className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-card hover:border-stone-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="success" size="sm">{veh.availability}</Badge>
                  <span className="text-xs font-semibold text-stone-700">★ {veh.driverRating}</span>
                </div>

                <h3 className="font-semibold text-sm text-stone-900 mb-2">{veh.vehicleType}</h3>

                <div className="space-y-1.5 text-xs mb-3 text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Payload Capacity</span>
                    <strong className="text-stone-800 tabular-nums">
                      {veh.capacityKg.toLocaleString('en-IN')} kg max
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Base Freight Rate</span>
                    <strong className="text-brand-800 tabular-nums">₹{veh.baseRatePerKm}/km</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Loading / Unloading</span>
                    <span className="text-stone-700">₹{veh.loadingUnloadingCost} flat</span>
                  </div>
                </div>
              </div>

              <div className="text-2xs text-stone-400 flex items-center gap-1 pt-2.5 border-t border-stone-100">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                <span>Verified driver · e-Way bill support</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Bookings & Dispatch Status */}
      {logistics.length > 0 && (
        <div>
          <SectionHeader
            icon={Navigation}
            title="Active Dispatches & Bookings"
            count={logistics.length}
          />
          <div className="space-y-3">
            {logistics.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-2xs text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                      {booking.trackingNumber}
                    </span>
                    <Badge variant="success" size="sm" dot>
                      {booking.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm text-stone-900">
                    {booking.cropName} ({booking.quantityKg.toLocaleString('en-IN')} kg) → {booking.destinationName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <strong className="text-stone-700">{booking.pickupAddress}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Slot: <strong className="text-stone-700">{booking.pickupTime}</strong></span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-stone-50 px-3.5 py-2.5 rounded-lg border border-stone-200/60 shrink-0 text-xs">
                  <div>
                    <span className="text-2xs text-stone-400 uppercase font-medium block">Driver</span>
                    <span className="font-semibold text-stone-900 block">{booking.driverName}</span>
                    <span className="text-2xs text-brand-700 flex items-center gap-0.5 mt-0.5">
                      <Phone className="w-2.5 h-2.5" /> {booking.driverPhone}
                    </span>
                  </div>
                  <div className="w-px h-7 bg-stone-200" />
                  <div className="text-right">
                    <span className="text-2xs text-stone-400 uppercase font-medium block">Freight</span>
                    <span className="text-base font-bold text-accent-rose tabular-nums block">₹{booking.totalFreightCost}</span>
                    <span className="text-2xs text-stone-400">₹{booking.costPerKg.toFixed(2)}/kg</span>
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
