import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  RefreshCw
} from 'lucide-react';
import { MarketPrice, CropInfo, LanguageCode } from '../types';
import { CROPS } from '../data/initialData';
import { TRANSLATIONS } from '../i18n/translations';

interface MarketDataViewProps {
  markets: MarketPrice[];
  selectedCrop: CropInfo;
  setSelectedCrop: (crop: CropInfo) => void;
  language: LanguageCode;
  onNavigateTab: (tab: string) => void;
}

export const MarketDataView: React.FC<MarketDataViewProps> = ({
  markets,
  selectedCrop,
  setSelectedCrop,
  language,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>(selectedCrop.id);
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'demand'>('price');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Filter and sort markets
  const filteredMarkets = markets
    .filter(m => {
      const matchesCrop = selectedCropFilter === 'all' || m.commodity === selectedCropFilter;
      const matchesDistance = m.distanceKm <= maxDistance;
      const matchesSearch = searchQuery === '' || 
        m.marketName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCrop && matchesDistance && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return b.modalPrice - a.modalPrice;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'demand') {
        const order = { High: 3, Moderate: 2, Low: 1 };
        return order[b.demandLevel] - order[a.demandLevel];
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {t.navMarkets} & Mandi Intelligence
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Verified ground prices from regional APMC yards, collection centers & terminal trading hubs.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>FPO Trust Layer Active: 100% On-Ground Verified</span>
          </div>
        </div>

        {/* Filter Controls Strip */}
        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Crop Filter */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Filter by Crop</label>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Crops</option>
              {CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {language === 'hi' ? c.hindiName : c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              Max Distance: {maxDistance} km
            </label>
            <input
              type="range"
              min={10}
              max={120}
              step={10}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Search by name */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Search Mandi</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search APMC or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="price">Highest Price First</option>
              <option value="distance">Nearest Distance First</option>
              <option value="demand">Highest Demand First</option>
            </select>
          </div>

        </div>
      </div>

      {/* Markets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMarkets.map((market) => {
          const cropObj = CROPS.find(c => c.id === market.commodity);
          return (
            <div 
              key={market.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span>{cropObj?.icon || '🌾'}</span>
                      <span>{cropObj?.name || market.commodity}</span>
                    </span>
                    <h3 className="text-base font-extrabold text-stone-900 mt-1">
                      {market.marketName}
                    </h3>
                  </div>

                  <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                    market.demandLevel === 'High' ? 'bg-emerald-100 text-emerald-800' :
                    market.demandLevel === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {market.demandLevel} Demand
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{market.district}, {market.state} • <strong>{market.distanceKm} km</strong></span>
                </div>

                {/* Price Display */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 mb-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-stone-500 uppercase font-semibold">Modal Price</span>
                      <div className="text-2xl font-black text-stone-900">
                        ₹{market.modalPrice.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-stone-500"> /qtl</span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1 font-bold text-xs ${
                      market.priceTrend === 'rising' ? 'text-emerald-700' :
                      market.priceTrend === 'falling' ? 'text-rose-700' : 'text-stone-500'
                    }`}>
                      {market.priceTrend === 'rising' && <TrendingUp className="w-4 h-4" />}
                      {market.priceTrend === 'falling' && <TrendingDown className="w-4 h-4" />}
                      {market.priceTrend === 'stable' && <Minus className="w-4 h-4" />}
                      <span>{market.trendPercent > 0 ? `+${market.trendPercent}%` : `${market.trendPercent}%`}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-200/60 flex justify-between text-xs text-stone-600">
                    <span>Min: ₹{market.minPrice}</span>
                    <span>Max: ₹{market.maxPrice}</span>
                    <span className="font-semibold text-stone-800">{market.buyerCount} Bidders</span>
                  </div>
                </div>

                {/* Trust Layer Strip */}
                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold text-emerald-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{market.verified ? 'Verified Ground Signal' : 'Unverified'}</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{market.reliabilityScore.toFixed(1)}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium">
                    Source: {market.dataSource} • {market.lastUpdated}
                  </p>
                  {market.verificationNote && (
                    <p className="text-[11px] text-emerald-800 italic">
                      "{market.verificationNote}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-100 flex gap-2">
                <button
                  onClick={() => {
                    if (cropObj) setSelectedCrop(cropObj);
                    onNavigateTab('calculator');
                  }}
                  className="flex-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Calculate Return
                </button>
                <button
                  onClick={() => onNavigateTab('transport')}
                  className="flex-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Book Transport
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
          <p className="text-sm font-semibold text-stone-600">No mandis found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCropFilter('all');
              setMaxDistance(120);
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
