export type LanguageCode = 'en' | 'hi' | 'mr' | 'te' | 'pa';

export type CropId = 'tomato' | 'potato' | 'onion' | 'wheat' | 'chilli' | 'mustard';

export interface CropInfo {
  id: CropId;
  name: string;
  hindiName: string;
  category: 'Vegetable' | 'Grain' | 'Tuber' | 'Oilseed';
  defaultPerishabilityDays: number;
  unit: string;
  icon: string;
  avgHarvestQuintals: number;
  benchmarkPrice: number; // ₹ per quintal
}

export interface MarketPrice {
  id: string;
  marketName: string;
  state: string;
  district: string;
  distanceKm: number;
  commodity: CropId;
  variety: string;
  modalPrice: number; // ₹ per quintal
  minPrice: number;
  maxPrice: number;
  priceTrend: 'rising' | 'falling' | 'stable';
  trendPercent: number;
  demandLevel: 'High' | 'Moderate' | 'Low';
  buyerCount: number;
  source: string; // e.g., 'APMC Mandi Board Official', 'FPO Ground Scout'
  verified: boolean;
  reliabilityStars: number; // 0 to 5
  lastUpdated: string; // relative or timestamp
  verificationNote?: string;
}

export interface BuyerOrder {
  id: string;
  buyerName: string;
  company: string;
  contactPhone?: string;
  phone?: string;
  commodity: CropId;
  variety?: string;
  grade?: 'Grade A (Export/Premium)' | 'Grade B (Standard Mandi)' | 'Grade C (Processing)' | string;
  requiredGrade?: string;
  requiredQuantityQuintals: number;
  offeredPrice: number; // ₹ per quintal
  location: string;
  distanceKm: number;
  deliveryWindow?: string;
  reputationScore?: number; // 0.0 to 5.0
  trustScore?: number;
  verified: boolean;
  lastVerified?: string;
  verifiedBy?: string;
  paymentTerms: string;
  pickupType?: string;
  validUntil?: string;
  notes?: string;
  status: 'active' | 'fulfilled' | 'expired';
}

export interface StorageFacility {
  id: string;
  facilityName: string;
  type: 'Cold Storage' | 'Dry Warehouse' | 'Ventilated Godown' | 'Silo' | string;
  totalCapacityMT: number;
  availableCapacityMT: number;
  pricePerDayPerQuintal: number; // ₹ / quintal / day
  distanceKm: number;
  location: string;
  suitableCrops: CropId[];
  temperatureControl: string; // e.g. "2°C - 4°C, 90% RH"
  humidityControl?: string;
  contactPhone?: string;
  phone?: string;
  verified: boolean;
  reputationScore?: number;
  trustScore?: number;
  lastVerified?: string;
  verifiedBy?: string;
  subsidyAvailable?: boolean; // e.g. "e-NWR accredited WDRA"
  minHoldingDays?: number;
  maxHoldingDays?: number;
}

export interface TransportOption {
  id: string;
  transporterName?: string;
  driverName?: string;
  vehicleType: '3-Wheeler Loader (750kg)' | 'Tata Ace Mini (1.5 MT)' | 'Pickup 407 (2.5 MT)' | '6-Tyre Truck (9 MT)' | string;
  capacityQuintals: number;
  costPerKm: number; // ₹ / km
  baseFare: number; // ₹ flat
  currentVillage?: string;
  currentLocation?: string;
  availableTimeSlots?: string | string[];
  contactPhone?: string;
  phone?: string;
  verified: boolean;
  reputationScore?: number;
  trustScore?: number;
  lastVerified?: string;
  verifiedBy?: string;
  poolActive: boolean;
  poolRoute?: string;
  poolBookedQuintals?: number;
  poolTargetQuintals?: number;
  poolDepartureTime?: string;
  poolSavingsPercent?: number;
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  primaryCrop: CropId;
  harvestQuantityQuintals: number;
  qualityGrade: 'Grade A (Export/Premium)' | 'Grade B (Standard Mandi)' | 'Grade C (Processing)';
}

export interface AlertItem {
  id: string;
  type: 'price_change' | 'high_demand' | 'buyer_offer' | 'storage_capacity' | 'transport_pool' | 'selling_time';
  severity: 'high' | 'medium' | 'info';
  title: string;
  message: string;
  time: string;
  badgeText: string;
  crop?: CropId;
  cropId?: CropId;
}

export interface AIRecommendation {
  id?: string;
  recommendation: 'Sell Today' | 'Store for 2–3 Days' | 'Sell in Nearby Market' | 'Send to Another Market';
  actionTitle: string;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore: number;
  recommendedChannel: string;
  expectedNetProfit: number;
  rationale: string;
  keyFactors: {
    label: string;
    impact: 'positive' | 'negative' | 'neutral';
    detail: string;
  }[];
  assumptions: string[];
  historicalContext?: {
    seasonalPhase: string;
    historicalPriceComparison: string;
    historicalStoragePayoffRate: string;
    pastFarmerFeedbackInsight: string;
  };
  smsDraft: string;
  whatsappDraft: string;
  ivrScript: string;
  generatedBy?: string;
  timestamp: string;
}

export interface FarmerRecommendationFeedback {
  id: string;
  recommendationId?: string;
  timestamp: string;
  farmerName: string;
  phone?: string;
  village: string;
  crop: CropId;
  quantityQuintals: number;
  
  // Original Recommendation Snapshot
  originalRecommendation: {
    recommendation: 'Sell Today' | 'Store for 2–3 Days' | 'Sell in Nearby Market' | 'Send to Another Market';
    actionTitle: string;
    recommendedChannel: string;
    expectedNetProfit: number;
    projectedNetPerQtl: number;
    confidence: 'High' | 'Medium' | 'Low';
  };

  // Farmer Outcome & Action
  followedRecommendation: 'yes' | 'partially' | 'no' | 'alternative_action';
  actualChannel: string;
  actualPricePerQuintal: number;
  actualNetRealized: number;
  realizedVariancePerQtl: number; // actualPrice - baseline / expected
  
  // Issues Encountered
  issuesEncountered: string[];
  otherNotes?: string;
  satisfactionRating: number; // 1 to 5
  verifiedByFpo?: boolean;
}

export interface HistoricalPricePoint {
  month: string;
  year: number;
  avgModalPrice: number;
  minPrice: number;
  maxPrice: number;
  monthlyArrivalsMT: number;
  demandIndex: number;
}

export interface SeasonalTrendPattern {
  crop: CropId;
  cropName: string;
  peakHarvestMonths: string[];
  leanSupplyMonths: string[];
  highestPriceMonth: string;
  lowestPriceMonth: string;
  typicalGlutPriceDropPercent: number;
  postGlutHoldingRecoveryPercent: number;
  historicalStorageProfitProbability: number;
  threeYearAvgPrice: number;
  threeYearHigh: number;
  threeYearLow: number;
  historicalYieldQuintalsPerAcre: number;
  seasonalNotes: string;
  festiveDemandWindows: string[];
}

export interface CropHistoricalData {
  cropId: CropId;
  cropName: string;
  monthlyData: HistoricalPricePoint[];
  seasonalPattern: SeasonalTrendPattern;
  keyInsights: string[];
}

export interface BroadcastMessage {
  id: string;
  recommendationId?: string;
  channel: 'sms' | 'whatsapp' | 'ivr';
  language?: LanguageCode;
  contentText?: string;
  content?: string;
  messageTitle?: string;
  author?: string;
  cropId?: string;
  targetGroup: string; // e.g. "All Tomato Farmers (Kolar Block - 42 farmers)"
  status?: 'queued' | 'sent' | 'delivered';
  sentAt: string;
  recipientCount: number;
}

export interface FarmerSellRequest {
  id: string;
  farmerName: string;
  phone?: string;
  farmerPhone?: string;
  crop: CropId;
  quantityQuintals?: number;
  quantity?: number;
  village?: string;
  buyerId?: string;
  buyerName?: string;
  offeredPrice?: number;
  totalValue?: number;
  targetBuyerOrMarket?: string;
  transportNeeded?: boolean;
  status: 'Pending Review' | 'Matched with Buyer' | 'Dispatched' | 'pending' | 'matched' | 'dispatched' | string;
  submittedAt?: string;
  timestamp?: string;
}

