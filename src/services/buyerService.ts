import { InstitutionalBuyer } from '../types';
import { MOCK_BUYERS } from '../data/mockData';
import { api } from '../lib/api';

export const buyerService = {
  getAllBuyers: async (cropFilter?: string): Promise<InstitutionalBuyer[]> => {
    const data = await api.getBuyers() as any;
    if (data && Array.isArray(data.results || data)) {
      const list = data.results || data;
      if (list.length > 0) {
        let buyers = list.map((b: any) => {
          const firstDemand = b.demands && b.demands.length > 0 ? b.demands[0] : null;
          return {
            id: `buyer_${b.id}`,
            name: b.business_name,
            companyType: b.buyer_type,
            verified: b.verification_status === 'VERIFIED',
            rating: parseFloat(b.rating),
            reviewsCount: b.reviews_count,
            procurementHub: b.procurement_hub,
            distanceKm: parseFloat(b.distance_km_default),
            cropRequired: firstDemand ? firstDemand.crop_details?.name || 'Tomato' : 'Tomato',
            requiredQuantityKg: firstDemand ? parseFloat(firstDemand.required_quantity) : 5000,
            offeredPricePerKg: firstDemand ? parseFloat(firstDemand.offered_price) : 24.0,
            qualityRequirement: firstDemand ? firstDemand.minimum_quality : 'Grade A (Export/Premium)',
            paymentTerms: b.payment_terms,
            paymentReliability: parseFloat(b.payment_reliability_score),
            pickupServiceAvailable: b.pickup_service_available,
            contactPerson: b.contact_person,
            contactPhone: b.contact_phone,
          };
        });

        if (cropFilter && cropFilter !== 'All') {
          buyers = buyers.filter((b: any) =>
            b.cropRequired.toLowerCase().includes(cropFilter.toLowerCase())
          );
        }
        return buyers;
      }
    }

    if (!cropFilter || cropFilter === 'All') {
      return [...MOCK_BUYERS];
    }
    return MOCK_BUYERS.filter((b) =>
      b.cropRequired.toLowerCase().includes(cropFilter.toLowerCase())
    );
  },

  getBuyerById: async (id: string): Promise<InstitutionalBuyer | undefined> => {
    return MOCK_BUYERS.find((b) => b.id === id);
  },

  sendLotToBuyer: async (
    buyerId: string,
    lotId: string,
    offeredPrice: number,
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    const rawBuyerId = parseInt(buyerId.replace('buyer_', '')) || 1;
    const rawLotId = parseInt(lotId.replace('lot_', '')) || 1;

    const res = await api.createOffer({
      lot: rawLotId,
      buyer: rawBuyerId,
      offered_price: offeredPrice,
      quantity: 500.0,
      message: notes || 'Lot proposal from farmer',
    });

    return {
      success: true,
      message: `Lot submitted successfully to buyer! They will review within 2 hours.`,
    };
  },
};
