import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  ThumbsUp, 
  Clock, 
  Truck, 
  Scale, 
  Building2 
} from 'lucide-react';
import { AIRecommendation, CropInfo, FarmerRecommendationFeedback, LanguageCode } from '../types';

interface FarmerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: AIRecommendation;
  selectedCrop: CropInfo;
  harvestQuantity: number;
  onSubmitFeedback: (feedback: FarmerRecommendationFeedback) => void;
  language: LanguageCode;
}

const COMMON_ISSUES = [
  'None - Smooth transaction',
  'Weighment dispute at mandi / scale deduction',
  'Transport delay (> 2 hrs)',
  'Buyer price re-negotiation upon arrival',
  'Payment delayed past agreed terms',
  'Quality / Grade dispute at gate',
  'Cold storage full upon arrival',
  'Produce transit damage / heat rot',
  'High handling / loading labour charges',
];

export const FarmerFeedbackModal: React.FC<FarmerFeedbackModalProps> = ({
  isOpen,
  onClose,
  recommendation,
  selectedCrop,
  harvestQuantity,
  onSubmitFeedback,
  language,
}) => {
  if (!isOpen) return null;

  const baselinePerQtl = Math.round(recommendation.expectedNetProfit / harvestQuantity) || 1800;

  const [farmerName, setFarmerName] = useState('Anand Kumar');
  const [phone, setPhone] = useState('+91 98450 ');
  const [village, setVillage] = useState('Kolar Cluster');
  const [followedRecommendation, setFollowedRecommendation] = useState<'yes' | 'partially' | 'no' | 'alternative_action'>('yes');
  const [actualChannel, setActualChannel] = useState(recommendation.recommendedChannel || 'Direct Buyer');
  const [actualPricePerQuintal, setActualPricePerQuintal] = useState<number>(baselinePerQtl);
  const [actualQuantity, setActualQuantity] = useState<number>(harvestQuantity);
  const [issuesEncountered, setIssuesEncountered] = useState<string[]>(['None - Smooth transaction']);
  const [otherNotes, setOtherNotes] = useState('');
  const [satisfactionRating, setSatisfactionRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Price variance calculation
  const variance = actualPricePerQuintal - baselinePerQtl;
  const estimatedActualNet = Math.round(actualQuantity * actualPricePerQuintal - (actualQuantity * 45));

  const handleToggleIssue = (issue: string) => {
    if (issue === 'None - Smooth transaction') {
      setIssuesEncountered(['None - Smooth transaction']);
      return;
    }

    setIssuesEncountered(prev => {
      const filtered = prev.filter(i => i !== 'None - Smooth transaction');
      if (filtered.includes(issue)) {
        const next = filtered.filter(i => i !== issue);
        return next.length === 0 ? ['None - Smooth transaction'] : next;
      } else {
        return [...filtered, issue];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const feedbackEntry: FarmerRecommendationFeedback = {
      id: `fb-${Date.now()}`,
      recommendationId: recommendation.id || `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      farmerName: farmerName.trim() || 'Anonymous Farmer',
      phone: phone.trim(),
      village: village.trim() || 'Kolar Cluster',
      crop: selectedCrop.id,
      quantityQuintals: actualQuantity,
      originalRecommendation: {
        recommendation: recommendation.recommendation,
        actionTitle: recommendation.actionTitle,
        recommendedChannel: recommendation.recommendedChannel,
        expectedNetProfit: recommendation.expectedNetProfit,
        projectedNetPerQtl: baselinePerQtl,
        confidence: recommendation.confidence,
      },
      followedRecommendation,
      actualChannel: actualChannel.trim() || recommendation.recommendedChannel,
      actualPricePerQuintal,
      actualNetRealized: estimatedActualNet,
      realizedVariancePerQtl: variance,
      issuesEncountered,
      otherNotes: otherNotes.trim(),
      satisfactionRating,
      verifiedByFpo: true,
    };

    setTimeout(() => {
      onSubmitFeedback(feedbackEntry);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1400);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-4 sm:p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-700/80 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </span>
              <h2 className="text-lg sm:text-xl font-black">
                Log Post-Harvest Outcome & Ground Feedback
              </h2>
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              Help your FPO cluster calibrate pricing accuracy and hold buyers/logistics accountable.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-stone-800">
          
          {submittedSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-stone-900">Outcome Logged Successfully!</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Thank you! Your actual price realization and ground notes have been linked to the recommendation to train future decision models.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Recommendation Snapshot Card */}
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Original Recommendation
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-black text-stone-900">
                      {recommendation.actionTitle}
                    </span>
                    <div className="text-xs text-stone-600">
                      Channel: <strong className="text-stone-800">{recommendation.recommendedChannel}</strong> • Crop: {selectedCrop.name} ({harvestQuantity} {selectedCrop.unit})
                    </div>
                  </div>
                  <div className="text-right sm:border-l sm:border-stone-200 sm:pl-3">
                    <span className="text-xs text-stone-500 block">Projected Net</span>
                    <span className="text-base font-black text-emerald-700">
                      ₹{recommendation.expectedNetProfit.toLocaleString('en-IN')} (~₹{baselinePerQtl}/qtl)
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 1: Did you follow this recommendation? */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  1. Did you follow this recommendation?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'yes', label: 'Yes, Followed Fully', desc: 'Sold or stored as advised' },
                    { id: 'partially', label: 'Partially Followed', desc: 'Split lot or renegotiated' },
                    { id: 'no', label: 'No, Different Market', desc: 'Selected other mandi/buyer' },
                    { id: 'alternative_action', label: 'Distress / Held Back', desc: 'Immediate cash emergency' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFollowedRecommendation(opt.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        followedRecommendation === opt.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Channel & Financial Realization */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Actual Channel Used
                  </label>
                  <input
                    type="text"
                    value={actualChannel}
                    onChange={(e) => setActualChannel(e.target.value)}
                    placeholder="e.g. Kolar Mandi Yard"
                    className="w-full px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Actual Price Received (₹/qtl)
                  </label>
                  <input
                    type="number"
                    value={actualPricePerQuintal}
                    onChange={(e) => setActualPricePerQuintal(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Quantity ({selectedCrop.unit})
                  </label>
                  <input
                    type="number"
                    value={actualQuantity}
                    onChange={(e) => setActualQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Live Variance Callout */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                variance >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-2">
                  {variance >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-rose-600" />}
                  <span>
                    Outcome vs. Projection: <strong className="font-black">{variance >= 0 ? `+₹${variance}` : `-₹${Math.abs(variance)}`}/quintal</strong>
                  </span>
                </div>
                <div>
                  Estimated Net: <strong className="font-black">₹{estimatedActualNet.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Step 3: Issues Encountered Multi-Select */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  3. Any issues or ground friction encountered?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_ISSUES.map(issue => {
                    const isSelected = issuesEncountered.includes(issue);
                    return (
                      <button
                        key={issue}
                        type="button"
                        onClick={() => handleToggleIssue(issue)}
                        className={`p-2 rounded-lg border text-left text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? issue === 'None - Smooth transaction'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                              : 'border-amber-500 bg-amber-50 text-amber-900'
                            : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                        <span className="truncate">{issue}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Farmer Profile & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Farmer Name</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Village / Cluster</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Ground Notes & Experience (optional)
                </label>
                <textarea
                  rows={2}
                  value={otherNotes}
                  onChange={(e) => setOtherNotes(e.target.value)}
                  placeholder="e.g. Weighment was electronic, payment transferred within 1 hour. Shared Tata Ace worked great."
                  className="w-full px-3 py-2 text-xs text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Step 5: Satisfaction Rating */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <div>
                  <span className="text-xs font-bold text-stone-800 block">Overall Advisory Satisfaction</span>
                  <span className="text-[11px] text-stone-500">How helpful was this recommendation?</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSatisfactionRating(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= satisfactionRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Feedback...' : 'Submit & Link to Recommendation'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
