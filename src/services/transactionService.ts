import { PaymentTransaction } from '../types';
import { MOCK_TRANSACTIONS } from '../data/mockData';
import { api } from '../lib/api';

export const transactionService = {
  getAllTransactions: async (): Promise<PaymentTransaction[]> => {
    const data = (await api.getTransactions()) as any;
    if (data && Array.isArray(data.results || data)) {
      const list = data.results || data;
      if (list.length > 0) {
        return list.map((t: any) => {
          const gross = parseFloat(t.gross_amount);
          const transport = parseFloat(t.transport_cost);
          const storage = parseFloat(t.storage_cost);
          const other = parseFloat(t.other_cost);
          const net = parseFloat(t.net_realization);
          const qty = parseFloat(t.quantity);
          const price = parseFloat(t.agreed_price);

          return {
            id: `txn_${t.id}`,
            lotId: t.lot ? `${t.lot}` : '1',
            lotNumber: t.lot_number || `LOT-TOM-8921`,
            buyerName: t.buyer_name || 'Reliance Retail Sourcing Hub (Buyer A)',
            farmerName: t.farmer_name || 'Rameshwar Patil',
            cropName: t.crop_name || 'Tomato',
            quantityKg: qty,
            agreedPricePerKg: price,
            grossAmount: gross,
            logisticsCost: transport,
            mandiFeesOrPlatformDeduction: other,
            qualityDeduction: storage,
            netRealizationAmount: net,
            netRealizationPerKg: qty > 0 ? Math.round((net / qty) * 100) / 100 : price,
            paymentMode: 'Direct Bank Transfer (IMPS/NEFT)' as const,
            paymentStatus: t.payment_status === 'COMPLETED' ? 'completed' : t.payment_status === 'RELEASED_TO_BANK' ? 'released_to_bank' : 'in_escrow',
            createdAt: t.created_at ? t.created_at.substring(0, 16).replace('T', ' ') : 'Today, 10:45 AM',
            settledAt: t.completed_at ? t.completed_at.substring(0, 16).replace('T', ' ') : undefined,
            utrNumber: t.utr_number || 'SBIN9821448921',
            timeline: (t.timeline || []).map((tl: any) => ({
              step: tl.step,
              date: tl.date,
              completed: tl.completed,
              description: tl.description,
            })),
          };
        });
      }
    }
    return MOCK_TRANSACTIONS;
  },

  getTransactionById: async (id: string): Promise<PaymentTransaction | undefined> => {
    const rawId = parseInt(id.replace('txn_', '')) || 1;
    const t = (await api.getTransactionDetail(rawId)) as any;
    if (t && t.id) {
      const gross = parseFloat(t.gross_amount);
      const transport = parseFloat(t.transport_cost);
      const storage = parseFloat(t.storage_cost);
      const other = parseFloat(t.other_cost);
      const net = parseFloat(t.net_realization);
      const qty = parseFloat(t.quantity);
      const price = parseFloat(t.agreed_price);

      return {
        id: `txn_${t.id}`,
        lotId: t.lot ? `${t.lot}` : '1',
        lotNumber: t.lot_number || `LOT-TOM-8921`,
        buyerName: t.buyer_name || 'Reliance Retail Sourcing Hub (Buyer A)',
        farmerName: t.farmer_name || 'Rameshwar Patil',
        cropName: t.crop_name || 'Tomato',
        quantityKg: qty,
        agreedPricePerKg: price,
        grossAmount: gross,
        logisticsCost: transport,
        mandiFeesOrPlatformDeduction: other,
        qualityDeduction: storage,
        netRealizationAmount: net,
        netRealizationPerKg: qty > 0 ? Math.round((net / qty) * 100) / 100 : price,
        paymentMode: 'Direct Bank Transfer (IMPS/NEFT)' as const,
        paymentStatus: t.payment_status === 'COMPLETED' ? 'completed' : t.payment_status === 'RELEASED_TO_BANK' ? 'released_to_bank' : 'in_escrow',
        createdAt: t.created_at ? t.created_at.substring(0, 16).replace('T', ' ') : 'Today, 10:45 AM',
        settledAt: t.completed_at ? t.completed_at.substring(0, 16).replace('T', ' ') : undefined,
        utrNumber: t.utr_number || 'SBIN9821448921',
        timeline: (t.timeline || []).map((tl: any) => ({
          step: tl.step,
          date: tl.date,
          completed: tl.completed,
          description: tl.description,
        })),
      };
    }
    return MOCK_TRANSACTIONS.find((tx) => tx.id === id);
  },
};
