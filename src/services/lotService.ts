import { DigitalLot, BuyerOffer, QualityGrade } from '../types';
import { api } from '../lib/api';

export const lotService = {
  getAllLots: async (): Promise<DigitalLot[]> => {
    const data = (await api.getLots({ scope: 'mine' })) as any;
    if (data && Array.isArray(data.results || data)) {
      const list = data.results || data;
      return list.map((l: any) => {
        const offersList: BuyerOffer[] = (l.offers || []).map((o: any) => ({
          id: `offer_${o.id}`,
          buyerId: `buyer_${o.buyer}`,
          buyerName: o.buyer_name || (o.buyer_details?.business_name) || 'Verified Institutional Buyer',
          buyerType: o.buyer_details?.buyer_type || 'Corporate Retailer',
          buyerRating: parseFloat(o.buyer_rating || '4.9'),
          offeredPricePerKg: parseFloat(o.offered_price),
          quantityKg: parseFloat(o.quantity),
          totalOfferAmount: parseFloat(o.total_offer_amount || (parseFloat(o.offered_price) * parseFloat(o.quantity))),
          estimatedTransportPerKg: parseFloat(o.estimated_transport_per_kg || '1.50'),
          estimatedNetRealizationPerKg: parseFloat(o.estimated_net_realization_per_kg || (parseFloat(o.offered_price) - 1.50)),
          paymentTerms: o.payment_terms || 'Instant Digital (T+0)',
          pickupOffered: o.pickup_offered ?? true,
          validUntil: 'Tomorrow, 6:00 PM',
          status: o.status.toLowerCase() as any,
          counterPricePerKg: o.counter_price ? parseFloat(o.counter_price) : undefined,
          notes: o.message || 'Ready for gate pickup',
        }));

        const bestOffer = offersList.length > 0 ? offersList[0] : undefined;

        return {
          id: `${l.id}`,
          lotNumber: l.lot_number,
          farmerId: `farmer_${l.farmer}`,
          farmerName: l.farmer_name || 'Farmer',
          cropName: l.crop_name || l.crop_details?.name || 'Tomato',
          variety: l.variety || 'Standard Hybrid',
          quantityKg: parseFloat(l.quantity),
          harvestDate: l.harvest_date,
          expectedPricePerKg: parseFloat(l.asking_price),
          qualityGrade: (l.quality_grade === 'GRADE_A' ? 'Grade A (Export/Premium)' : l.quality_grade === 'GRADE_B' ? 'Grade B (Supermarket/Standard)' : 'Grade C (Processing/Bulk)') as QualityGrade,
          moisturePercentage: l.moisture_percentage ? parseFloat(l.moisture_percentage) : 12,
          location: l.location || 'Farm Gate',
          farmPincode: l.farm_pincode || '422202',
          images: l.images && l.images.length > 0
            ? l.images.map((img: any) => img.image_url)
            : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
          status: (l.status.toLowerCase() === 'published' ? 'active_listed' : l.status.toLowerCase() === 'offer_received' ? 'offer_received' : l.status.toLowerCase() === 'deal_locked' ? 'deal_locked' : l.status.toLowerCase() === 'sold' ? 'settled' : 'active_listed') as any,
          createdAt: l.created_at ? l.created_at.substring(0, 16).replace('T', ' ') : 'Just now',
          offers: offersList,
          bestOffer,
        };
      });
    }
    return [];
  },

  getLotById: async (id: string): Promise<DigitalLot | undefined> => {
    const rawId = id.replace('lot_', '');
    const data = (await api.getLotDetail(rawId)) as any;
    if (data && data.id) {
      const offersList: BuyerOffer[] = (data.offers || []).map((o: any) => ({
        id: `offer_${o.id}`,
        buyerId: `buyer_${o.buyer}`,
        buyerName: o.buyer_name || (o.buyer_details?.business_name) || 'Verified Institutional Buyer',
        buyerType: o.buyer_details?.buyer_type || 'Corporate Retailer',
        buyerRating: parseFloat(o.buyer_rating || '4.9'),
        offeredPricePerKg: parseFloat(o.offered_price),
        quantityKg: parseFloat(o.quantity),
        totalOfferAmount: parseFloat(o.total_offer_amount || (parseFloat(o.offered_price) * parseFloat(o.quantity))),
        estimatedTransportPerKg: parseFloat(o.estimated_transport_per_kg || '1.50'),
        estimatedNetRealizationPerKg: parseFloat(o.estimated_net_realization_per_kg || (parseFloat(o.offered_price) - 1.50)),
        paymentTerms: o.payment_terms || 'Instant Digital (T+0)',
        pickupOffered: o.pickup_offered ?? true,
        validUntil: 'Tomorrow, 6:00 PM',
        status: o.status.toLowerCase() as any,
        counterPricePerKg: o.counter_price ? parseFloat(o.counter_price) : undefined,
        notes: o.message || 'Ready for gate pickup',
      }));

      return {
        id: `${data.id}`,
        lotNumber: data.lot_number,
        farmerId: `farmer_${data.farmer}`,
        farmerName: data.farmer_name || 'Farmer',
        cropName: data.crop_name || data.crop_details?.name || 'Tomato',
        variety: data.variety || 'Standard Hybrid',
        quantityKg: parseFloat(data.quantity),
        harvestDate: data.harvest_date,
        expectedPricePerKg: parseFloat(data.asking_price),
        qualityGrade: (data.quality_grade === 'GRADE_A' ? 'Grade A (Export/Premium)' : data.quality_grade === 'GRADE_B' ? 'Grade B (Supermarket/Standard)' : 'Grade C (Processing/Bulk)') as QualityGrade,
        moisturePercentage: data.moisture_percentage ? parseFloat(data.moisture_percentage) : 12,
        location: data.location || 'Farm Gate',
        farmPincode: data.farm_pincode || '422202',
        images: data.images && data.images.length > 0
          ? data.images.map((img: any) => img.image_url)
          : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
        status: (data.status.toLowerCase() === 'published' ? 'active_listed' : data.status.toLowerCase() === 'offer_received' ? 'offer_received' : data.status.toLowerCase() === 'deal_locked' ? 'deal_locked' : data.status.toLowerCase() === 'sold' ? 'settled' : 'active_listed') as any,
        createdAt: data.created_at ? data.created_at.substring(0, 16).replace('T', ' ') : 'Just now',
        offers: offersList,
        bestOffer: offersList.length > 0 ? offersList[0] : undefined,
      };
    }
    return undefined;
  },

  createLot: async (lotData: Partial<DigitalLot>): Promise<DigitalLot> => {
    const payload = {
      crop_name: lotData.cropName,
      variety: lotData.variety || 'Standard Hybrid',
      quantity: lotData.quantityKg,
      asking_price: lotData.expectedPricePerKg,
      quality_grade: lotData.qualityGrade === 'Grade B (Supermarket/Standard)' ? 'GRADE_B' : lotData.qualityGrade === 'Grade C (Processing/Bulk)' ? 'GRADE_C' : 'GRADE_A',
      harvest_date: lotData.harvestDate || new Date().toISOString().split('T')[0],
      location: lotData.location || 'Farm Gate',
      farm_pincode: lotData.farmPincode || '422202',
      moisture_percentage: lotData.moisturePercentage || 12,
      status: 'PUBLISHED',
    };

    const res = (await api.createLot(payload)) as any;
    if (res && res.id) {
      return {
        id: `${res.id}`,
        lotNumber: res.lot_number,
        farmerId: `farmer_${res.farmer}`,
        farmerName: res.farmer_name || 'Farmer',
        cropName: res.crop_name || lotData.cropName || 'Tomato',
        variety: res.variety || lotData.variety || 'Standard Hybrid',
        quantityKg: parseFloat(res.quantity),
        harvestDate: res.harvest_date,
        expectedPricePerKg: parseFloat(res.asking_price),
        qualityGrade: lotData.qualityGrade || 'Grade A (Export/Premium)',
        moisturePercentage: res.moisture_percentage ? parseFloat(res.moisture_percentage) : 12,
        location: res.location || lotData.location || 'Farm Gate',
        farmPincode: res.farm_pincode || '422202',
        images: lotData.images || ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
        status: 'active_listed',
        createdAt: 'Just now',
        offers: [],
      };
    }

    // Local fallback
    const newLot: DigitalLot = {
      id: `lot_${Date.now()}`,
      lotNumber: `LOT-${(lotData.cropName?.substring(0, 3) || 'CRP').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: lotData.farmerId || 'farmer_01',
      farmerName: lotData.farmerName || 'Farmer',
      cropName: lotData.cropName || 'Tomato',
      variety: lotData.variety || 'Standard Hybrid',
      quantityKg: lotData.quantityKg || 500,
      harvestDate: lotData.harvestDate || new Date().toISOString().split('T')[0],
      expectedPricePerKg: lotData.expectedPricePerKg || 22.0,
      qualityGrade: lotData.qualityGrade || 'Grade A (Export/Premium)',
      moisturePercentage: lotData.moisturePercentage || 12,
      location: lotData.location || 'Farm Gate',
      farmPincode: lotData.farmPincode || '422202',
      images: lotData.images || ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
      status: 'active_listed',
      createdAt: 'Just now',
      offers: [],
    };
    return newLot;
  },

  respondToOffer: async (
    lotId: string,
    offerId: string,
    action: 'accept' | 'reject' | 'counter',
    counterPrice?: number
  ) => {
    const rawLotId = lotId.replace('lot_', '');
    const rawOfferId = offerId.replace('offer_', '');
    await api.respondToOffer(rawLotId, rawOfferId, { action, counter_price: counterPrice });

    const updatedLot = await lotService.getLotById(lotId);
    return {
      updatedLot: updatedLot || {
        id: lotId,
        lotNumber: 'LOT-UPDATED',
        farmerId: 'farmer_01',
        farmerName: 'Farmer',
        cropName: 'Tomato',
        variety: 'Standard Hybrid',
        quantityKg: 500,
        harvestDate: '2026-08-20',
        expectedPricePerKg: 24,
        qualityGrade: 'Grade A (Export/Premium)' as QualityGrade,
        location: 'Farm Gate',
        farmPincode: '422202',
        images: [],
        status: action === 'accept' ? 'deal_locked' : 'active_listed',
        createdAt: 'Today',
        offers: [],
      },
    };
  },
};
