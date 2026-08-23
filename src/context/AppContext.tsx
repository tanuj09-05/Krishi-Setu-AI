'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  FarmerProfile,
  DigitalLot,
  BuyerOffer,
  LogisticsBooking,
  PaymentTransaction,
  AISaleRecommendation,
} from '../types';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService';
import { lotService } from '../services/lotService';
import { logisticsService } from '../services/logisticsService';
import { transactionService } from '../services/transactionService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: string;
  setLanguage: (lang: string) => void;
  farmer: FarmerProfile;
  lots: DigitalLot[];
  logistics: LogisticsBooking[];
  transactions: PaymentTransaction[];
  toasts: ToastMessage[];
  isLoading: boolean;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  createLot: (lotData: any) => Promise<DigitalLot>;
  respondToOffer: (lotId: string, offerId: string, action: 'accept' | 'reject' | 'counter', counterPrice?: number) => Promise<void>;
  bookLogistics: (bookingData: any) => Promise<LogisticsBooking>;
  refreshAllData: () => Promise<void>;
  selectedCropForAnalysis: string;
  setSelectedCropForAnalysis: (crop: string) => void;
  selectedQuantityKg: number;
  setSelectedQuantityKg: (qty: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentRole } = useAuth();
  const [role, setRole] = useState<UserRole>('farmer');
  const [language, setLanguageState] = useState<string>('English');

  const defaultFarmer: FarmerProfile = {
    id: currentUser ? `farmer_${currentUser.id}` : 'farmer_new',
    name: currentUser?.name || 'Farmer',
    phone: currentUser?.phone_number || '',
    village: currentUser?.farmer_profile?.village || (currentUser?.location?.split(',')[0]?.trim() || ''),
    taluka: currentUser?.farmer_profile?.village || (currentUser?.location?.split(',')[0]?.trim() || ''),
    district: currentUser?.farmer_profile?.district || (currentUser?.location?.split(',')[1]?.trim() || 'Nashik'),
    state: currentUser?.farmer_profile?.state || 'Maharashtra',
    fpoName: currentUser?.farmer_profile?.organization_fpo || 'Sahyadri Farmers Collective',
    fpoMemberId: currentUser?.farmer_profile?.fpo_member_id || `SF-${currentUser?.id || '2026'}`,
    landHoldingAcres: currentUser?.farmer_profile?.farm_size_acres || 2.0,
    primaryCrops: ['Tomato', 'Onion', 'Soybean', 'Wheat'],
    bankAccountLinked: currentUser?.farmer_profile?.bank_account_linked ?? true,
    kycVerified: currentUser?.farmer_profile?.kyc_verified ?? true,
    trustScore: currentUser?.farmer_profile?.trust_score || 90,
    totalLotsSold: 0,
    totalEarnings: 0,
    rating: 4.8,
  };

  const [farmer, setFarmer] = useState<FarmerProfile>(defaultFarmer);
  const [lots, setLots] = useState<DigitalLot[]>([]);
  const [logistics, setLogistics] = useState<LogisticsBooking[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCropForAnalysis, setSelectedCropForAnalysis] = useState<string>('Tomato');
  const [selectedQuantityKg, setSelectedQuantityKg] = useState<number>(500);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('krishisetu_language');
      if (savedLang) setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('krishisetu_language', lang);
    }
  };

  const refreshAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedFarmer, fetchedLots, fetchedLogistics, fetchedTxns] = await Promise.allSettled([
        authService.getFarmerProfile(),
        lotService.getAllLots(),
        logisticsService.getAllBookings(),
        transactionService.getAllTransactions(),
      ]);

      if (fetchedFarmer.status === 'fulfilled' && fetchedFarmer.value) {
        setFarmer(fetchedFarmer.value);
      } else if (currentUser) {
        setFarmer({
          id: `farmer_${currentUser.id}`,
          name: currentUser.name,
          phone: currentUser.phone_number,
          village: currentUser.farmer_profile?.village || (currentUser.location?.split(',')[0]?.trim() || 'Village'),
          taluka: currentUser.farmer_profile?.village || (currentUser.location?.split(',')[0]?.trim() || 'Taluka'),
          district: currentUser.farmer_profile?.district || (currentUser.location?.split(',')[1]?.trim() || 'District'),
          state: currentUser.farmer_profile?.state || 'Maharashtra',
          fpoName: currentUser.farmer_profile?.organization_fpo || 'Sahyadri Farmers Collective',
          fpoMemberId: currentUser.farmer_profile?.fpo_member_id || `SF-${currentUser.id}`,
          landHoldingAcres: currentUser.farmer_profile?.farm_size_acres || 2.0,
          primaryCrops: ['Tomato', 'Onion', 'Soybean', 'Wheat'],
          bankAccountLinked: currentUser.farmer_profile?.bank_account_linked ?? true,
          kycVerified: currentUser.farmer_profile?.kyc_verified ?? true,
          trustScore: currentUser.farmer_profile?.trust_score || 90,
          totalLotsSold: 0,
          totalEarnings: 0,
          rating: 4.8,
        });
      }

      if (fetchedLots.status === 'fulfilled') {
        setLots(fetchedLots.value);
      }
      if (fetchedLogistics.status === 'fulfilled') {
        setLogistics(fetchedLogistics.value);
      }
      if (fetchedTxns.status === 'fulfilled') {
        setTransactions(fetchedTxns.value);
      }
    } catch (err) {
      console.warn('Could not sync with backend on startup.', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const createLot = async (lotData: any): Promise<DigitalLot> => {
    const newLot = await lotService.createLot({
      ...lotData,
      farmerId: farmer.id,
      farmerName: farmer.name,
      location: farmer.village ? `${farmer.village}, ${farmer.district}` : (farmer.district || 'Farm Gate'),
      farmPincode: '422202',
    });
    setLots((prev) => [newLot, ...prev]);
    showToast('Crop Lot Created!', `Crop Lot #${newLot.lotNumber} listed for buyer matching.`);
    return newLot;
  };

  const respondToOffer = async (
    lotId: string,
    offerId: string,
    action: 'accept' | 'reject' | 'counter',
    counterPrice?: number
  ) => {
    const { updatedLot } = await lotService.respondToOffer(lotId, offerId, action, counterPrice);
    setLots((prev) => prev.map((l) => (l.id === lotId ? updatedLot : l)));

    if (action === 'accept') {
      showToast('Deal Locked!', 'Escrow funding initiated. Logistics dispatch slot booked.');
      refreshAllData();
    } else if (action === 'counter') {
      showToast('Counter-Offer Sent', `Counter proposal of ₹${counterPrice}/kg delivered to buyer.`);
    } else {
      showToast('Offer Declined', 'The offer was declined.', 'info');
    }
  };

  const bookLogistics = async (bookingData: any): Promise<LogisticsBooking> => {
    const newBooking = await logisticsService.createBooking({
      ...bookingData,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      pickupAddress: `${farmer.village}, ${farmer.district}`,
    });
    setLogistics((prev) => [newBooking, ...prev]);
    showToast('Vehicle Dispatched!', `Tracking #${newBooking.trackingNumber} scheduled.`);
    return newBooking;
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        farmer,
        lots,
        logistics,
        transactions,
        toasts,
        isLoading,
        showToast,
        dismissToast,
        createLot,
        respondToOffer,
        bookLogistics,
        refreshAllData,
        selectedCropForAnalysis,
        setSelectedCropForAnalysis,
        selectedQuantityKg,
        setSelectedQuantityKg,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
