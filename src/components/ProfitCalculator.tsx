import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Warehouse, 
  Truck, 
  Coins,
  Scale,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { CropInfo, LanguageCode } from '../types';
import { CROPS } from '../data/initialData';
import { TRANSLATIONS } from '../i18n/translations';

interface ProfitCalculatorProps {
  selectedCrop: CropInfo;
  setSelectedCrop: (crop: CropInfo) => void;
  harvestQuantity: number;
  setHarvestQuantity: (qty: number) => void;
  language: LanguageCode;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  selectedCrop,
  setSelectedCrop,
  harvestQuantity,
  setHarvestQuantity,
  language,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Form states
  const [sellingPrice, setSellingPrice] = useState(selectedCrop.benchmarkPrice);
  const [transportCost, setTransportCost] = useState(harvestQuantity * 35);
  const [storageDays, setStorageDays] = useState(0);
  const [storageRatePerDay, setStorageRatePerDay] = useState(2.2);
  const [otherExpenses, setOtherExpenses] = useState(harvestQuantity * 25); // crates, labor, cess

  // Sync selling price when crop changes
  useEffect(() => {
    setSellingPrice(selectedCrop.benchmarkPrice);
    setTransportCost(harvestQuantity * 35);
    setOtherExpenses(harvestQuantity * 25);
  }, [selectedCrop, harvestQuantity]);

  // Derived calculations
  const totalStorageCost = Math.round(harvestQuantity * storageRatePerDay * storageDays);
  const expectedRevenue = Math.round(harvestQuantity * sellingPrice);
  const totalDeductions = Math.round(transportCost + totalStorageCost + otherExpenses);
  const expectedNetProfit = expectedRevenue - totalDeductions;
  const netPerQuintal = harvestQuantity > 0 ? Math.round(expectedNetProfit / harvestQuantity) : 0;
  const marginPercent = expectedRevenue > 0 ? Math.round((expectedNetProfit / expectedRevenue) * 100) : 0;

  // Comparison Options Models
  // Option 1: Sell Today Locally (No storage, local transport)
  const opt1Revenue = harvestQuantity * selectedCrop.benchmarkPrice;
  const opt1Transport = harvestQuantity * 25; // local haat / nearby APMC
  const opt1Storage = 0;
  const opt1Other = harvestQuantity * 20;
  const opt1Net = opt1Revenue - opt1Transport - opt1Storage - opt1Other;

  // Option 2: Store 5 Days in Cold Storage (Uplift ~12%, storage fee, subsequent transport)
  const opt2Price = Math.round(selectedCrop.benchmarkPrice * 1.12);
  const opt2Revenue = harvestQuantity * opt2Price;
  const opt2Storage = Math.round(harvestQuantity * 2.2 * 5);
  const opt2Transport = harvestQuantity * 35;
  const opt2Other = harvestQuantity * 25;
  const opt2Net = opt2Revenue - opt2Transport - opt2Storage - opt2Other;

  // Option 3: Send to Distant Terminal Market via Shared Pool (+₹350/qtl price, pooled transport ₹60/qtl)
  const opt3Price = selectedCrop.benchmarkPrice + 350;
  const opt3Revenue = harvestQuantity * opt3Price;
  const opt3Transport = harvestQuantity * 60; // pooled rate
  const opt3Storage = 0;
  const opt3Other = harvestQuantity * 30;
  const opt3Net = opt3Revenue - opt3Transport - opt3Storage - opt3Other;

  const bestOption = Math.max(opt1Net, opt2Net, opt3Net);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">
              {t.calcTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              {t.calcSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Calculator Inputs + Real-Time Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Calculator Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">
            Enter Harvest & Cost Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Crop
              </label>
              <select
                value={selectedCrop.id}
                onChange={(e) => {
                  const c = CROPS.find(crop => crop.id === e.target.value);
                  if (c) setSelectedCrop(c);
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {CROPS.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {language === 'hi' ? c.hindiName : c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="calc-quantity-input" className="block text-xs font-bold text-stone-600 mb-1">
                Quantity ({selectedCrop.unit})
              </label>
              <input
                id="calc-quantity-input"
                type="number"
                min={1}
                value={harvestQuantity}
                onChange={(e) => setHarvestQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Selling Price */}
            <div>
              <label htmlFor="calc-selling-price-input" className="block text-xs font-bold text-stone-600 mb-1">
                {t.sellingPrice}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-stone-500 font-bold">₹</span>
                <input
                  id="calc-selling-price-input"
                  type="number"
                  min={100}
                  step={50}
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Current Benchmark: ₹{selectedCrop.benchmarkPrice}/qtl
              </span>
            </div>

            {/* Transportation Cost */}
            <div>
              <label htmlFor="calc-transport-cost-input" className="block text-xs font-bold text-stone-600 mb-1">
                {t.transportCost}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-stone-500 font-bold">₹</span>
                <input
                  id="calc-transport-cost-input"
                  type="number"
                  min={0}
                  value={transportCost}
                  onChange={(e) => setTransportCost(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Approx ₹{Math.round(transportCost / (harvestQuantity || 1))}/qtl
              </span>
            </div>

            {/* Storage Days & Cost */}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Storage Duration
              </label>
              <select
                value={storageDays}
                onChange={(e) => setStorageDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value={0}>0 Days (Sell Today - No Storage)</option>
                <option value={3}>3 Days (₹{Math.round(harvestQuantity * storageRatePerDay * 3)})</option>
                <option value={5}>5 Days (₹{Math.round(harvestQuantity * storageRatePerDay * 5)})</option>
                <option value={7}>7 Days (₹{Math.round(harvestQuantity * storageRatePerDay * 7)})</option>
                <option value={14}>14 Days (₹{Math.round(harvestQuantity * storageRatePerDay * 14)})</option>
              </select>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Rate: ₹{storageRatePerDay}/qtl/day
              </span>
            </div>

            {/* Other Expenses */}
            <div>
              <label htmlFor="calc-other-expenses-input" className="block text-xs font-bold text-stone-600 mb-1">
                {t.otherExpenses}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-stone-500 font-bold">₹</span>
                <input
                  id="calc-other-expenses-input"
                  type="number"
                  min={0}
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Labor, plastic crates, unloading, APMC cess
              </span>
            </div>

          </div>

          {/* Quick preset buttons for instant testing */}
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-500">Presets:</span>
            <button
              onClick={() => {
                setTransportCost(0); // buyer picks up
                setStorageDays(0);
                setSellingPrice(selectedCrop.benchmarkPrice + 100);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
            >
              Farmgate Buyer Pickup
            </button>
            <button
              onClick={() => {
                setTransportCost(harvestQuantity * 30);
                setStorageDays(5);
                setSellingPrice(Math.round(selectedCrop.benchmarkPrice * 1.15));
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 cursor-pointer"
            >
              Cold Storage 5 Days
            </button>
            <button
              onClick={() => {
                setTransportCost(harvestQuantity * 55);
                setStorageDays(0);
                setSellingPrice(selectedCrop.benchmarkPrice + 350);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 cursor-pointer"
            >
              Distant Terminal Market
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Clear Real-Time Net Profit Result Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Calculated Return
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-semibold">
                {marginPercent}% Net Margin
              </span>
            </div>

            {/* Expected Revenue */}
            <div className="mt-4">
              <span className="text-xs text-emerald-200 uppercase font-semibold">
                {t.expectedRevenue} (Quantity × Price)
              </span>
              <div className="text-xl font-bold text-white mt-0.5">
                ₹{expectedRevenue.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Cost Breakdown Accordion/List */}
            <div className="mt-4 p-3.5 bg-emerald-950/60 rounded-xl border border-emerald-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-emerald-200">
                <span>Transportation:</span>
                <span className="font-semibold text-rose-300">− ₹{transportCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Storage ({storageDays} days):</span>
                <span className="font-semibold text-rose-300">− ₹{totalStorageCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Packaging & Mandi Fee:</span>
                <span className="font-semibold text-rose-300">− ₹{otherExpenses.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-emerald-800/80 flex justify-between font-bold text-emerald-100">
                <span>Total Deductions:</span>
                <span className="text-rose-300">− ₹{totalDeductions.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Huge Net Profit Indicator */}
            <div className="mt-6 pt-4 border-t border-emerald-800">
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">
                {t.expectedNetProfit} (Take-Home)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300 mt-1">
                ₹{expectedNetProfit.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Yields <strong>₹{netPerQuintal.toLocaleString('en-IN')}</strong> per quintal net in your bank account.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-emerald-800/80 text-[11px] text-emerald-300/80">
            Formula: Net Profit = (Quantity × Price) − (Transport + Storage + Fees)
          </div>
        </div>

      </div>

      {/* Side-by-Side Comparison of 3 Selling Routes */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-black text-stone-900">
              {t.compareOptions} ({harvestQuantity} Quintals {selectedCrop.name})
            </h2>
            <p className="text-xs text-stone-500">
              Compare take-home returns side-by-side to make the most profitable decision.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal Strategy Highlighted</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Option 1: Sell Today Locally */}
          <div className={`rounded-xl p-4 border transition-all ${
            opt1Net === bestOption
              ? 'bg-emerald-50/60 border-2 border-emerald-500 shadow-xs ring-2 ring-emerald-200'
              : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Option A: Sell Today Locally
              </span>
              {opt1Net === bestOption && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase">
                  Best Return
                </span>
              )}
            </div>
            <div className="text-2xl font-black text-stone-900">
              ₹{opt1Net.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-600 mt-1">
              ₹{Math.round(opt1Net / harvestQuantity)}/qtl net at ₹{selectedCrop.benchmarkPrice}/qtl
            </p>

            <div className="mt-3 pt-3 border-t border-stone-200 space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Gross Revenue:</span>
                <span className="font-semibold text-stone-900">₹{opt1Revenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport & Handling:</span>
                <span className="text-rose-600">− ₹{(opt1Transport + opt1Other).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Cost:</span>
                <span>₹0</span>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] font-semibold text-emerald-800">
              Zero storage risk, immediate cash liquidity.
            </div>
          </div>

          {/* Option 2: Store 5 Days */}
          <div className={`rounded-xl p-4 border transition-all ${
            opt2Net === bestOption
              ? 'bg-emerald-50/60 border-2 border-emerald-500 shadow-xs ring-2 ring-emerald-200'
              : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Option B: Cold Storage (5 Days)
              </span>
              {opt2Net === bestOption && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase">
                  Best Return
                </span>
              )}
            </div>
            <div className="text-2xl font-black text-stone-900">
              ₹{opt2Net.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-600 mt-1">
              ₹{Math.round(opt2Net / harvestQuantity)}/qtl net at ₹{opt2Price}/qtl (+12%)
            </p>

            <div className="mt-3 pt-3 border-t border-stone-200 space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Gross Revenue:</span>
                <span className="font-semibold text-stone-900">₹{opt2Revenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Fee (5 days):</span>
                <span className="text-rose-600">− ₹{opt2Storage.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport & Handling:</span>
                <span className="text-rose-600">− ₹{(opt2Transport + opt2Other).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] font-semibold text-amber-800">
              {opt2Net > opt1Net ? `Earns +₹${(opt2Net - opt1Net).toLocaleString('en-IN')} more than selling today.` : 'Storage fees exceed price gain for this crop.'}
            </div>
          </div>

          {/* Option 3: Distant Market with Shared Pool */}
          <div className={`rounded-xl p-4 border transition-all ${
            opt3Net === bestOption
              ? 'bg-emerald-50/60 border-2 border-emerald-500 shadow-xs ring-2 ring-emerald-200'
              : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Option C: Distant City Terminal
              </span>
              {opt3Net === bestOption && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase">
                  Best Return
                </span>
              )}
            </div>
            <div className="text-2xl font-black text-stone-900">
              ₹{opt3Net.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-600 mt-1">
              ₹{Math.round(opt3Net / harvestQuantity)}/qtl net at ₹{opt3Price}/qtl (+₹350)
            </p>

            <div className="mt-3 pt-3 border-t border-stone-200 space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Gross Revenue:</span>
                <span className="font-semibold text-stone-900">₹{opt3Revenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Pooled Freight (38% off):</span>
                <span className="text-rose-600">− ₹{opt3Transport.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Transit Handling:</span>
                <span className="text-rose-600">− ₹{opt3Other.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] font-semibold text-purple-800">
              {opt3Net > opt1Net ? `Earns +₹${(opt3Net - opt1Net).toLocaleString('en-IN')} more via higher city demand!` : 'High transit cost dampens city price gain.'}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
