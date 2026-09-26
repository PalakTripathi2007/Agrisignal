import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Warehouse, 
  Truck, 
  Calculator, 
  BrainCircuit, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { 
  CropInfo, 
  LanguageCode, 
  MarketPrice, 
  BuyerOrder, 
  StorageFacility, 
  TransportOption, 
  AlertItem, 
  FarmerSellRequest, 
  BroadcastMessage, 
  AIRecommendation,
  FarmerRecommendationFeedback
} from './types';
import { 
  CROPS, 
  INITIAL_MARKET_PRICES, 
  INITIAL_BUYER_ORDERS, 
  INITIAL_STORAGE_FACILITIES, 
  INITIAL_TRANSPORT_OPTIONS, 
  INITIAL_ALERTS, 
  INITIAL_FARMER_REQUESTS, 
  INITIAL_BROADCASTS 
} from './data/initialData';
import { TRANSLATIONS } from './i18n/translations';
import { fetchAiRecommendation } from './services/aiService';
import { SEED_FEEDBACKS, getHistoricalDataForCrop } from './data/historicalData';

import { Header } from './components/Header';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AiRecommendationView } from './components/AiRecommendationView';
import { ProfitCalculator } from './components/ProfitCalculator';
import { MarketDataView } from './components/MarketDataView';
import { BuyerMatchingView } from './components/BuyerMatchingView';
import { StorageFinderView } from './components/StorageFinderView';
import { TransportPlannerView } from './components/TransportPlannerView';
import { FpoStewardDashboard } from './components/FpoStewardDashboard';
import { HistoricalMarketTrendsView } from './components/HistoricalMarketTrendsView';
import { FeedbackHistoryView } from './components/FeedbackHistoryView';

export default function App() {
  // Global View & Locale States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isStewardMode, setIsStewardMode] = useState<boolean>(false);

  // Farmer Parameters
  const [selectedCrop, setSelectedCrop] = useState<CropInfo>(CROPS[0]); // Tomato
  const [harvestQuantity, setHarvestQuantity] = useState<number>(35); // 35 Quintals
  const [qualityGrade, setQualityGrade] = useState<string>('Grade A (Export/Premium)');

  // Data Collections State
  const [markets, setMarkets] = useState<MarketPrice[]>(INITIAL_MARKET_PRICES);
  const [buyers, setBuyers] = useState<BuyerOrder[]>(INITIAL_BUYER_ORDERS);
  const [storage, setStorage] = useState<StorageFacility[]>(INITIAL_STORAGE_FACILITIES);
  const [transport, setTransport] = useState<TransportOption[]>(INITIAL_TRANSPORT_OPTIONS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [farmerRequests, setFarmerRequests] = useState<FarmerSellRequest[]>(INITIAL_FARMER_REQUESTS);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(INITIAL_BROADCASTS);
  const [feedbacks, setFeedbacks] = useState<FarmerRecommendationFeedback[]>(SEED_FEEDBACKS);

  // AI Recommendation State
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Translation helper
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Load existing feedback from server if available
  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFeedbacks(data);
        }
      })
      .catch(err => console.log('Using local seed feedbacks:', err));
  }, []);

  // Fetch AI recommendation whenever crop, quantity, or grade changes
  const runAiEvaluation = useCallback(async () => {
    setIsLoadingAi(true);
    try {
      const historicalData = getHistoricalDataForCrop(selectedCrop.id);
      const rec = await fetchAiRecommendation({
        crop: selectedCrop.id,
        cropName: selectedCrop.name,
        quantity: harvestQuantity,
        unit: selectedCrop.unit,
        currentPrice: selectedCrop.benchmarkPrice,
        qualityGrade,
        village: 'Mulbagal Cluster, Kolar',
        nearbyMarkets: markets,
        storageFacilities: storage,
        buyerOffers: buyers,
        transportOptions: transport,
        language,
        historicalSeasonalData: historicalData.seasonalPattern,
        pastFeedbackSummary: feedbacks.slice(0, 5),
      });
      setRecommendation(rec);
    } catch (err) {
      console.error('Failed to run recommendation:', err);
    } finally {
      setIsLoadingAi(false);
    }
  }, [selectedCrop, harvestQuantity, qualityGrade, markets, storage, buyers, transport, language, feedbacks]);

  useEffect(() => {
    runAiEvaluation();
  }, [selectedCrop.id, harvestQuantity, qualityGrade, language]);

  // Handler: Join Transport Pool
  const handleJoinPool = (transportId: string, quantityToAdd: number) => {
    setTransport(prev => prev.map(item => {
      if (item.id === transportId) {
        const currentBooked = item.poolBookedQuintals || 0;
        return {
          ...item,
          poolBookedQuintals: currentBooked + quantityToAdd,
        };
      }
      return item;
    }));

    // Add alert
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      type: 'transport_pool',
      title: 'Transport Pool Slot Reserved',
      message: `You booked ${quantityToAdd} qtl on the afternoon departure to Bangalore APMC.`,
      time: 'Just now',
      severity: 'info',
      badgeText: 'Pool Updated',
      cropId: selectedCrop.id,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Handler: Farmer Submits Direct Sell Request
  const handleSubmitSellRequest = (req: any) => {
    const newRequest: FarmerSellRequest = {
      id: `req-${Date.now()}`,
      ...req,
      status: 'pending',
    };
    setFarmerRequests(prev => [newRequest, ...prev]);

    // Add alert
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      type: 'buyer_offer',
      title: 'Sell Request Logged with Buyer',
      message: `Offered ${req.quantity} quintals to ${req.buyerName}. Total value ₹${req.totalValue.toLocaleString('en-IN')}.`,
      time: 'Just now',
      severity: 'high',
      badgeText: 'Offer Pending',
      cropId: req.crop,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Handler: Steward verifies a signal
  const handleVerifySignal = (type: 'market' | 'buyer' | 'storage' | 'transport', id: string) => {
    if (type === 'market') {
      setMarkets(prev => prev.map(m => m.id === id ? { 
        ...m, 
        verified: true, 
        reliabilityScore: Math.min(5.0, m.reliabilityScore + 0.1),
        lastUpdated: 'Just now by FPO Steward',
        verificationNote: 'Ground auction price verified by FPO scout',
      } : m));
    } else if (type === 'buyer') {
      setBuyers(prev => prev.map(b => b.id === id ? {
        ...b,
        verified: true,
        trustScore: Math.min(5.0, b.trustScore + 0.1),
        verifiedBy: 'FPO Field Officer (Verified Today)',
      } : b));
    }
  };

  // Handler: Steward flags a signal
  const handleFlagSignal = (type: 'market' | 'buyer' | 'storage' | 'transport', id: string) => {
    if (type === 'market') {
      setMarkets(prev => prev.map(m => m.id === id ? {
        ...m,
        verified: false,
        reliabilityScore: Math.max(2.0, m.reliabilityScore - 0.5),
        verificationNote: 'Flagged as potentially stale by local steward',
      } : m));
    } else if (type === 'buyer') {
      setBuyers(prev => prev.map(b => b.id === id ? {
        ...b,
        verified: false,
        trustScore: Math.max(2.0, b.trustScore - 0.5),
      } : b));
    }
  };

  // Handler: Add new buyer order
  const handleAddBuyerOrder = (orderData: Partial<BuyerOrder>) => {
    const newOrder: BuyerOrder = {
      id: `buyer-${Date.now()}`,
      buyerName: orderData.buyerName || 'Local Aggregator',
      company: orderData.company || 'FPO Cluster',
      commodity: orderData.commodity || selectedCrop.id,
      requiredQuantityQuintals: orderData.requiredQuantityQuintals || 50,
      offeredPrice: orderData.offeredPrice || selectedCrop.benchmarkPrice,
      requiredGrade: orderData.requiredGrade || 'Grade A (Premium)',
      location: orderData.location || 'Kolar Agro Park',
      distanceKm: orderData.distanceKm || 12,
      phone: orderData.phone || '+91 98450 77112',
      paymentTerms: orderData.paymentTerms || 'Immediate Cash',
      pickupType: orderData.pickupType || 'Farmgate Pickup',
      validUntil: orderData.validUntil || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      verified: true,
      verifiedBy: 'FPO Steward Admin',
      trustScore: 4.8,
      status: 'active',
    };
    setBuyers(prev => [newOrder, ...prev]);
  };

  // Handler: Add storage facility
  const handleAddStorageFacility = (data: Partial<StorageFacility>) => {
    const newFacility: StorageFacility = {
      id: `storage-${Date.now()}`,
      facilityName: data.facilityName || 'Kolar Agri Godown',
      type: data.type || 'Cold Storage',
      location: data.location || 'Kolar',
      distanceKm: data.distanceKm || 10,
      totalCapacityMT: data.totalCapacityMT || 500,
      availableCapacityMT: data.availableCapacityMT || 80,
      pricePerDayPerQuintal: data.pricePerDayPerQuintal || 2.2,
      minHoldingDays: 2,
      maxHoldingDays: 30,
      suitableCrops: ['tomato', 'potato', 'onion'],
      phone: '+91 98450 11999',
      temperatureControl: 'Controlled 4°C - 10°C',
      humidityControl: '85-90%',
      verified: true,
      verifiedBy: 'FPO Field Inspector',
      trustScore: 4.7,
    };
    setStorage(prev => [newFacility, ...prev]);
  };

  // Handler: Add transport option
  const handleAddTransportOption = (data: Partial<TransportOption>) => {
    const newTransport: TransportOption = {
      id: `trans-${Date.now()}`,
      vehicleType: data.vehicleType || 'Tata Ace (1.5 MT)',
      driverName: data.driverName || 'Manjunath Gowda',
      phone: data.phone || '+91 98450 33221',
      capacityQuintals: data.capacityQuintals || 15,
      baseFare: data.baseFare || 450,
      costPerKm: data.costPerKm || 20,
      currentLocation: data.currentLocation || 'Mulbagal Village',
      availableTimeSlots: ['02:00 PM - 06:00 PM'],
      verified: true,
      verifiedBy: 'FPO Transport Desk',
      trustScore: 4.8,
      poolActive: true,
      poolRoute: 'Kolar ➔ Terminal APMC',
      poolBookedQuintals: 0,
      poolTargetQuintals: 15,
      poolSavingsPercent: 35,
      poolDepartureTime: 'Today 3:30 PM',
    };
    setTransport(prev => [newTransport, ...prev]);
  };

  // Handler: Send Broadcast
  const handleSendBroadcast = (broadcastData: Omit<BroadcastMessage, 'id' | 'sentAt'>) => {
    const newBroadcast: BroadcastMessage = {
      id: `bcast-${Date.now()}`,
      ...broadcastData,
      sentAt: new Date().toISOString(),
    };
    setBroadcasts(prev => [newBroadcast, ...prev]);

    // Add alert
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      type: 'price_change',
      title: `Broadcast to ${broadcastData.targetGroup}`,
      message: broadcastData.content.slice(0, 100) + '...',
      time: 'Just now',
      severity: 'medium',
      badgeText: broadcastData.channel.toUpperCase(),
      cropId: broadcastData.cropId as any,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Handler: Update Farmer Request Status
  const handleUpdateFarmerRequestStatus = (requestId: string, status: any) => {
    setFarmerRequests(prev => prev.map(req => req.id === requestId ? { ...req, status } : req));
  };

  // Handler: Save Farmer Feedback
  const handleSaveFeedback = async (feedbackData: FarmerRecommendationFeedback) => {
    setFeedbacks(prev => [feedbackData, ...prev]);

    // Send to backend API for persistent storage
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
    } catch (e) {
      console.warn('Backend feedback save error:', e);
    }

    // Add FPO alert notification
    const isGain = feedbackData.realizedVariancePerQtl >= 0;
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      type: 'price_change',
      title: `Farmer Outcome: ${feedbackData.farmerName}`,
      message: `${feedbackData.actualChannel}: ₹${feedbackData.actualPricePerQuintal}/qtl (${isGain ? '+' : ''}₹${feedbackData.realizedVariancePerQtl}/qtl vs projection). ${feedbackData.issuesEncountered.length > 0 && feedbackData.issuesEncountered[0] !== 'None - Smooth transaction' ? `Friction: ${feedbackData.issuesEncountered[0]}` : 'Transaction smooth.'}`,
      time: 'Just now',
      severity: isGain ? 'info' : 'medium',
      badgeText: 'OUTCOME',
      cropId: feedbackData.crop,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      
      {/* Sticky Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        isStewardMode={isStewardMode}
        setIsStewardMode={setIsStewardMode}
        alerts={alerts}
        onOpenAiAdvice={() => setActiveTab('ai-advice')}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <FarmerDashboard
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            harvestQuantity={harvestQuantity}
            setHarvestQuantity={setHarvestQuantity}
            qualityGrade={qualityGrade}
            setQualityGrade={setQualityGrade}
            markets={markets}
            buyers={buyers}
            storage={storage}
            transport={transport}
            recommendation={recommendation}
            isLoadingAi={isLoadingAi}
            onRefreshAi={runAiEvaluation}
            onNavigateTab={setActiveTab}
            language={language}
          />
        )}

        {activeTab === 'markets' && (
          <MarketDataView
            markets={markets}
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            language={language}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'buyers' && (
          <BuyerMatchingView
            buyers={buyers}
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            harvestQuantity={harvestQuantity}
            language={language}
            onSubmitSellRequest={handleSubmitSellRequest}
          />
        )}

        {activeTab === 'storage' && (
          <StorageFinderView
            storageFacilities={storage}
            selectedCrop={selectedCrop}
            harvestQuantity={harvestQuantity}
            language={language}
          />
        )}

        {activeTab === 'transport' && (
          <TransportPlannerView
            transportOptions={transport}
            selectedCrop={selectedCrop}
            harvestQuantity={harvestQuantity}
            language={language}
            onJoinPool={handleJoinPool}
          />
        )}

        {activeTab === 'calculator' && (
          <ProfitCalculator
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            harvestQuantity={harvestQuantity}
            setHarvestQuantity={setHarvestQuantity}
            language={language}
          />
        )}

        {activeTab === 'ai-advice' && (
          <AiRecommendationView
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            harvestQuantity={harvestQuantity}
            setHarvestQuantity={setHarvestQuantity}
            qualityGrade={qualityGrade}
            setQualityGrade={setQualityGrade}
            recommendation={recommendation}
            isLoading={isLoadingAi}
            onRefreshAi={runAiEvaluation}
            language={language}
            onNavigateTab={setActiveTab}
            onSaveFeedback={handleSaveFeedback}
            recentFeedbacks={feedbacks}
          />
        )}

        {activeTab === 'history' && (
          <HistoricalMarketTrendsView
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            language={language}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackHistoryView
            feedbackList={feedbacks}
            onOpenFeedbackModal={() => setActiveTab('ai-advice')}
            language={language}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'steward' && (
          <FpoStewardDashboard
            markets={markets}
            buyers={buyers}
            storage={storage}
            transport={transport}
            farmerRequests={farmerRequests}
            broadcasts={broadcasts}
            selectedCrop={selectedCrop}
            language={language}
            onVerifySignal={handleVerifySignal}
            onFlagSignal={handleFlagSignal}
            onAddBuyerOrder={handleAddBuyerOrder}
            onAddStorageFacility={handleAddStorageFacility}
            onAddTransportOption={handleAddTransportOption}
            onSendBroadcast={handleSendBroadcast}
            onUpdateFarmerRequestStatus={handleUpdateFarmerRequestStatus}
          />
        )}
      </main>

      {/* Mobile-Friendly Fixed Bottom Navigation Bar */}
      <nav 
        className="md:hidden sticky bottom-0 z-30 bg-white border-t border-stone-200 py-1.5 px-2 flex justify-around items-center shadow-lg"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'dashboard' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>{t.navDashboard}</span>
        </button>

        <button
          onClick={() => setActiveTab('markets')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'markets' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span>{t.navMarkets}</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-advice')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold relative ${
            activeTab === 'ai-advice' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center -mt-4 shadow-md">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="mt-0.5">{t.navAiAdvice}</span>
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'buyers' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>{t.navBuyers}</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'calculator' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <Calculator className="w-5 h-5 mb-0.5" />
          <span>{t.navCalculator}</span>
        </button>
      </nav>

      {/* Footer Note */}
      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AgriSignal Local Hub • Post-Harvest Decision Advisory System</span>
          <span className="text-stone-400">Grounded in verified local APMC mandis, cold chains & buyer networks.</span>
        </div>
      </footer>

    </div>
  );
}
