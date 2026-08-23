import { FarmerProfile } from '../types';
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
  farmer_profile?: {
    id: number;
    farm_location: string;
    village: string;
    district: string;
    state: string;
    farm_size_acres: number;
    organization_fpo?: string;
    fpo_member_id?: string;
    trust_score: number;
    kyc_verified: boolean;
    bank_account_linked: boolean;
  };
  buyer_profile?: any;
}

export const authService = {
  getFarmerProfile: async (): Promise<FarmerProfile | null> => {
    const data = (await api.getFarmerProfile()) as any;
    if (data && data.user_details) {
      return {
        id: `farmer_${data.id}`,
        name: data.user_details.name,
        phone: data.user_details.phone_number,
        village: data.village || 'Dindori',
        taluka: data.taluka || data.district || 'Dindori',
        district: data.district || 'Nashik',
        state: data.state || 'Maharashtra',
        fpoName: data.organization_fpo || 'Sahyadri Farmers Collective',
        fpoMemberId: data.fpo_member_id || `SF-${data.id}`,
        landHoldingAcres: parseFloat(data.farm_size_acres) || 2.0,
        primaryCrops: ['Tomato', 'Onion', 'Soybean', 'Wheat'],
        bankAccountLinked: data.bank_account_linked ?? true,
        kycVerified: data.verification_status === 'VERIFIED',
        trustScore: data.trust_score || 90,
        totalLotsSold: data.completed_transactions || 0,
        totalEarnings: 0,
        rating: parseFloat(data.rating) || 4.8,
      };
    }
    return null;
  },

  register: async (data: {
    name: string;
    email?: string;
    phone_number?: string;
    password?: string;
    confirm_password?: string;
    location?: string;
    farm_size_acres?: number;
    village?: string;
    district?: string;
    state?: string;
    role?: string;
  }) => {
    const res = await api.register(data) as any;
    if (res && res.access) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('krishisetu_access_token', res.access);
        if (res.refresh) localStorage.setItem('krishisetu_refresh_token', res.refresh);
        if (res.user) localStorage.setItem('krishisetu_current_user', JSON.stringify(res.user));
      }
    }
    return res;
  },

  login: async (credentials: { phone_number?: string; email?: string; password?: string; otp?: string }) => {
    const res = await api.login(credentials) as any;
    if (res && res.access) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('krishisetu_access_token', res.access);
        if (res.refresh) localStorage.setItem('krishisetu_refresh_token', res.refresh);
        if (res.user) localStorage.setItem('krishisetu_current_user', JSON.stringify(res.user));
      }
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

    try {
      const user = await api.getMe() as any;
      if (user && user.id) {
        localStorage.setItem('krishisetu_current_user', JSON.stringify(user));
        return user;
      }
    } catch (e) {
      console.warn('Get me failed:', e);
    }

    const cached = localStorage.getItem('krishisetu_current_user');
    return cached ? JSON.parse(cached) : null;
  },

  updateProfile: async (data: any): Promise<AuthUser | null> => {
    const updated = await api.updateProfile(data) as any;
    if (updated && updated.id) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('krishisetu_current_user', JSON.stringify(updated));
      }
      return updated;
    }
    return null;
  },

  changePassword: async (data: { old_password: string; new_password: string; confirm_new_password?: string }) => {
    return await api.changePassword(data);
  },

  requestPasswordReset: async (email: string) => {
    return await api.passwordReset({ email });
  },

  confirmPasswordReset: async (data: { uidb64: string; token: string; new_password: string; confirm_new_password?: string }) => {
    return await api.passwordResetConfirm(data);
  },

  logout: async () => {
    try {
      await api.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('krishisetu_access_token');
      localStorage.removeItem('krishisetu_refresh_token');
      localStorage.removeItem('krishisetu_current_user');
    }
  },
};
