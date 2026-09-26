import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  PhoneCall, 
  Share2,
  RefreshCw,
  Info,
  Calendar,
  Layers,
  BarChart2,
  MessageSquareQuote,
  Star
} from 'lucide-react';
import { 
  CropInfo, 
  AIRecommendation, 
  LanguageCode, 
  MarketPrice, 
  BuyerOrder, 
  StorageFacility, 
  TransportOption,
  FarmerRecommendationFeedback
} from '../types';
import { CROPS } from '../data/initialData';
import { TRANSLATIONS } from '../i18n/translations';
import { speakText, stopSpeaking, isSpeaking } from '../services/speechService';
import { FarmerFeedbackModal } from './FarmerFeedbackModal';
import { getHistoricalDataForCrop } from '../data/historicalData';

interface AiRecommendationViewProps {
  selectedCrop: CropInfo;
  setSelectedCrop: (crop: CropInfo) => void;
  harvestQuantity: number;
  setHarvestQuantity: (qty: number) => void;
  qualityGrade: string;
  setQualityGrade: (grade: string) => void;
  recommendation: AIRecommendation | null;
  isLoading: boolean;
  onRefreshAi: () => void;
  language: LanguageCode;
  onNavigateTab: (tab: string) => void;
  onSaveFeedback?: (feedback: FarmerRecommendationFeedback) => void;
  recentFeedbacks?: FarmerRecommendationFeedback[];
}

export const AiRecommendationView: React.FC<AiRecommendationViewProps> = ({
  selectedCrop,
  setSelectedCrop,
  harvestQuantity,
  setHarvestQuantity,
  qualityGrade,
  setQualityGrade,
  recommendation,
  isLoading,
  onRefreshAi,
  language,
  onNavigateTab,
  onSaveFeedback,
  recentFeedbacks = [],
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeChannelTab, setActiveChannelTab] = useState<'whatsapp' | 'sms' | 'ivr'>('whatsapp');
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [holdingDaysPreference, setHoldingDaysPreference] = useState(3);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const cropHistorical = getHistoricalDataForCrop(selectedCrop.id);
  const cropFeedbacks = recentFeedbacks.filter(f => f.crop === selectedCrop.id);

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else if (recommendation) {
      const scriptToSpeak = activeChannelTab === 'ivr' && recommendation.ivrScript 
        ? recommendation.ivrScript 
        : `${recommendation.actionTitle}. ${recommendation.rationale}`;

      const started = speakText(scriptToSpeak, language);
      if (started) {
        setIsPlayingAudio(true);
        const timer = setInterval(() => {
          if (!isSpeaking()) {
            setIsPlayingAudio(false);
            clearInterval(timer);
          }
        }, 800);
      }
    }
  };

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Introduction */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <BrainCircuit className="w-5 h-5 text-emerald-700" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {t.aiSellingRecommendation}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-2xl">
              Analyzes real-time verified market prices, storage rates, buyer offers, and transit costs to give simple, high-confidence post-harvest decisions.
            </p>
          </div>

          <button
            id="run-ai-evaluation-button"
            onClick={onRefreshAi}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Evaluating Signals...' : 'Re-Evaluate Live Data'}</span>
          </button>
        </div>

        {/* Harvest Parameters Bar */}
        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Crop</label>
            <select
              value={selectedCrop.id}
              onChange={(e) => {
                const c = CROPS.find(crop => crop.id === e.target.value);
                if (c) {
                  setSelectedCrop(c);
                  setHarvestQuantity(c.avgHarvestQuintals);
                }
              }}
              className="w-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              {CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {language === 'hi' ? c.hindiName : c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Harvested Quantity ({selectedCrop.unit})</label>
            <input
              type="number"
              min={1}
              value={harvestQuantity}
              onChange={(e) => setHarvestQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-full px-3 py-1.5 text-xs sm:text-sm font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Quality Grade</label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="Grade A (Export/Premium)">Grade A (Export / Premium Quality)</option>
              <option value="Grade B (Standard Mandi)">Grade B (Standard Mandi Quality)</option>
              <option value="Grade C (Processing)">Grade C (Processing Quality)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Patience / Holding Window</label>
            <select
              value={holdingDaysPreference}
              onChange={(e) => setHoldingDaysPreference(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value={0}>0 Days (Sell immediately)</option>
              <option value={3}>Up to 3 Days</option>
              <option value={7}>Up to 7 Days</option>
              <option value={14}>Up to 14 Days (Grains/Tubers)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main AI Recommendation Card */}
      {recommendation && (
        <div className="bg-white rounded-2xl border-2 border-emerald-400 shadow-md overflow-hidden">
          
          {/* Recommendation Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  recommendation.recommendation === 'Sell Today' ? 'bg-emerald-400 text-emerald-950' :
                  recommendation.recommendation === 'Store for 2–3 Days' ? 'bg-amber-400 text-amber-950' :
                  recommendation.recommendation === 'Sell in Nearby Market' ? 'bg-blue-300 text-blue-950' : 'bg-purple-300 text-purple-950'
                }`}>
                  {recommendation.recommendation}
                </span>
                <span className="text-xs font-medium text-emerald-200">
                  • Confidence: <strong className="text-white">{recommendation.confidence} ({recommendation.confidenceScore}%)</strong>
                </span>
              </div>

              {/* Text-to-Speech Speaker Button */}
              <button
                id="listen-full-audio-advice-btn"
                onClick={handleToggleVoice}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{t.stopAudio}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-200" />
                    <span>{t.listenAudio}</span>
                  </>
                )}
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
              {recommendation.actionTitle}
            </h2>

            <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed max-w-3xl">
              {recommendation.rationale}
            </p>

            <div className="mt-4 pt-3 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Target Channel: <strong className="text-white">{recommendation.recommendedChannel}</strong></span>
              </div>
              <div>
                <span>Generated by: <strong className="text-white">{recommendation.generatedBy || 'AgriSignal AI'}</strong></span>
                <span className="ml-2">({new Date(recommendation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
              </div>
            </div>
          </div>

          {/* Key Drivers & Financial Takeaway */}
          <div className="p-5 sm:p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Financial Outcome Card */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  Expected Net In-Hand
                </span>
                <div className="text-3xl font-black text-emerald-900">
                  ₹{recommendation.expectedNetProfit.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-emerald-700 mt-1 font-medium">
                  Approx ₹{Math.round(recommendation.expectedNetProfit / harvestQuantity)} / quintal after deducting transport, handling & storage.
                </p>
                <button
                  onClick={() => onNavigateTab('calculator')}
                  className="mt-3 text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open detailed profit breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Spoilage & Risk Assessment */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Spoilage & Shelf Life Risk
                </span>
                <div className="text-lg font-black text-stone-900">
                  {selectedCrop.defaultPerishabilityDays <= 5 ? 'High Spoilage (Perishable)' : 'Low Spoilage (Safe to Hold)'}
                </div>
                <p className="text-xs text-stone-600 mt-1 font-medium">
                  {selectedCrop.name} has typical farmgate shelf-life of ~{selectedCrop.defaultPerishabilityDays} days under ambient rural conditions.
                </p>
                <div className="mt-3 text-xs font-bold text-stone-700">
                  Max Safe Buffer: {selectedCrop.defaultPerishabilityDays} Days
                </div>
              </div>

              {/* Next Immediate Action */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                    Recommended Next Step
                  </span>
                  <p className="text-xs text-stone-800 font-medium">
                    {recommendation.recommendation === 'Sell Today'
                      ? 'Contact buyer directly to schedule gate dispatch or join afternoon shared truck.'
                      : recommendation.recommendation === 'Store for 2–3 Days'
                      ? 'Reserve space at nearby cold facility before weekend arrivals peak.'
                      : 'Lock in vehicle transport and register arrival token.'}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200 flex gap-2">
                  <button
                    onClick={() => {
                      if (recommendation.recommendation.includes('Store')) onNavigateTab('storage');
                      else if (recommendation.recommendation.includes('Market')) onNavigateTab('transport');
                      else onNavigateTab('buyers');
                    }}
                    className="w-full px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Execute This Action
                  </button>
                </div>
              </div>

            </div>

            {/* Key Decision Factors */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Underlying Market Signal Factors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {recommendation.keyFactors.map((factor, idx) => (
                  <div key={idx} className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-800">{factor.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-sm text-[10px] font-bold uppercase ${
                        factor.impact === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                        factor.impact === 'negative' ? 'bg-rose-100 text-rose-800' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {factor.impact}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-snug">{factor.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Assumptions & Decision Support Disclaimer */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center gap-2 mb-2 text-stone-800 font-bold text-xs">
                <Info className="w-4 h-4 text-emerald-700" />
                <span>Assumptions & Data Grounding</span>
              </div>
              <ul className="list-disc list-inside text-xs text-stone-600 space-y-1 font-medium pl-1">
                {recommendation.assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-stone-500 italic border-t border-stone-200 pt-2">
                {t.decisionSupportDisclaimer}
              </p>
            </div>

            {/* Historical Market Grounding & Seasonal Intelligence Card */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-5 text-white space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-emerald-600/30 text-emerald-400">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Historical Market Grounding & Past Trend Calibration
                    </h3>
                    <p className="text-[11px] text-stone-300">
                      Recommendation synthesized against 3-year multi-mandi datasets & farmer feedback loops.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('history')}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Explore 3-Yr Historical Curves</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {recommendation.historicalContext ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Seasonal Cycle Phase
                    </span>
                    <p className="text-stone-200 font-medium">
                      {recommendation.historicalContext.seasonalPhase}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Historical Price Alignment
                    </span>
                    <p className="text-stone-200 font-medium">
                      {recommendation.historicalContext.historicalPriceComparison}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Historical Storage Holding Win-Rate
                    </span>
                    <p className="text-emerald-300 font-medium">
                      {recommendation.historicalContext.historicalStoragePayoffRate}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Past Farmer Feedback Calibration
                    </span>
                    <p className="text-amber-300 font-medium">
                      {recommendation.historicalContext.pastFarmerFeedbackInsight}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-lg p-3 text-xs text-stone-300">
                  Historical baseline: 3-year avg modal price is ₹{cropHistorical.seasonalPattern.threeYearAvgPrice}/qtl with {cropHistorical.seasonalPattern.historicalStorageProfitProbability}% holding win-rate.
                </div>
              )}
            </div>

            {/* Farmer Feedback & Field Outcome Logger Card */}
            <div className="bg-emerald-50 border-2 border-emerald-300/80 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-emerald-200 text-emerald-900">
                      <MessageSquareQuote className="w-4 h-4 text-emerald-800" />
                    </span>
                    <h3 className="text-sm font-black text-emerald-950">
                      Did you execute this advisory? Log your ground outcome
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-800 max-w-xl">
                    Log the actual price you received, whether you followed the recommendation, and any mandi friction (weighment disputes, delays) to calibrate future AI models and alert fellow farmers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Log Realized Price & Feedback</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('feedback')}
                    className="px-3 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-emerald-900 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View All Feedback
                  </button>
                </div>
              </div>

              {/* Quick glance at recent feedback for this crop */}
              {cropFeedbacks.length > 0 && (
                <div className="mt-4 pt-3 border-t border-emerald-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 mb-2">
                    Recent Ground Feedback for {selectedCrop.name}:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cropFeedbacks.slice(0, 2).map((fb) => (
                      <div key={fb.id} className="bg-white/80 rounded-lg p-2.5 border border-emerald-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-stone-900">{fb.farmerName}</span> ({fb.village}): <strong className="text-emerald-800">₹{fb.actualPricePerQuintal}/qtl</strong> at {fb.actualChannel}
                          <div className="text-[10px] text-stone-500">{fb.issuesEncountered[0]}</div>
                        </div>
                        <div className="flex items-center text-amber-400 shrink-0 ml-2">
                          {[...Array(fb.satisfactionRating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Outbound Broadcast Drafts (for FPO Stewards & Village Groups) */}
            <div className="border border-stone-200 rounded-xl p-4 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    FPO Outbound Farmer Broadcast Drafts
                  </h3>
                  <p className="text-xs text-stone-500">
                    Ready-to-send formats formatted for rural low-literacy channels.
                  </p>
                </div>
                
                {/* Channel Selector */}
                <div className="flex rounded-lg bg-stone-100 p-1">
                  <button
                    onClick={() => setActiveChannelTab('whatsapp')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      activeChannelTab === 'whatsapp' ? 'bg-white shadow-xs text-emerald-800' : 'text-stone-600'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setActiveChannelTab('sms')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      activeChannelTab === 'sms' ? 'bg-white shadow-xs text-emerald-800' : 'text-stone-600'
                    }`}
                  >
                    SMS (140 chars)
                  </button>
                  <button
                    onClick={() => setActiveChannelTab('ivr')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      activeChannelTab === 'ivr' ? 'bg-white shadow-xs text-emerald-800' : 'text-stone-600'
                    }`}
                  >
                    IVR Voice Script
                  </button>
                </div>
              </div>

              {/* Preview Container */}
              <div className="bg-stone-50 rounded-lg p-3.5 font-mono text-xs text-stone-800 border border-stone-200 whitespace-pre-wrap leading-relaxed">
                {activeChannelTab === 'whatsapp' && (recommendation.whatsappDraft || 'WhatsApp draft unavailable')}
                {activeChannelTab === 'sms' && (recommendation.smsDraft || 'SMS draft unavailable')}
                {activeChannelTab === 'ivr' && (recommendation.ivrScript || 'IVR script unavailable')}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  {copiedMessage ? '✓ Copied to clipboard!' : 'Click to copy formatted text for farmer WhatsApp groups'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyDraft(
                      activeChannelTab === 'whatsapp' ? recommendation.whatsappDraft :
                      activeChannelTab === 'sms' ? recommendation.smsDraft : recommendation.ivrScript
                    )}
                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedMessage ? 'Copied!' : 'Copy Text'}
                  </button>
                  <button
                    onClick={() => onNavigateTab('steward')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Send via Steward Broadcast Hub
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Ground Feedback & Outcome Logging Modal */}
      {recommendation && (
        <FarmerFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          recommendation={recommendation}
          selectedCrop={selectedCrop}
          harvestQuantity={harvestQuantity}
          onSubmitFeedback={(feedback) => {
            if (onSaveFeedback) {
              onSaveFeedback(feedback);
            }
          }}
          language={language}
        />
      )}

    </div>
  );
};
