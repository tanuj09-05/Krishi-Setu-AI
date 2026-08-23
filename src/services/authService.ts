import { FarmerProfile } from '../types';
import { MOCK_FARMER } from '../data/mockData';
import { api } from '../lib/api';

export interface AuthUser {
  id: number;
  phone_number: string;
  name: string;
  email: string;
  role: 'FARMER' | 'BUYER' | 'FPO' | 'ADMIN';
  role_display?: string;
  preferred_language?: string;
  location?: string;
  farmer_profile?: any;
  buyer_profile?: any;
}

export const authService = {
  getFarmerProfile: async (): Promise<FarmerProfile> => {
    const data = (await api.getFarmerProfile()) as any;
    if (data && data.user_details) {
      return {
        id: `farmer_${data.id}`,
        name: data.user_details.name,
        phone: data.user_details.phone_number,
        village: data.village || 'Dindori',
        taluka: data.taluka || 'Dindori',
        district: data.district || 'Nashik',
        state: data.state || 'Maharashtra',
        fpoName: data.organization_fpo || 'Sahyadri Farmers Producer Co. Ltd.',
        fpoMemberId: data.fpo_member_id || 'SF-2024-8842',
        landHoldingAcres: parseFloat(data.farm_size_acres) || 4.5,
        primaryCrops: ['Tomato', 'Onion', 'Soybean', 'Grapes'],
        bankAccountLinked: data.bank_account_linked ?? true,
        kycVerified: data.verification_status === 'VERIFIED',
        trustScore: data.trust_score || 94,
        totalLotsSold: data.completed_transactions || 18,
        totalEarnings: 342500,
        rating: parseFloat(data.rating) || 4.9,
      };
    }
    return MOCK_FARMER;
  },

  login: async (credentials: { phone_number?: string; email?: string; password?: string; otp?: string }) => {
    const res = await api.login(credentials) as any;
    if (res && res.access) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('krishisetu_access_token', res.access);
        if (res.refresh) localStorage.setItem('krishisetu_refresh_token', res.refresh);
        if (res.user) localStorage.setItem('krishisetu_current_user', JSON.stringify(res.user));
      }
      return res;
    }
    return res;
  },

  loginAsDemoUser: async (role: 'FARMER' | 'BUYER' | 'FPO' | 'ADMIN') => {
    let email = 'farmer@demo.krishisetu';
    let phone = '9823012345';

    if (role === 'BUYER') {
      email = 'buyer@demo.krishisetu';
      phone = '9823098765';
    } else if (role === 'FPO') {
      email = 'fpo@demo.krishisetu';
      phone = '9823055555';
    } else if (role === 'ADMIN') {
      email = 'admin@demo.krishisetu';
      phone = '9823000000';
    }

    return await authService.login({
      email,
      phone_number: phone,
      password: 'Demo@123',
    });
  },

  getCurrentUser: async (): Promise<AuthUser | null> => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('krishisetu_access_token');
    if (!token) return null;

    const user = await api.getMe() as any;
    if (user && user.id) {
      localStorage.setItem('krishisetu_current_user', JSON.stringify(user));
      return user;
    }

    const cached = localStorage.getItem('krishisetu_current_user');
    return cached ? JSON.parse(cached) : null;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('krishisetu_access_token');
      localStorage.removeItem('krishisetu_refresh_token');
      localStorage.removeItem('krishisetu_current_user');
    }
  },

  register: async (data: any) => {
    const res = await api.register(data) as any;
    if (res && res.access && typeof window !== 'undefined') {
      localStorage.setItem('krishisetu_access_token', res.access);
      if (res.refresh) localStorage.setItem('krishisetu_refresh_token', res.refresh);
      if (res.user) localStorage.setItem('krishisetu_current_user', JSON.stringify(res.user));
    }
    return res;
  },
};
