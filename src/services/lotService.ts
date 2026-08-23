import { DigitalLot, BuyerOffer, QualityGrade } from '../types';
import { MOCK_LOTS } from '../data/mockData';
import { api } from '../lib/api';

let localLotsState = [...MOCK_LOTS];

export const lotService = {
  getAllLots: async (): Promise<DigitalLot[]> => {
    const data = (await api.getLots()) as any;
    if (data && Array.isArray(data.results || data)) {
      const list = data.results || data;
      if (list.length > 0) {
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
            farmerName: l.farmer_name || 'Rameshwar Patil',
            cropName: l.crop_name || l.crop_details?.name || 'Tomato',
            variety: l.variety || 'Standard Hybrid',
            quantityKg: parseFloat(l.quantity),
            harvestDate: l.harvest_date,
            expectedPricePerKg: parseFloat(l.asking_price),
            qualityGrade: (l.quality_grade === 'GRADE_A' ? 'Grade A (Export/Premium)' : l.quality_grade === 'GRADE_B' ? 'Grade B (Supermarket/Standard)' : 'Grade C (Processing/Bulk)') as QualityGrade,
            moisturePercentage: l.moisture_percentage ? parseFloat(l.moisture_percentage) : 12,
            location: l.location || 'Farm Gate, Dindori',
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
    }
    return [...localLotsState];
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
        farmerName: data.farmer_name || 'Rameshwar Patil',
        cropName: data.crop_name || data.crop_details?.name || 'Tomato',
        variety: data.variety || 'Standard Hybrid',
        quantityKg: parseFloat(data.quantity),
        harvestDate: data.harvest_date,
        expectedPricePerKg: parseFloat(data.asking_price),
        qualityGrade: (data.quality_grade === 'GRADE_A' ? 'Grade A (Export/Premium)' : data.quality_grade === 'GRADE_B' ? 'Grade B (Supermarket/Standard)' : 'Grade C (Processing/Bulk)') as QualityGrade,
        moisturePercentage: data.moisture_percentage ? parseFloat(data.moisture_percentage) : 12,
        location: data.location || 'Farm Gate, Dindori',
        farmPincode: data.farm_pincode || '422202',
        images: data.images && data.images.length > 0
          ? data.images.map((img: any) => img.image_url)
          : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
        status: (data.status.toLowerCase() === 'published' ? 'active_listed' : data.status.toLowerCase() === 'offer_received' ? 'offer_received' : data.status.toLowerCase() === 'deal_locked' ? 'deal_locked' : data.status.toLowerCase() === 'sold' ? 'settled' : 'active_listed') as any,
        createdAt: data.created_at ? data.created_at.substring(0, 16).replace('T', ' ') : 'Just now',
        offers: offersList,
        bestOffer: offersList[0],
      };
    }

    return localLotsState.find((l) => l.id === id || l.lotNumber === id || `${l.id}` === `${id}`);
  },

  createLot: async (lotData: Omit<DigitalLot, 'id' | 'lotNumber' | 'createdAt' | 'offers' | 'status'>): Promise<DigitalLot> => {
    const backendRes = (await api.createLot({
      crop_name: lotData.cropName,
      variety: lotData.variety,
      quantity: lotData.quantityKg,
      harvest_date: lotData.harvestDate,
      asking_price: lotData.expectedPricePerKg,
      quality_grade: lotData.qualityGrade.includes('Grade A') ? 'GRADE_A' : lotData.qualityGrade.includes('Grade B') ? 'GRADE_B' : 'GRADE_C',
      location: lotData.location,
      farm_pincode: lotData.farmPincode || '422202',
      moisture_percentage: lotData.moisturePercentage || 12.0,
      description: 'Listed via KrishiSetu AI Web Portal',
    })) as any;

    if (backendRes && backendRes.id) {
      const newLot: DigitalLot = {
        ...lotData,
        id: `${backendRes.id}`,
        lotNumber: backendRes.lot_number,
        createdAt: backendRes.created_at ? backendRes.created_at.substring(0, 16).replace('T', ' ') : 'Just now',
        status: 'active_listed',
        offers: [],
      };
      localLotsState = [newLot, ...localLotsState];
      return newLot;
    }

    // Fallback if offline
    const newLot: DigitalLot = {
      ...lotData,
      id: `lot_${Date.now()}`,
      lotNumber: `LOT-${lotData.cropName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'active_listed',
      offers: [],
    };
    localLotsState = [newLot, ...localLotsState];
    return newLot;
  },

  respondToOffer: async (
    lotId: string,
    offerId: string,
    action: 'accept' | 'reject' | 'counter',
    counterPrice?: number
  ): Promise<{ success: boolean; updatedLot: DigitalLot }> => {
    const rawOfferId = parseInt(offerId.replace('offer_', '')) || 1;
    await api.respondToOffer(rawOfferId, action, counterPrice);

    const lot = await lotService.getLotById(lotId);
    if (!lot) throw new Error('Lot not found');

    if (action === 'accept') {
      lot.status = 'deal_locked';
      lot.offers = lot.offers.map((o) => (o.id === offerId ? { ...o, status: 'accepted' } : o));
    } else if (action === 'reject') {
      lot.offers = lot.offers.map((o) => (o.id === offerId ? { ...o, status: 'rejected' } : o));
    } else if (action === 'counter') {
      lot.offers = lot.offers.map((o) => (o.id === offerId ? { ...o, status: 'countered', counterPricePerKg: counterPrice } : o));
    }

    return { success: true, updatedLot: lot };
  },
};
