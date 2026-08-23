import { LogisticsBooking, TransportVehicleOption } from '../types';
import { MOCK_LOGISTICS, MOCK_VEHICLE_OPTIONS } from '../data/mockData';
import { api } from '../lib/api';

export const logisticsService = {
  estimateTransportCost: (distanceKm: number, quantityKg: number = 500, vehicleType: string = 'Tata Ace (Chhota Hathi)') => {
    let ratePerKm = 14;
    let loadingCost = 350;
    if (vehicleType.includes('Bolero')) {
      ratePerKm = 18;
      loadingCost = 500;
    } else if (vehicleType.includes('Eicher')) {
      ratePerKm = 26;
      loadingCost = 900;
    }
    const distanceCost = Math.round(distanceKm * ratePerKm);
    const totalCost = distanceCost + loadingCost;
    const costPerKg = Math.round((totalCost / quantityKg) * 100) / 100;
    const transitHours = Math.max(1.0, Math.round((distanceKm / 35) * 10) / 10);
    return {
      baseRatePerKm: ratePerKm,
      distanceCost,
      loadingCost,
      totalCost,
      costPerKg,
      transitHours,
    };
  },

  getVehicleOptions: async (quantityKg: number = 500, distanceKm: number = 28): Promise<TransportVehicleOption[]> => {
    const data = (await api.getVehicles()) as any;
    if (data && Array.isArray(data.results || data)) {
      const list = data.results || data;
      if (list.length > 0) {
        return list.map((v: any) => {
          const ratePerKm = parseFloat(v.base_rate_per_km);
          const loadingCost = parseFloat(v.loading_unloading_cost);
          const estimatedCost = Math.round((distanceKm * ratePerKm) + loadingCost);
          const costPerKg = Math.round((estimatedCost / quantityKg) * 100) / 100;

          return {
            id: `veh_${v.id}`,
            vehicleType: v.vehicle_type,
            capacityKg: v.capacity_kg,
            baseRatePerKm: ratePerKm,
            loadingUnloadingCost: loadingCost,
            estimatedTransitHours: 3.5,
            driverRating: parseFloat(v.driver_rating),
            availability: (v.availability.includes('Immediately') ? 'Available Immediately' : v.availability.includes('2h') ? 'Available in 2h' : 'Scheduled Tomorrow') as any,
          };
        });
      }
    }
    return MOCK_VEHICLE_OPTIONS;
  },

  getAllBookings: async (): Promise<LogisticsBooking[]> => {
    const data = (await api.getLogistics()) as any;
    if (data && Array.isArray(data.results || data)) {
      const list = data.results || data;
      if (list.length > 0) {
        return list.map((b: any) => ({
          id: `log_${b.id}`,
          lotId: b.lot ? `${b.lot}` : '1',
          cropName: 'Tomato',
          quantityKg: parseFloat(b.quantity_kg) || 500,
          pickupAddress: b.pickup_location,
          destinationName: b.destination,
          destinationAddress: b.destination,
          distanceKm: parseFloat(b.distance_km),
          vehicleType: b.vehicle_type,
          driverName: b.driver_name,
          driverPhone: b.driver_phone,
          vehicleNumber: b.vehicle_number,
          totalFreightCost: parseFloat(b.estimated_transport_cost),
          costPerKg: parseFloat(b.cost_per_kg),
          pickupTime: 'Tomorrow, 9:00 AM',
          status: b.status.toLowerCase() === 'driver_assigned' ? 'driver_assigned' : b.status.toLowerCase() === 'in_transit' ? 'in_transit' : b.status.toLowerCase() === 'delivered' ? 'delivered_at_destination' : 'requested',
          trackingNumber: b.tracking_number,
        }));
      }
    }
    return MOCK_LOGISTICS;
  },

  bookLogistics: async (bookingData: {
    lotId: string;
    pickupLocation: string;
    destination: string;
    distanceKm: number;
    quantityKg: number;
    vehicleType: string;
  }): Promise<LogisticsBooking> => {
    const rawLotId = parseInt(bookingData.lotId.replace('lot_', '')) || 1;
    const res = (await api.bookLogistics({
      lot: rawLotId,
      pickup_location: bookingData.pickupLocation,
      destination: bookingData.destination,
      distance_km: bookingData.distanceKm,
      quantity_kg: bookingData.quantityKg,
      vehicle_type: bookingData.vehicleType,
    })) as any;

    if (res && res.id) {
      return {
        id: `log_${res.id}`,
        lotId: bookingData.lotId,
        cropName: 'Tomato',
        quantityKg: bookingData.quantityKg,
        pickupAddress: res.pickup_location,
        destinationName: res.destination,
        destinationAddress: res.destination,
        distanceKm: parseFloat(res.distance_km),
        vehicleType: res.vehicle_type,
        driverName: res.driver_name,
        driverPhone: res.driver_phone,
        vehicleNumber: res.vehicle_number,
        totalFreightCost: parseFloat(res.estimated_transport_cost),
        costPerKg: parseFloat(res.cost_per_kg),
        pickupTime: 'Tomorrow, 9:00 AM',
        status: 'driver_assigned',
        trackingNumber: res.tracking_number,
      };
    }

    return MOCK_LOGISTICS[0];
  },
  createBooking: async (bookingData: any): Promise<LogisticsBooking> => {
    return logisticsService.bookLogistics(bookingData);
  },
};
