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
      console.warn(`API request to ${url} failed with status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    // Graceful offline fallback
    console.warn(`Could not reach Django API at ${url}. Using local fallback.`, error);
    return null;
  }
}

export const api = {
  // Auth
  register: (data: any) => fetchApi('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => fetchApi('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  refreshToken: (refresh: string) => fetchApi('/auth/refresh/', { method: 'POST', body: JSON.stringify({ refresh }) }),
  getMe: () => fetchApi('/auth/me/'),

  // Farmer
  getFarmerProfile: () => fetchApi('/farmer/profile/'),

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
  getBuyers: () => fetchApi('/buyers/'),
  getBuyerDemand: (crop?: string) => fetchApi(`/buyers/demand/${crop ? `?crop=${crop}` : ''}`),

  // Lots
  getLots: (scope?: string) => fetchApi(`/lots/${scope ? `?scope=${scope}` : ''}`),
  createLot: (data: any) => fetchApi('/lots/', { method: 'POST', body: JSON.stringify(data) }),
  getLotDetail: (id: string | number) => fetchApi(`/lots/${id}/`),
  createOffer: (data: any) => fetchApi('/lots/offers/', { method: 'POST', body: JSON.stringify(data) }),
  respondToOffer: (offerId: number, action: 'accept' | 'reject' | 'counter', counterPrice?: number) =>
    fetchApi(`/lots/offers/${offerId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ action, counter_price: counterPrice }),
    }),

  // AI Recommendation
  generateRecommendation: (data: any) =>
    fetchApi('/recommendations/', { method: 'POST', body: JSON.stringify(data) }),
  getLatestRecommendation: () => fetchApi('/recommendations/latest/'),

  // Logistics
  getLogistics: () => fetchApi('/logistics/'),
  getVehicles: () => fetchApi('/logistics/vehicles/'),
  bookLogistics: (data: any) => fetchApi('/logistics/', { method: 'POST', body: JSON.stringify(data) }),

  // Transactions
  getTransactions: () => fetchApi('/transactions/'),
  getTransactionDetail: (id: string | number) => fetchApi(`/transactions/${id}/`),
};
