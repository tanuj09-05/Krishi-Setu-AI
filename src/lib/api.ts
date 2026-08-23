/**
 * KrishiSetu AI - Centralized API Client with JWT Bearer Token Support
 * Defaults to http://localhost:8000/api/v1/
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Automatically attach JWT token if present in browser
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('krishisetu_access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      // If 401 Unauthorized, handle token refresh or warn
      if (res.status === 401 && typeof window !== 'undefined') {
        const refresh = localStorage.getItem('krishisetu_refresh_token');
        if (refresh && !endpoint.includes('/auth/')) {
          try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh }),
            });
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              if (refreshData.access) {
                localStorage.setItem('krishisetu_access_token', refreshData.access);
                // Retry request with new token
                headers['Authorization'] = `Bearer ${refreshData.access}`;
                const retryRes = await fetch(url, {
                  ...options,
                  headers: { ...headers, ...options.headers },
                  cache: 'no-store',
                });
                if (retryRes.ok) return await retryRes.json();
              }
            }
          } catch (e) {
            console.warn('Auto refresh failed:', e);
          }
        }
      }
      
      const errorData = await res.json().catch(() => null);
      if (errorData) {
        throw { status: res.status, data: errorData };
      }
      return null;
    }

    return await res.json();
  } catch (error: any) {
    if (error && error.status) {
      throw error;
    }
    console.warn(`Could not reach Django API at ${url}. Using local fallback.`, error);
    return null;
  }
}

export const api = {
  // Authentication
  register: (data: any) => fetchApi('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => fetchApi('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  refreshToken: (refresh: string) => fetchApi('/auth/refresh/', { method: 'POST', body: JSON.stringify({ refresh }) }),
  getMe: () => fetchApi('/auth/me/'),
  updateProfile: (data: any) => fetchApi('/auth/me/', { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword: (data: any) => fetchApi('/auth/change-password/', { method: 'POST', body: JSON.stringify(data) }),
  passwordReset: (data: any) => fetchApi('/auth/password-reset/', { method: 'POST', body: JSON.stringify(data) }),
  passwordResetConfirm: (data: any) => fetchApi('/auth/password-reset-confirm/', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchApi('/auth/logout/', { method: 'POST' }),

  // Farmer
  getFarmerProfile: () => fetchApi('/farmer/profile/'),
  updateFarmerProfile: (data: any) => fetchApi('/farmer/profile/', { method: 'PUT', body: JSON.stringify(data) }),

  // Crops
  getCrops: () => fetchApi('/crops/'),

  // Markets & Price Intelligence
  getMarkets: () => fetchApi('/markets/'),
  getMarketPrices: (crop?: string) => fetchApi(`/markets/prices/${crop ? `?crop=${crop}` : ''}`),
  getPriceHistory: (crop: string = 'Tomato', marketId?: number, days: number = 30) =>
    fetchApi(`/markets/prices/history/?crop=${crop}${marketId ? `&market_id=${marketId}` : ''}&days=${days}`),
  getPriceTrend: (crop: string = 'Tomato', marketId?: number, days: number = 30) =>
    fetchApi(`/markets/prices/trend/?crop=${crop}${marketId ? `&market_id=${marketId}` : ''}&days=${days}`),
  getPriceForecast: (crop: string = 'Tomato', marketId?: number, daysAhead: number = 7) =>
    fetchApi(`/markets/prices/forecast/?crop=${crop}${marketId ? `&market_id=${marketId}` : ''}&days=${daysAhead}`),
  compareMarkets: (crop: string = 'Tomato', quantityKg: number = 500) =>
    fetchApi(`/markets/compare/?crop=${crop}&quantity_kg=${quantityKg}`),

  // Buyers
  getBuyers: (crop?: string) => fetchApi(`/buyers/${crop ? `?crop=${crop}` : ''}`),
  getBuyerDetail: (id: string | number) => fetchApi(`/buyers/${id}/`),
  sendLotProposal: (buyerId: string | number, data: any) =>
    fetchApi(`/buyers/${buyerId}/send_lot/`, { method: 'POST', body: JSON.stringify(data) }),

  // Digital Lots
  getLots: (params: { status?: string; crop?: string; scope?: string } = {}) => {
    const q = new URLSearchParams(params as any).toString();
    return fetchApi(`/lots/${q ? `?${q}` : ''}`);
  },
  getLotDetail: (id: string | number) => fetchApi(`/lots/${id}/`),
  createLot: (lotData: any) => fetchApi('/lots/', { method: 'POST', body: JSON.stringify(lotData) }),
  createOffer: (offerData: any) => fetchApi('/lots/offers/', { method: 'POST', body: JSON.stringify(offerData) }),
  respondToOffer: (lotId: string | number, offerId: string | number, data: any) =>
    fetchApi(`/lots/${lotId}/offers/${offerId}/respond/`, { method: 'POST', body: JSON.stringify(data) }),

  // AI Decision & Recommendation Engine
  getSaleRecommendation: (crop: string = 'Tomato', quantityKg: number = 500) =>
    fetchApi(`/recommendations/sale-timing/?crop=${crop}&quantity_kg=${quantityKg}`),
  generateRecommendation: (data: any) =>
    fetchApi('/recommendations/sale-timing/', { method: 'POST', body: JSON.stringify(data) }),

  // Logistics & Freight Matching
  getTransportVehicles: () => fetchApi('/logistics/vehicles/'),
  getVehicles: () => fetchApi('/logistics/vehicles/'),
  estimateLogistics: (distanceKm: number, weightKg: number) =>
    fetchApi(`/logistics/estimate/?distance_km=${distanceKm}&weight_kg=${weightKg}`),
  getBookings: () => fetchApi('/logistics/bookings/'),
  getLogistics: () => fetchApi('/logistics/bookings/'),
  createBooking: (bookingData: any) => fetchApi('/logistics/bookings/', { method: 'POST', body: JSON.stringify(bookingData) }),
  bookLogistics: (bookingData: any) => fetchApi('/logistics/bookings/', { method: 'POST', body: JSON.stringify(bookingData) }),

  // Payment & Escrow Settlements
  getTransactions: () => fetchApi('/transactions/'),
  getTransactionDetail: (id: string | number) => fetchApi(`/transactions/${id}/`),
};
