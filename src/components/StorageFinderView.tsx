import React, { useState } from 'react';
import { 
  Warehouse, 
  ShieldCheck, 
  Thermometer, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Star, 
  X,
  Snowflake,
  Calculator
} from 'lucide-react';
import { StorageFacility, CropInfo, LanguageCode } from '../types';
import { CROPS } from '../data/initialData';
import { TRANSLATIONS } from '../i18n/translations';

interface StorageFinderViewProps {
  storageFacilities: StorageFacility[];
  selectedCrop: CropInfo;
  harvestQuantity: number;
  language: LanguageCode;
}

export const StorageFinderView: React.FC<StorageFinderViewProps> = ({
  storageFacilities,
  selectedCrop,
  harvestQuantity,
  language,
}) => {
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>(selectedCrop.id);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [activeFacilityModal, setActiveFacilityModal] = useState<StorageFacility | null>(null);
  const [reserveDays, setReserveDays] = useState(5);
  const [reserveQty, setReserveQty] = useState(harvestQuantity);
  const [farmerPhone, setFarmerPhone] = useState('9845012345');
  const [isSuccess, setIsSuccess] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const filtered = storageFacilities.filter(s => {
    const matchesCrop = selectedCropFilter === 'all' || s.suitableCrops.includes(selectedCropFilter);
    const matchesType = selectedTypeFilter === 'all' || s.type === selectedTypeFilter;
    return matchesCrop && matchesType;
  });

  const handleOpenReserve = (facility: StorageFacility) => {
    setActiveFacilityModal(facility);
    setReserveQty(harvestQuantity);
    setReserveDays(5);
    setIsSuccess(false);
  };

  const calculatedCost = activeFacilityModal 
    ? Math.round(reserveQty * activeFacilityModal.pricePerDayPerQuintal * reserveDays)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveFacilityModal(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-purple-100 text-purple-800">
                <Warehouse className="w-5 h-5 text-purple-700" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {t.navStorage} & Cold Chain Finder
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Verified local cold storages and ventilated godowns with live available capacity to hold harvest safely.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Filter Crop:</label>
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Crops</option>
                {CROPS.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Type:</label>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Cold Storage">Cold Storage</option>
                <option value="Ventilated Godown">Ventilated Godown</option>
                <option value="Dry Warehouse">Dry Warehouse</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((facility) => {
          const percentAvailable = Math.round((facility.availableCapacityMT / facility.totalCapacityMT) * 100);

          return (
            <div 
              key={facility.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Snowflake className="w-3 h-3 text-purple-600" />
                      <span>{facility.type}</span>
                    </span>
                    <h3 className="text-base font-extrabold text-stone-900 mt-1.5">
                      {facility.facilityName}
                    </h3>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{facility.trustScore.toFixed(1)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-stone-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{facility.location} • <strong>{facility.distanceKm} km</strong></span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 mb-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>Available Capacity</span>
                    <span className="text-purple-700">{facility.availableCapacityMT} MT / {facility.totalCapacityMT} MT</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        percentAvailable > 30 ? 'bg-purple-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(8, percentAvailable))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500 pt-0.5">
                    <span>Rate: <strong>₹{facility.pricePerDayPerQuintal}/qtl/day</strong></span>
                    <span>Min: {facility.minHoldingDays} days</span>
                  </div>
                </div>

                {/* Specs */}
                <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-100 text-xs space-y-1 mb-4">
                  <div className="flex items-center gap-1.5 font-semibold text-purple-900">
                    <Thermometer className="w-3.5 h-3.5 text-purple-600" />
                    <span>{facility.temperatureControl} • Humidity: {facility.humidityControl}</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Crops: {facility.suitableCrops.join(', ')}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold">
                    ✓ Verified by {facility.verifiedBy}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-100 flex gap-2">
                <a
                  href={`tel:${facility.phone}`}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>Call</span>
                </a>
                <button
                  id={`reserve-storage-${facility.id}`}
                  onClick={() => handleOpenReserve(facility)}
                  className="flex-1 px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Reserve Space
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Storage Reservation Modal */}
      {activeFacilityModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveFacilityModal(null)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-stone-900">Space Reserved!</h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Your reservation slot at {activeFacilityModal.facilityName} has been booked. Operator contact: {activeFacilityModal.phone}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-purple-100 text-purple-800">
                      <Warehouse className="w-4 h-4 text-purple-700" />
                    </span>
                    <h3 className="text-base font-extrabold text-stone-900">
                      Reserve at {activeFacilityModal.facilityName}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500">
                    Rate: <strong>₹{activeFacilityModal.pricePerDayPerQuintal}/quintal/day</strong>
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">
                        Quantity to Store (Qtl)
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={reserveQty}
                        onChange={(e) => setReserveQty(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">
                        Holding Duration (Days)
                      </label>
                      <input
                        type="number"
                        min={activeFacilityModal.minHoldingDays}
                        max={activeFacilityModal.maxHoldingDays}
                        required
                        value={reserveDays}
                        onChange={(e) => setReserveDays(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Farmer Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Calculated Cost Box */}
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-purple-900 font-bold block">Estimated Total Storage Fee:</span>
                      <span className="text-[11px] text-purple-700">{reserveQty} Qtl × ₹{activeFacilityModal.pricePerDayPerQuintal} × {reserveDays} days</span>
                    </div>
                    <span className="text-xl font-black text-purple-950">
                      ₹{calculatedCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveFacilityModal(null)}
                    className="flex-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Confirm Reservation
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
