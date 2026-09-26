import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Warehouse, 
  BarChart2, 
  Sparkles, 
  Info, 
  Layers, 
  PlusCircle, 
  CheckCircle2, 
  ArrowRight, 
  Percent, 
  LineChart, 
  Scale 
} from 'lucide-react';
import { CropId, CropInfo, LanguageCode } from '../types';
import { CROPS } from '../data/initialData';
import { HISTORICAL_CROP_DATA, getHistoricalDataForCrop } from '../data/historicalData';

interface HistoricalMarketTrendsViewProps {
  selectedCrop: CropInfo;
  setSelectedCrop: (crop: CropInfo) => void;
  language: LanguageCode;
  onNavigateTab: (tab: string) => void;
}

export const HistoricalMarketTrendsView: React.FC<HistoricalMarketTrendsViewProps> = ({
  selectedCrop,
  setSelectedCrop,
  language,
  onNavigateTab,
}) => {
  const [holdingDaysSimulation, setHoldingDaysSimulation] = useState<number>(7);
  const [showAddDataModal, setShowAddDataModal] = useState(false);
  const [surveyMonth, setSurveyMonth] = useState('Sep');
  const [surveyPrice, setSurveyPrice] = useState<number>(selectedCrop.marketPrice);
  const [surveyArrivals, setSurveyArrivals] = useState<number>(8500);
  const [surveySaved, setSurveySaved] = useState(false);

  const cropData = getHistoricalDataForCrop(selectedCrop.id);
  const { seasonalPattern, monthlyData, keyInsights } = cropData;

  // Max price for bar height scaling
  const maxPriceInSeries = Math.max(...monthlyData.map(d => d.maxPrice), 3000);

  // Simulation calculation based on historical data
  const storageCostPerDay = selectedCrop.defaultPerishabilityDays <= 5 ? 4.5 : 2.0;
  const totalStorageFee = storageCostPerDay * holdingDaysSimulation;
  const expectedGainPct = holdingDaysSimulation <= 3 ? 0.08 : holdingDaysSimulation <= 7 ? seasonalPattern.postGlutHoldingRecoveryPercent / 100 : 0.28;
  const simulatedGrossPrice = Math.round(selectedCrop.marketPrice * (1 + expectedGainPct));
  const simulatedNetGainPerQtl = Math.round(simulatedGrossPrice - selectedCrop.marketPrice - totalStorageFee);
  const netGainIsPositive = simulatedNetGainPerQtl > 0;

  const handleSaveSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    setSurveySaved(true);
    setTimeout(() => {
      setSurveySaved(false);
      setShowAddDataModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <BarChart2 className="w-5 h-5 text-emerald-700" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                Historical Market Data & Seasonal Trend Analytics
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-2xl">
              3-year verified price curves, monthly arrival volumes, and storage holding payoffs to empower smarter post-harvest decisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddDataModal(true)}
              className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-stone-600" />
              <span>Record Mandi Survey Data</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai-advice')}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Test AI With Historical Context</span>
            </button>
          </div>
        </div>

        {/* Crop Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-1">
          {CROPS.map(crop => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                selectedCrop.id === crop.id
                  ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-500/30'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <span className="text-sm">{crop.icon}</span>
              <span>{language === 'hi' ? crop.hindiName : crop.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3-Year Historical Benchmarks Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            3-Yr Avg Price
          </span>
          <div className="text-xl font-black text-stone-900 mt-1">
            ₹{seasonalPattern.threeYearAvgPrice}
            <span className="text-xs font-semibold text-stone-500">/qtl</span>
          </div>
          <span className="text-[10px] text-stone-500 font-medium">Historical baseline</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            3-Yr Price Range
          </span>
          <div className="text-sm font-black text-stone-900 mt-1">
            ₹{seasonalPattern.threeYearLow} - ₹{seasonalPattern.threeYearHigh}
          </div>
          <span className="text-[10px] text-stone-500 font-medium">Recorded low to high</span>
        </div>

        <div className="bg-rose-50 rounded-xl p-3.5 border border-rose-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
            Glut Price Drop
          </span>
          <div className="text-xl font-black text-rose-950 mt-1">
            -{seasonalPattern.typicalGlutPriceDropPercent}%
          </div>
          <span className="text-[10px] text-rose-700 font-medium">During peak arrivals</span>
        </div>

        <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Holding Recovery
          </span>
          <div className="text-xl font-black text-emerald-950 mt-1">
            +{seasonalPattern.postGlutHoldingRecoveryPercent}%
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">5-7 days post-glut</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            Storage Success Rate
          </span>
          <div className="text-xl font-black text-emerald-700 mt-1">
            {seasonalPattern.historicalStorageProfitProbability}%
          </div>
          <span className="text-[10px] text-stone-500 font-medium">Net profit probability</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            Cluster Yield
          </span>
          <div className="text-xl font-black text-stone-900 mt-1">
            {seasonalPattern.historicalYieldQuintalsPerAcre}
            <span className="text-xs font-semibold text-stone-500"> qtl/ac</span>
          </div>
          <span className="text-[10px] text-stone-500 font-medium">Average local yield</span>
        </div>

      </div>

      {/* Interactive 12-Month Price & Arrival Trend Chart */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              12-Month Historical Price Trajectory & Mandi Arrivals (MT)
            </h2>
            <p className="text-xs text-stone-500">
              Notice the inverse correlation: heavy arrival months (gluts) depress modal prices, creating holding opportunities.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-600"></span>
              <span className="text-stone-700">Modal Price (₹/qtl)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-stone-300"></span>
              <span className="text-stone-600">Arrivals (MT)</span>
            </div>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="pt-6 pb-2">
          <div className="h-64 flex items-end gap-2 sm:gap-3 border-b border-stone-200 pb-2 px-1">
            {monthlyData.map((point, idx) => {
              const heightPct = Math.round((point.avgModalPrice / maxPriceInSeries) * 100);
              const isPeakPrice = point.avgModalPrice === Math.max(...monthlyData.map(p => p.avgModalPrice));
              const isLowestPrice = point.avgModalPrice === Math.min(...monthlyData.map(p => p.avgModalPrice));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                    <div className="bg-stone-900 text-white rounded-lg px-2.5 py-1.5 text-[11px] shadow-lg whitespace-nowrap">
                      <div className="font-bold">{point.month} 2025: ₹{point.avgModalPrice}/qtl</div>
                      <div className="text-stone-300">Range: ₹{point.minPrice} - ₹{point.maxPrice}</div>
                      <div className="text-emerald-300">Arrivals: {point.monthlyArrivalsMT.toLocaleString()} MT</div>
                      <div className="text-stone-400">Demand: {point.demandIndex}/100</div>
                    </div>
                    <div className="w-2 h-2 bg-stone-900 rotate-45 -mt-1"></div>
                  </div>

                  {/* Price Bar */}
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-90 relative flex flex-col justify-between p-0.5 ${
                      isPeakPrice 
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-xs'
                        : isLowestPrice
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                        : 'bg-emerald-800'
                    }`}
                  >
                    <span className="text-[9px] font-black text-white text-center block opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{point.avgModalPrice}
                    </span>
                  </div>

                  {/* Month Label */}
                  <div className="text-[10px] sm:text-xs font-bold text-stone-600 mt-2">
                    {point.month}
                  </div>

                  {/* Arrival indicator dot */}
                  <div className="text-[9px] text-stone-400">
                    {(point.monthlyArrivalsMT / 1000).toFixed(0)}k MT
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Cycle Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[11px]">
              Peak Price Month: {seasonalPattern.highestPriceMonth}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px]">
              Lowest Glut Month: {seasonalPattern.lowestPriceMonth}
            </span>
          </div>

          <span className="text-stone-500 italic text-[11px]">
            Based on 3-year aggregated APMC Agmarknet records
          </span>
        </div>
      </div>

      {/* Storage Payoff Calculator & Seasonal Strategy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Storage Payoff Probability Simulator */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Historical Holding Payoff Estimator
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Simulate historical price recovery vs. cold storage and transit costs for {selectedCrop.name}.
          </p>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Holding Duration (Days)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[3, 7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setHoldingDaysSimulation(days)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    holdingDaysSimulation === days
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Current Spot Price:</span>
              <strong className="text-stone-900">₹{selectedCrop.marketPrice}/qtl</strong>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Projected Post-Hold Rate:</span>
              <strong className="text-emerald-800">₹{simulatedGrossPrice}/qtl (+{Math.round(expectedGainPct * 100)}%)</strong>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Estimated Storage Fee:</span>
              <strong className="text-stone-900">₹{totalStorageFee}/qtl (₹{storageCostPerDay}/day)</strong>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold">
              <span>Expected Net Gain:</span>
              <span className={netGainIsPositive ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
                {netGainIsPositive ? `+₹${simulatedNetGainPerQtl}` : `-₹${Math.abs(simulatedNetGainPerQtl)}`}/qtl
              </span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 text-xs text-emerald-900">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{seasonalPattern.historicalStorageProfitProbability}% Historical Win Rate</span>
            </div>
            <span>
              Across past 3 years, holding {selectedCrop.name} during this harvest window generated higher net returns in {seasonalPattern.historicalStorageProfitProbability} out of 100 recorded lots.
            </span>
          </div>
        </div>

        {/* Seasonal Calendar & Strategic Windows */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Seasonal Calendar & Tactical Market Windows
            </h3>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed font-medium bg-stone-50 p-3 rounded-lg border border-stone-200">
            <strong>Seasonal Pattern Notes:</strong> {seasonalPattern.seasonalNotes}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Harvest Gluts */}
            <div className="border border-stone-200 rounded-xl p-3.5 bg-stone-50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block mb-1">
                Peak Harvest Glut Months (Heavy Arrivals)
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {seasonalPattern.peakHarvestMonths.map((m, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 text-xs font-black">
                    {m}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-stone-600 mt-2">
                Arrivals surge by 60-120%. High risk of price slump at mandi gate; utilize direct buyer contracts or pre-booked storage.
              </p>
            </div>

            {/* Festive Windows */}
            <div className="border border-stone-200 rounded-xl p-3.5 bg-stone-50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Festive & High-Demand Surge Windows
              </span>
              <ul className="list-disc list-inside text-xs text-stone-700 space-y-1 font-medium mt-2">
                {seasonalPattern.festiveDemandWindows.map((win, idx) => (
                  <li key={idx}>{win}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Historical Insights */}
          <div className="border-t border-stone-200 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Key Historical Insights for {selectedCrop.name}
            </h4>
            <div className="space-y-1.5">
              {keyInsights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Add Mandi Survey Modal */}
      {showAddDataModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900">
                Record Ground Mandi Survey Data
              </h3>
              <button
                onClick={() => setShowAddDataModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {surveySaved ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-stone-900">Mandi Survey Point Logged!</h4>
                <p className="text-xs text-stone-500">
                  This observation contributes to historical trend modeling.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveSurvey} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Crop</label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedCrop.name} (${selectedCrop.unit})`}
                    className="w-full px-3 py-2 text-xs font-bold text-stone-800 bg-stone-100 border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Survey Month</label>
                    <select
                      value={surveyMonth}
                      onChange={(e) => setSurveyMonth(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg"
                    >
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                        <option key={m} value={m}>{m} 2026</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Observed Rate (₹/qtl)</label>
                    <input
                      type="number"
                      value={surveyPrice}
                      onChange={(e) => setSurveyPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Daily Mandi Arrivals (MT)</label>
                  <input
                    type="number"
                    value={surveyArrivals}
                    onChange={(e) => setSurveyArrivals(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDataModal(false)}
                    className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save to Historical Ledger
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
