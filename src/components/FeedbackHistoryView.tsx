import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Star, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserCheck, 
  Calendar, 
  Tag, 
  ArrowUpRight, 
  BarChart3, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { FarmerRecommendationFeedback, CropId, LanguageCode } from '../types';
import { CROPS } from '../data/initialData';
import { calculateFeedbackMetrics } from '../data/historicalData';

interface FeedbackHistoryViewProps {
  feedbackList: FarmerRecommendationFeedback[];
  onOpenFeedbackModal: () => void;
  language: LanguageCode;
  onNavigateTab: (tab: string) => void;
}

export const FeedbackHistoryView: React.FC<FeedbackHistoryViewProps> = ({
  feedbackList,
  onOpenFeedbackModal,
  language,
  onNavigateTab,
}) => {
  const [filterCrop, setFilterCrop] = useState<string>('all');
  const [filterAdherence, setFilterAdherence] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const metrics = calculateFeedbackMetrics(feedbackList);

  const filteredFeedbacks = feedbackList.filter(f => {
    const matchesCrop = filterCrop === 'all' || f.crop === filterCrop;
    const matchesAdherence = filterAdherence === 'all' || f.followedRecommendation === filterAdherence;
    const matchesSearch = searchQuery === '' || 
      f.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.actualChannel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.otherNotes && f.otherNotes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCrop && matchesAdherence && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <MessageSquareQuote className="w-5 h-5 text-emerald-700" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                Farmer Outcomes & Recommendation Feedback
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-2xl">
              Real-world transactions logged by farmers after receiving advisory: actual prices realized, recommendation adherence, and ground friction reported.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('ai-advice')}
              className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Get AI Recommendation</span>
            </button>
          </div>
        </div>

        {/* Aggregate Outcome Metrics */}
        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 lg:grid-cols-5 gap-3">
          
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Outcomes Logged
            </span>
            <div className="text-2xl font-black text-stone-900 mt-0.5">
              {metrics.totalLogged}
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              Verified ground sales
            </span>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Adherence Rate
            </span>
            <div className="text-2xl font-black text-emerald-900 mt-0.5">
              {metrics.adherenceRatePercent}%
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              Followed advice fully/partially
            </span>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Avg Realized Gain
            </span>
            <div className="text-2xl font-black text-emerald-900 mt-0.5">
              +₹{metrics.avgRealizedVariancePerQtl}
              <span className="text-xs font-bold text-emerald-700">/qtl</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              Above distress village baseline
            </span>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Cluster Value Realized
            </span>
            <div className="text-xl font-black text-stone-900 mt-0.5">
              ₹{(metrics.totalNetValueRealized / 1000).toFixed(0)}k
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              Total net revenue tracked
            </span>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 col-span-2 lg:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Farmer Satisfaction
            </span>
            <div className="text-xl font-black text-amber-600 mt-0.5 flex items-center gap-1">
              <span>{metrics.avgSatisfaction}</span>
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              Across 5.0 rating scale
            </span>
          </div>

        </div>
      </div>

      {/* Top Reported Issues Analysis Card */}
      {metrics.topReportedIssues.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                Ground Reality Friction Index (Top Reported Field Issues)
              </h2>
            </div>
            <span className="text-xs text-stone-500">
              Used by FPO to resolve buyer disputes and transit bottlenecks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.topReportedIssues.map((item, idx) => (
              <div 
                key={idx}
                className="bg-amber-50/60 rounded-xl p-3 border border-amber-200 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="text-xs font-bold text-amber-950 block truncate">
                    {item.issue}
                  </span>
                  <span className="text-[11px] text-amber-700">
                    Reported by {item.count} farmer{item.count > 1 ? 's' : ''} in cluster
                  </span>
                </div>
                <span className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farmer, village, or channel..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">All Crops</option>
            {CROPS.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterAdherence}
            onChange={(e) => setFilterAdherence(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">All Adherence</option>
            <option value="yes">Followed Fully</option>
            <option value="partially">Partially Followed</option>
            <option value="no">Different Market</option>
            <option value="alternative_action">Distress / Emergency</option>
          </select>
        </div>
      </div>

      {/* Feedback Feed Cards */}
      <div className="space-y-3">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-stone-500 border border-stone-200">
            No feedback entries match your filter.
          </div>
        ) : (
          filteredFeedbacks.map((item) => {
            const cropObj = CROPS.find(c => c.id === item.crop);
            const isGain = item.realizedVariancePerQtl >= 0;

            return (
              <div 
                key={item.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs hover:border-stone-300 transition-colors space-y-3"
              >
                
                {/* Farmer & Crop Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                      {item.farmerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-stone-900">{item.farmerName}</span>
                        {item.verifiedByFpo && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-700" />
                            <span>FPO Verified</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500 font-medium">
                        {item.village} • {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800">
                      {cropObj?.icon} {cropObj?.name || item.crop} ({item.quantityQuintals} qtl)
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < item.satisfactionRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Original Recommendation vs Actual Outcome Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-stone-50 rounded-xl p-3.5 border border-stone-200/80">
                  
                  {/* Recommended Snapshot */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Target Advisory
                    </span>
                    <div className="text-xs font-bold text-stone-800">
                      {item.originalRecommendation.actionTitle}
                    </div>
                    <div className="text-xs text-stone-600 mt-0.5">
                      Expected Net: <strong className="text-stone-900">₹{item.originalRecommendation.expectedNetProfit.toLocaleString('en-IN')}</strong> (~₹{item.originalRecommendation.projectedNetPerQtl}/qtl)
                    </div>
                  </div>

                  {/* Actual Action & Result */}
                  <div className="md:border-l md:border-stone-200 md:pl-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Actual Field Execution
                    </span>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black text-stone-900">
                        {item.actualChannel}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 ${
                        isGain ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isGain ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isGain ? `+₹${item.realizedVariancePerQtl}` : `-₹${Math.abs(item.realizedVariancePerQtl)}`}/qtl</span>
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 mt-0.5">
                      Realized Rate: <strong className="text-emerald-800">₹{item.actualPricePerQuintal}/qtl</strong> • Total Net: <strong className="text-stone-900">₹{item.actualNetRealized.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                </div>

                {/* Issues Encountered & Ground Notes */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-600">Field Notes:</span>
                    {item.issuesEncountered.map((issue, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          issue === 'None - Smooth transaction'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {issue}
                      </span>
                    ))}
                  </div>

                  {item.otherNotes && (
                    <p className="text-xs text-stone-700 italic bg-stone-50/80 p-2.5 rounded-lg border border-stone-100">
                      "{item.otherNotes}"
                    </p>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
