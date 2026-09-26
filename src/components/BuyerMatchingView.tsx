import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Filter, 
  Sparkles,
  Building
} from 'lucide-react';
import { BuyerOrder, CropInfo, LanguageCode } from '../types';
import { CROPS } from '../data/initialData';
import { TRANSLATIONS } from '../i18n/translations';

interface BuyerMatchingViewProps {
  buyers: BuyerOrder[];
  selectedCrop: CropInfo;
  setSelectedCrop: (crop: CropInfo) => void;
  harvestQuantity: number;
  language: LanguageCode;
  onSubmitSellRequest: (request: any) => void;
}

export const BuyerMatchingView: React.FC<BuyerMatchingViewProps> = ({
  buyers,
  selectedCrop,
  setSelectedCrop,
  harvestQuantity,
  language,
  onSubmitSellRequest,
}) => {
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>(selectedCrop.id);
  const [activeModalBuyer, setActiveModalBuyer] = useState<BuyerOrder | null>(null);
  const [farmerPhone, setFarmerPhone] = useState('9845012345');
  const [farmerName, setFarmerName] = useState('Rajendra Gowda');
  const [farmerVillage, setFarmerVillage] = useState('Mulbagal, Kolar');
  const [offerQty, setOfferQty] = useState(harvestQuantity);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const filteredBuyers = buyers.filter(b => {
    return selectedCropFilter === 'all' || b.commodity === selectedCropFilter;
  });

  const handleOpenModal = (buyer: BuyerOrder) => {
    setActiveModalBuyer(buyer);
    setOfferQty(Math.min(harvestQuantity, buyer.requiredQuantityQuintals));
    setRequestSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalBuyer) return;

    onSubmitSellRequest({
      farmerName,
      farmerPhone,
      village: farmerVillage,
      crop: activeModalBuyer.commodity,
      quantity: offerQty,
      buyerId: activeModalBuyer.id,
      buyerName: activeModalBuyer.buyerName,
      offeredPrice: activeModalBuyer.offeredPrice,
      totalValue: offerQty * activeModalBuyer.offeredPrice,
      timestamp: new Date().toISOString(),
    });

    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setActiveModalBuyer(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-blue-100 text-blue-800">
                <Users className="w-5 h-5 text-blue-700" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {t.navBuyers} & Direct Farmgate Bids
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Connect directly with verified corporate buyers, processing units, retail chains & FPO bulk aggregators.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Filter Crop:</span>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Crops</option>
              {CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBuyers.map((buyer) => {
          const cropObj = CROPS.find(c => c.id === buyer.commodity);
          const priceDiff = buyer.offeredPrice - (cropObj?.benchmarkPrice || 0);

          return (
            <div 
              key={buyer.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <span>{cropObj?.icon || '🌾'}</span>
                        <span>{cropObj?.name || buyer.commodity}</span>
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        {buyer.requiredGrade}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900 mt-1.5">
                      {buyer.buyerName}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {buyer.company}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{buyer.trustScore.toFixed(1)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-stone-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{buyer.location} • <strong>{buyer.distanceKm} km</strong></span>
                </div>

                {/* Offer Price Box */}
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 mb-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-blue-900 uppercase font-bold tracking-wider">
                        Firm Offered Price
                      </span>
                      <div className="text-2xl font-black text-blue-950">
                        ₹{buyer.offeredPrice.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-stone-600"> /qtl</span>
                      </div>
                    </div>

                    {priceDiff !== 0 && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        priceDiff > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {priceDiff > 0 ? `+₹${priceDiff} vs mandi` : `${priceDiff} vs mandi`}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs text-stone-700">
                    <span>Demand: <strong>{buyer.requiredQuantityQuintals} Qtl</strong></span>
                    <span className="text-stone-500 font-medium">{buyer.pickupType}</span>
                  </div>
                </div>

                {/* Payment Terms & Verification */}
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold text-stone-800">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{buyer.paymentTerms}</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{buyer.verified ? 'Verified Buyer' : 'Pending'}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Expiry: {new Date(buyer.validUntil).toLocaleDateString()} • Verified by FPO Desk
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-100 flex gap-2">
                <a
                  href={`tel:${buyer.phone}`}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>Call</span>
                </a>
                <button
                  id={`sell-to-buyer-${buyer.id}`}
                  onClick={() => handleOpenModal(buyer)}
                  className="flex-1 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Send Sell Request
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Direct Sell Request Modal */}
      {activeModalBuyer && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveModalBuyer(null)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {requestSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-stone-900">Sell Request Sent!</h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  {activeModalBuyer.buyerName} from {activeModalBuyer.company} has received your lot offer. FPO Steward has been notified for gate pass verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-blue-100 text-blue-800">
                      <Users className="w-4 h-4 text-blue-700" />
                    </span>
                    <h3 className="text-base font-extrabold text-stone-900">
                      Sell to {activeModalBuyer.buyerName}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500">
                    Firm Rate: <strong>₹{activeModalBuyer.offeredPrice}/qtl</strong> • Payment: <strong>{activeModalBuyer.paymentTerms}</strong>
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Farmer Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">
                        Quantity to Sell (Qtl)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={activeModalBuyer.requiredQuantityQuintals}
                        required
                        value={offerQty}
                        onChange={(e) => setOfferQty(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Village / Farm Location
                    </label>
                    <input
                      type="text"
                      required
                      value={farmerVillage}
                      onChange={(e) => setFarmerVillage(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Calculated Value */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Total Transaction Value:</span>
                    <span className="text-lg font-black text-emerald-900">
                      ₹{(offerQty * activeModalBuyer.offeredPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalBuyer(null)}
                    className="flex-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Confirm Sell Request
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
