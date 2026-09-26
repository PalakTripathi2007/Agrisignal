import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Warehouse, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  BadgePercent,
  Coins,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  CropInfo, 
  MarketPrice, 
  BuyerOrder, 
  StorageFacility, 
  TransportOption, 
  LanguageCode, 
  AIRecommendation 
} from '../types';
import { CROPS } from '../data/initialData';
import { TRANSLATIONS } from '../i18n/translations';
import { speakText, stopSpeaking, isSpeaking } from '../services/speechService';

interface FarmerDashboardProps {
  selectedCrop: CropInfo;
  setSelectedCrop: (crop: CropInfo) => void;
  harvestQuantity: number;
  setHarvestQuantity: (qty: number) => void;
  qualityGrade: string;
  setQualityGrade: (grade: any) => void;
  markets: MarketPrice[];
  buyers: BuyerOrder[];
  storage: StorageFacility[];
  transport: TransportOption[];
  recommendation: AIRecommendation | null;
  isLoadingAi: boolean;
  onRefreshAi: () => void;
  onNavigateTab: (tab: string) => void;
  language: LanguageCode;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  selectedCrop,
  setSelectedCrop,
  harvestQuantity,
  setHarvestQuantity,
  qualityGrade,
  setQualityGrade,
  markets,
  buyers,
  storage,
  transport,
  recommendation,
  isLoadingAi,
  onRefreshAi,
  onNavigateTab,
  language,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Relevant filtered data for current crop
  const relevantMarkets = markets.filter(m => m.commodity === selectedCrop.id);
  const bestLocalMarket = relevantMarkets.find(m => m.distanceKm <= 20) || relevantMarkets[0] || markets[0];
  const relevantBuyers = buyers.filter(b => b.commodity === selectedCrop.id && b.status === 'active');
  const topBuyer = relevantBuyers[0];
  const relevantStorage = storage.filter(s => s.suitableCrops.includes(selectedCrop.id));
  const nearestStorage = relevantStorage[0] || storage[0];
  const activePoolTransport = transport.find(t => t.poolActive) || transport[0];

  // Estimated profit calculation for dashboard widget
  const benchmarkPrice = topBuyer ? Math.max(topBuyer.offeredPrice, bestLocalMarket?.modalPrice || selectedCrop.benchmarkPrice) : (bestLocalMarket?.modalPrice || selectedCrop.benchmarkPrice);
  const estimatedGross = harvestQuantity * benchmarkPrice;
  const estimatedDeductions = harvestQuantity * 65; // average logistics & packing
  const estimatedNet = estimatedGross - estimatedDeductions;

  // Handle Audio Readout of Recommendation
  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else if (recommendation) {
      const speechScript = language === 'hi' 
        ? `${recommendation.actionTitle}. सलाह: ${recommendation.rationale}. अनुमानित शुद्ध लाभ: ${recommendation.expectedNetProfit} रुपये.`
        : `${recommendation.actionTitle}. Recommendation: ${recommendation.rationale}. Estimated net profit: ${recommendation.expectedNetProfit} rupees.`;
      
      const started = speakText(speechScript, language);
      if (started) {
        setIsPlayingAudio(true);
        // poll voice completion
        const timer = setInterval(() => {
          if (!isSpeaking()) {
            setIsPlayingAudio(false);
            clearInterval(timer);
          }
        }, 800);
      }
    }
  };

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/60 text-emerald-100 text-xs font-semibold mb-3 border border-emerald-500/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Kolar & Regional FPO Network Intelligence Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {t.appSubtitle}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mb-5 font-normal">
            {t.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dashboard-get-ai-advice-button"
              onClick={() => onNavigateTab('ai-advice')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-transform active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t.getAiRec}</span>
            </button>
            <button
              id="dashboard-open-calc-button"
              onClick={() => onNavigateTab('calculator')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/70 text-emerald-100 font-semibold text-sm border border-emerald-600/60 transition-colors cursor-pointer"
            >
              <Coins className="w-4 h-4 text-emerald-300" />
              <span>{t.compareOptions}</span>
            </button>
          </div>
        </div>

        {/* Decorative background visual elements */}
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 select-none pointer-events-none hidden sm:block">
          {selectedCrop.icon}
        </div>
      </div>

      {/* Harvest Selector & Configuration Strip */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Crop Selector Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              {t.currentCrop}
            </label>
            <div className="flex flex-wrap gap-2">
              {CROPS.map((crop) => {
                const isSelected = crop.id === selectedCrop.id;
                return (
                  <button
                    key={crop.id}
                    id={`crop-selector-${crop.id}`}
                    onClick={() => {
                      setSelectedCrop(crop);
                      setHarvestQuantity(crop.avgHarvestQuintals);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-102'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span>{crop.icon}</span>
                    <span>{language === 'hi' ? crop.hindiName : crop.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Harvest Quantity & Quality Input */}
          <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
            <div>
              <label htmlFor="dashboard-harvest-qty-input" className="block text-xs font-bold text-stone-600 mb-1">
                {t.harvestQuantity} ({selectedCrop.unit})
              </label>
              <div className="flex items-center">
                <input
                  id="dashboard-harvest-qty-input"
                  type="number"
                  min={1}
                  max={1000}
                  value={harvestQuantity}
                  onChange={(e) => setHarvestQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-24 px-3 py-1.5 text-sm font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-l-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="px-2.5 py-1.5 bg-stone-100 border border-l-0 border-stone-300 text-xs font-semibold text-stone-600 rounded-r-lg">
                  Qtl
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="dashboard-quality-grade-select" className="block text-xs font-bold text-stone-600 mb-1">
                Quality Grade
              </label>
              <select
                id="dashboard-quality-grade-select"
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as any)}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
              >
                <option value="Grade A (Export/Premium)">Grade A (Premium/Export)</option>
                <option value="Grade B (Standard Mandi)">Grade B (Standard APMC)</option>
                <option value="Grade C (Processing)">Grade C (Food Processing)</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* AI Selling Recommendation Featured Card */}
      {recommendation && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    {t.aiSellingRecommendation}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-900">
                    {recommendation.confidence} {t.confidence} ({recommendation.confidenceScore}%)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
                  {recommendation.actionTitle}
                </h2>
              </div>
            </div>

            {/* Audio Voice Readout Button */}
            <div className="flex items-center gap-2">
              <button
                id="listen-audio-recommendation-button"
                onClick={handleToggleVoice}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer ${
                  isPlayingAudio 
                    ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse' 
                    : 'bg-emerald-700 text-white hover:bg-emerald-800'
                }`}
                title="Listen in local voice language"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{t.stopAudio}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{t.listenAudio}</span>
                  </>
                )}
              </button>

              <button
                id="refresh-ai-recommendation-button"
                onClick={onRefreshAi}
                disabled={isLoadingAi}
                className="px-3 py-2 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100/50 text-emerald-800 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoadingAi ? 'Analyzing...' : 'Refresh AI'}
              </button>
            </div>
          </div>

          {/* Rationale & Key Factors */}
          <div className="py-4">
            <p className="text-sm sm:text-base font-medium text-stone-800 leading-relaxed">
              {recommendation.rationale}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
              {recommendation.keyFactors.slice(0, 4).map((factor, idx) => (
                <div key={idx} className="bg-white/80 rounded-lg p-2.5 border border-emerald-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-stone-700 mb-0.5">
                    <span>{factor.label}</span>
                    <span className={`px-1.5 py-0.2 text-[10px] rounded-sm font-semibold uppercase ${
                      factor.impact === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                      factor.impact === 'negative' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {factor.impact}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-snug">{factor.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row & Disclaimer */}
          <div className="pt-3 border-t border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-900 font-medium">
              <Info className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{t.decisionSupportDisclaimer}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="view-full-ai-details-button"
                onClick={() => onNavigateTab('ai-advice')}
                className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 bg-emerald-800 text-white hover:bg-emerald-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <span>View Full Strategy & Forecast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6 Key Decision Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Current Market Price */}
        <div 
          className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
          onClick={() => onNavigateTab('markets')}
          id="metric-card-current-market-price"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">{t.currentMarketPrice}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              {bestLocalMarket?.distanceKm} km away
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-stone-900">
              ₹{bestLocalMarket?.modalPrice?.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-stone-500"> /qtl</span>
            </span>
            <div className={`flex items-center gap-1 text-xs font-bold ${
              bestLocalMarket?.priceTrend === 'rising' ? 'text-emerald-600' : 
              bestLocalMarket?.priceTrend === 'falling' ? 'text-rose-600' : 'text-stone-500'
            }`}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{bestLocalMarket?.trendPercent > 0 ? `+${bestLocalMarket?.trendPercent}%` : `${bestLocalMarket?.trendPercent}%`}</span>
            </div>
          </div>
          <p className="text-xs text-stone-600 mt-2 font-medium truncate">
            {bestLocalMarket?.marketName}
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span className="text-emerald-700 font-semibold">{t.verifiedData}</span>
            <span>{bestLocalMarket?.lastUpdated}</span>
          </div>
        </div>

        {/* 2. Nearby Buyers Ready */}
        <div 
          className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
          onClick={() => onNavigateTab('buyers')}
          id="metric-card-nearby-buyers"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">{t.nearbyBuyers}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
              {relevantBuyers.length} Verified Buyers
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-stone-900">
              ₹{topBuyer ? topBuyer.offeredPrice.toLocaleString('en-IN') : selectedCrop.benchmarkPrice}
              <span className="text-xs font-normal text-stone-500"> /qtl</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
              Instant Cash
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-2 font-medium truncate">
            {topBuyer ? `${topBuyer.buyerName} (${topBuyer.company})` : 'FPO Procurement Center'}
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Req: {topBuyer ? `${topBuyer.requiredQuantityQuintals} Qtl` : 'Open'}</span>
            <span className="text-blue-700 font-semibold flex items-center gap-1">
              <span>{t.contactBuyer}</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 3. Market Demand & Activity */}
        <div 
          className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
          onClick={() => onNavigateTab('markets')}
          id="metric-card-market-demand"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">{t.marketDemand}</span>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
              bestLocalMarket?.demandLevel === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {bestLocalMarket?.demandLevel || 'High'} Demand
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-stone-900">
              {bestLocalMarket?.buyerCount || 24}
              <span className="text-xs font-normal text-stone-500"> Active Bidders</span>
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Today's Session
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-2 font-medium">
            Daily arrivals steady with minimal gluts reported.
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Range: ₹{bestLocalMarket?.minPrice} - ₹{bestLocalMarket?.maxPrice}</span>
            <span className="text-emerald-700 font-semibold">e-NAM Connected</span>
          </div>
        </div>

        {/* 4. Available Storage */}
        <div 
          className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
          onClick={() => onNavigateTab('storage')}
          id="metric-card-available-storage"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">{t.availableStorage}</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
              {nearestStorage?.distanceKm} km away
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-stone-900">
              {nearestStorage?.availableCapacityMT}
              <span className="text-xs font-normal text-stone-500"> MT Open</span>
            </span>
            <span className="text-xs font-bold text-stone-700">
              ₹{nearestStorage?.pricePerDayPerQuintal}/qtl/day
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-2 font-medium truncate">
            {nearestStorage?.facilityName} ({nearestStorage?.type})
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>{nearestStorage?.temperatureControl}</span>
            <span className="text-purple-700 font-semibold">{t.reserveStorage}</span>
          </div>
        </div>

        {/* 5. Transport Availability (Shared Pool) */}
        <div 
          className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
          onClick={() => onNavigateTab('transport')}
          id="metric-card-transport-ready"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">{t.transportAvailability}</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">
              Pool Departs {activePoolTransport?.poolDepartureTime || '3:30 PM'}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-stone-900">
              {activePoolTransport?.vehicleType?.split(' ')[0]}
              <span className="text-xs font-normal text-stone-500"> Ready</span>
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
              Save {activePoolTransport?.poolSavingsPercent || 38}%
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-2 font-medium truncate">
            {activePoolTransport?.poolRoute || 'Local Village Cluster ➔ Terminal APMC'}
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>{(activePoolTransport?.poolTargetQuintals || 15) - (activePoolTransport?.poolBookedQuintals || 9)} Qtl Space Open</span>
            <span className="text-teal-700 font-semibold">{t.joinPool}</span>
          </div>
        </div>

        {/* 6. Estimated Net Profit */}
        <div 
          className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
          onClick={() => onNavigateTab('calculator')}
          id="metric-card-estimated-profit"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">{t.estimatedProfit}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              For {harvestQuantity} Qtl
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-800">
              ₹{estimatedNet.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-500">
              Net in hand
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-2 font-medium">
            Gross ₹{estimatedGross.toLocaleString('en-IN')} − Costs ₹{estimatedDeductions.toLocaleString('en-IN')}
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>₹{Math.round(estimatedNet / harvestQuantity)}/qtl Net</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span>Detailed Calc</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

      </div>

      {/* Quick Action Decision Cards Strip */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Post-Harvest Strategy Options
          </h3>
          <span className="text-xs text-stone-500">Click any option to simulate</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onNavigateTab('buyers')}
            className="p-3 bg-white rounded-lg border border-stone-200 hover:border-emerald-500 hover:shadow-xs text-left transition-all cursor-pointer"
          >
            <span className="block text-emerald-700 text-xs font-bold mb-1">🟢 1. {t.sellToday}</span>
            <p className="text-xs text-stone-600">Sell direct to verified buyer at farmgate to eliminate transport.</p>
          </button>
          <button
            onClick={() => onNavigateTab('storage')}
            className="p-3 bg-white rounded-lg border border-stone-200 hover:border-emerald-500 hover:shadow-xs text-left transition-all cursor-pointer"
          >
            <span className="block text-amber-700 text-xs font-bold mb-1">🟡 2. {t.storeDays}</span>
            <p className="text-xs text-stone-600">Hold 3-5 days in nearby cold chain to wait out peak harvest glut.</p>
          </button>
          <button
            onClick={() => onNavigateTab('markets')}
            className="p-3 bg-white rounded-lg border border-stone-200 hover:border-emerald-500 hover:shadow-xs text-left transition-all cursor-pointer"
          >
            <span className="block text-blue-700 text-xs font-bold mb-1">🔵 3. {t.sellNearby}</span>
            <p className="text-xs text-stone-600">Bring to Kolar APMC Yard for immediate morning auction bidding.</p>
          </button>
          <button
            onClick={() => onNavigateTab('transport')}
            className="p-3 bg-white rounded-lg border border-stone-200 hover:border-emerald-500 hover:shadow-xs text-left transition-all cursor-pointer"
          >
            <span className="block text-purple-700 text-xs font-bold mb-1">🟣 4. {t.sendAnotherMarket}</span>
            <p className="text-xs text-stone-600">Send to Bangalore Terminal via shared transport pool for +₹400/qtl.</p>
          </button>
        </div>
      </div>

      {/* Historical Data & Farmer Feedback Intelligence Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Historical Trends Banner */}
        <div 
          onClick={() => onNavigateTab('history')}
          className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 hover:border-emerald-400 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Multi-Year Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                3-Year Historical Dataset
              </span>
            </div>
            <h4 className="text-sm font-black text-stone-900">
              {selectedCrop.name} Seasonal Trends & Holding Win-Rates
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Explore 12-month price trajectory envelopes, peak glut slump percentages, and storage holding payoffs before deciding when to dispatch.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Explore 3-Yr Seasonal Curves</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Farmer Feedback Banner */}
        <div 
          onClick={() => onNavigateTab('feedback')}
          className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 hover:border-emerald-400 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                Ground Reality Calibration
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold">
                Live Feedback Loop
              </span>
            </div>
            <h4 className="text-sm font-black text-stone-900">
              Farmer Outcomes & Mandi Friction Index
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Review actual prices realized by fellow farmers, recommendation adherence, and reported ground disputes (weighment, delayed payment).
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-teal-800">
            <span>View Verified Ground Outcomes</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>
    </div>
  );
};
