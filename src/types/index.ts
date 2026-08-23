// Types for KrishiSetu AI - Farmer Market Intelligence & Price Discovery

export type UserRole = 'farmer' | 'fpo' | 'buyer';

export type QualityGrade = 'Grade A (Export/Premium)' | 'Grade B (Supermarket/Standard)' | 'Grade C (Processing/Bulk)';

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  fpoName?: string;
  fpoMemberId?: string;
  landHoldingAcres: number;
  primaryCrops: string[];
  bankAccountLinked: boolean;
  kycVerified: boolean;
  trustScore: number; // 0 to 100
  totalLotsSold: number;
  totalEarnings: number;
  rating: number; // 1 to 5
}

export interface CropInfo {
  id: string;
  name: string;
  localName: string;
  category: 'Vegetables' | 'Grains & Cereals' | 'Pulses' | 'Oilseeds' | 'Fruits' | 'Cash Crops';
  icon: string;
  unit: 'kg' | 'quintal' | 'ton';
  defaultShelfLifeDays: number;
  currentAvgPricePerKg: number;
  priceTrend: 'rising' | 'falling' | 'stable';
  volatility: 'low' | 'medium' | 'high';
}

export interface MandiMarket {
  id: string;
  name: string;
  state: string;
  district: string;
  distanceKm: number;
  currentPricePerKg: number;
  yesterdayPricePerKg: number;
  modalPricePerKg: number;
  arrivalVolumeQuintals: number;
  arrivalTrend: 'rising' | 'steady' | 'dropping';
  marketFeePercent: number; // Mandi cess e.g. 1.0% to 1.5%
  weighmentCostPerKg: number;
  unloadingCostPerKg: number;
  paymentCycleDays: number;
  reliabilityScore: number; // 0-100
  operatingHours: string;
}

export interface InstitutionalBuyer {
  id: string;
  name: string;
  companyType: 'Corporate Retailer' | 'Food Processor' | 'Export House' | 'FPO Aggregator' | 'Direct Wholesaler';
  verified: boolean;
  rating: number;
  reviewsCount: number;
  procurementHub: string;
  distanceKm: number;
  cropRequired: string;
  requiredQuantityKg: number;
  offeredPricePerKg: number;
  qualityRequirement: QualityGrade;
  paymentTerms: 'Instant Digital (T+0)' | 'Next Day (T+1)' | 'Within 3 Days (T+3)';
  paymentReliability: number; // % on-time payments e.g. 98%
  pickupServiceAvailable: boolean;
  contactPerson: string;
  contactPhone: string;
}

export interface NetRealizationBreakdown {
  destinationName: string;
  destinationType: 'mandi' | 'buyer';
  grossPricePerKg: number;
  transportCostPerKg: number;
  storageAndHandlingPerKg: number;
  mandiCessAndFeesPerKg: number;
  totalDeductionsPerKg: number;
  netRealizationPerKg: number;
  totalGrossAmount: number;
  totalDeductions: number;
  totalNetRevenue: number;
  isTopRecommendation?: boolean;
}

export interface RecommendationReason {
  type: 'positive' | 'warning' | 'neutral';
  text: string;
  impactScore?: number;
}

export interface PriceHistoryPoint {
  date: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  arrivalVolume: number;
  marketName?: string;
}

export interface PriceTrendMetrics {
  cropId: number;
  cropName: string;
  marketName: string;
  timeframeDays: number;
  dataPointsCount: number;
  currentPrice: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  priceChangeAbsolute: number;
  percentageChange: number;
  trendDirection: 'rising' | 'falling' | 'steady';
  momentum: 'positive_bullish' | 'negative_bearish' | 'neutral_steady';
  volatility: 'low' | 'medium' | 'high';
  isSufficientData: boolean;
  note: string;
}

export interface ForecastPoint {
  day: string;
  date: string;
  expectedPrice: number;
  lowerEstimate?: number;
  upperEstimate?: number;
  arrivalIndex: number;
  isPeakWindow?: boolean;
}

export interface PrototypeForecastData {
  cropId: number;
  cropName: string;
  modelType: string;
  currentSpotPrice: number;
  forecastHorizonDays: number;
  forecastConfidenceScore: number;
  isReliableData: boolean;
  peakSellingDay: string;
  peakExpectedPrice: number;
  peakPriceRange: string;
  recommendedAction: 'SELL_NOW' | 'WAIT_AND_SELL_IN_2_3_DAYS';
  forecastPoints: ForecastPoint[];
  explanationNotes: string;
}

export interface AISaleRecommendation {
  id: string;
  cropId: string;
  cropName: string;
  lotId?: string;
  quantityKg: number;
  currentDate: string;
  recommendedDestination: {
    id: string;
    name: string;
    type: 'buyer' | 'mandi';
    location: string;
    distanceKm: number;
  };
  recommendedSellingWindow: string;
  sellingWindowDays: number;
  expectedPricePerKg: number;
  transportCostPerKg: number;
  storageCostPerKg: number;
  estimatedNetRealizationPerKg: number;
  confidencePercentage: number;
  actionStrategy?: 'SELL_NOW' | 'SELL_IN_2_3_DAYS';
  priceForecast7Days: ForecastPoint[];
  breakdown: NetRealizationBreakdown[];
  reasons: RecommendationReason[];
  trendSummary?: any;
  forecastMetadata?: {
    modelType?: string;
    confidenceScore?: number;
    isReliableData?: boolean;
    notes?: string;
  };
  riskAnalysis: {
    spoilageRisk: 'Low' | 'Moderate' | 'High' | string;
    priceDropRisk: 'Low' | 'Moderate' | 'High' | string;
    paymentRisk: 'Minimal (Escrow Backed)' | 'Low' | 'Medium' | string;
  };
}

export interface BuyerOffer {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: string;
  buyerRating: number;
  offeredPricePerKg: number;
  quantityKg: number;
  totalOfferAmount: number;
  estimatedTransportPerKg: number;
  estimatedNetRealizationPerKg: number;
  paymentTerms: string;
  pickupOffered: boolean;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterPricePerKg?: number;
  notes?: string;
}

export interface DigitalLot {
  id: string;
  lotNumber: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  variety: string;
  quantityKg: number;
  harvestDate: string;
  expectedPricePerKg: number;
  qualityGrade: QualityGrade;
  moisturePercentage?: number;
  location: string;
  farmPincode: string;
  images: string[];
  status: 'draft' | 'active_listed' | 'offer_received' | 'deal_locked' | 'in_transit' | 'settled';
  createdAt: string;
  offers: BuyerOffer[];
  bestOffer?: BuyerOffer;
  logisticsId?: string;
  transactionId?: string;
}

export interface TransportVehicleOption {
  id: string;
  vehicleType: string; // e.g. "Tata Ace (Chhota Hathi)", "Mahindra Bolero Maxi Truck", "Eicher 14ft Pro"
  capacityKg: number;
  baseRatePerKm: number;
  loadingUnloadingCost: number;
  estimatedTransitHours: number;
  driverRating: number;
  availability: 'Available Immediately' | 'Available in 2h' | 'Scheduled Tomorrow';
}

export interface LogisticsBooking {
  id: string;
  lotId: string;
  cropName: string;
  quantityKg: number;
  pickupAddress: string;
  destinationName: string;
  destinationAddress: string;
  distanceKm: number;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  totalFreightCost: number;
  costPerKg: number;
  pickupTime: string;
  status: 'requested' | 'driver_assigned' | 'loaded_at_farm' | 'in_transit' | 'delivered_at_destination';
  trackingNumber: string;
}

export interface PaymentTransaction {
  id: string;
  lotId: string;
  lotNumber: string;
  buyerName: string;
  farmerName: string;
  cropName: string;
  quantityKg: number;
  agreedPricePerKg: number;
  grossAmount: number;
  logisticsCost: number;
  mandiFeesOrPlatformDeduction: number;
  qualityDeduction: number;
  netRealizationAmount: number;
  netRealizationPerKg: number;
  paymentMode: 'Direct Bank Transfer (IMPS/NEFT)' | 'UPI Escrow' | 'Mandi Settlement';
  paymentStatus: 'in_escrow' | 'released_to_bank' | 'pending_quality_check' | 'completed';
  createdAt: string;
  settledAt?: string;
  utrNumber?: string;
  timeline: {
    step: string;
    date: string;
    completed: boolean;
    description: string;
  }[];
}
