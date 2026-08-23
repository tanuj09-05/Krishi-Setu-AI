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
import {
  MOCK_FARMER,
  MOCK_LOTS,
  MOCK_LOGISTICS,
  MOCK_TRANSACTIONS,
  MOCK_TOMATO_RECOMMENDATION,
} from '../data/mockData';
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
  const [role, setRole] = useState<UserRole>('farmer');
  const [language, setLanguageState] = useState<string>('English');
  const [farmer, setFarmer] = useState<FarmerProfile>(MOCK_FARMER);
  const [lots, setLots] = useState<DigitalLot[]>(MOCK_LOTS);
  const [logistics, setLogistics] = useState<LogisticsBooking[]>(MOCK_LOGISTICS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(MOCK_TRANSACTIONS);
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
      }
      if (fetchedLots.status === 'fulfilled' && fetchedLots.value.length > 0) {
        setLots(fetchedLots.value);
      }
      if (fetchedLogistics.status === 'fulfilled' && fetchedLogistics.value.length > 0) {
        setLogistics(fetchedLogistics.value);
      }
      if (fetchedTxns.status === 'fulfilled' && fetchedTxns.value.length > 0) {
        setTransactions(fetchedTxns.value);
      }
    } catch (err) {
      console.warn('Could not sync with backend on startup. Using local state.', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      location: `${farmer.village}, ${farmer.district}`,
      farmPincode: '422202',
    });
    setLots((prev) => [newLot, ...prev]);
    showToast('Digital Lot Created!', `Lot #${newLot.lotNumber} listed for buyer matching.`);
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
      const acceptedOffer = updatedLot.offers.find((o) => o.id === offerId);
      if (acceptedOffer) {
        showToast(
          'Deal Locked Successfully! 🎉',
          `Sold to ${acceptedOffer.buyerName} at ₹${acceptedOffer.offeredPricePerKg}/kg. Escrow created!`
        );
      }
      // Refresh transactions and logistics from Django to get server-computed net realization
      const [updatedTxns, updatedLogistics] = await Promise.all([
        transactionService.getAllTransactions(),
        logisticsService.getAllBookings(),
      ]);
      setTransactions(updatedTxns);
      setLogistics(updatedLogistics);
    } else if (action === 'counter') {
      showToast('Counter Offer Sent', `Proposed ₹${counterPrice}/kg to the buyer.`);
    } else if (action === 'reject') {
      showToast('Offer Declined', 'The buyer will be notified of your decision.', 'info');
    }
  };

  const bookLogistics = async (bookingData: any): Promise<LogisticsBooking> => {
    const newBooking = await logisticsService.bookLogistics(bookingData);
    setLogistics((prev) => [newBooking, ...prev]);
    showToast('Transport Booked!', `Driver assigned for ${newBooking.destinationName}`);
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
