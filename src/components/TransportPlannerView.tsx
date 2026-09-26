import React, { useState } from 'react';
import { 
  Truck, 
  Users, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  BadgePercent, 
  Plus, 
  X,
  ArrowRight,
  Star
} from 'lucide-react';
import { TransportOption, CropInfo, LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface TransportPlannerViewProps {
  transportOptions: TransportOption[];
  selectedCrop: CropInfo;
  harvestQuantity: number;
  language: LanguageCode;
  onJoinPool: (transportId: string, quantityToAdd: number) => void;
}

export const TransportPlannerView: React.FC<TransportPlannerViewProps> = ({
  transportOptions,
  selectedCrop,
  harvestQuantity,
  language,
  onJoinPool,
}) => {
  const [activePoolModal, setActivePoolModal] = useState<TransportOption | null>(null);
  const [poolQtyToAdd, setPoolQtyToAdd] = useState(Math.min(5, harvestQuantity));
  const [farmerPhone, setFarmerPhone] = useState('9845012345');
  const [isSuccess, setIsSuccess] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleOpenPoolModal = (vehicle: TransportOption) => {
    setActivePoolModal(vehicle);
    const spaceLeft = (vehicle.poolTargetQuintals || vehicle.capacityQuintals) - (vehicle.poolBookedQuintals || 0);
    setPoolQtyToAdd(Math.min(spaceLeft, harvestQuantity));
    setIsSuccess(false);
  };

  const handleConfirmJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePoolModal) return;

    onJoinPool(activePoolModal.id, poolQtyToAdd);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActivePoolModal(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-teal-100 text-teal-800">
                <Truck className="w-5 h-5 text-teal-700" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {t.navTransport} & Shared Pooling
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Combine produce lots with neighboring farmers to cut transit freight by 35%–45% or book solo vehicles.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
            <BadgePercent className="w-4 h-4 text-emerald-600" />
            <span>FPO Shared Logistics Subsidy Active</span>
          </div>
        </div>
      </div>

      {/* Featured: Active Shared Transport Pools */}
      <div className="bg-gradient-to-br from-teal-900 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-300" />
            <h2 className="text-base sm:text-lg font-black text-white">
              Active Village Shared Pools (Leaving Today)
            </h2>
          </div>
          <span className="text-xs bg-teal-800/70 text-teal-200 px-2.5 py-1 rounded-full font-bold">
            Group & Save Freight
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transportOptions.filter(t => t.poolActive).map(pool => {
            const booked = pool.poolBookedQuintals || 0;
            const target = pool.poolTargetQuintals || pool.capacityQuintals;
            const spaceLeft = Math.max(0, target - booked);
            const fillPercent = Math.min(100, Math.round((booked / target) * 100));

            return (
              <div key={pool.id} className="bg-teal-950/70 border border-teal-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-sm">
                        Route: {pool.poolRoute}
                      </span>
                      <h3 className="text-base font-black text-white mt-1">
                        {pool.vehicleType}
                      </h3>
                    </div>
                    <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-md">
                      Save {pool.poolSavingsPercent}%
                    </span>
                  </div>

                  {/* Pool Progress */}
                  <div className="my-3 space-y-1">
                    <div className="flex justify-between text-xs text-teal-200">
                      <span>Pool Space: <strong>{booked} / {target} Qtl Booked</strong></span>
                      <span className="text-emerald-300 font-bold">{spaceLeft} Qtl Open</span>
                    </div>
                    <div className="w-full h-2.5 bg-teal-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400 rounded-full transition-all"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-teal-300 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>Scheduled Departure: <strong className="text-white">{pool.poolDepartureTime}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      <span>Pickup: {pool.currentLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-teal-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-teal-300 block">Pooled Freight Rate:</span>
                    <span className="text-sm font-black text-white">₹{Math.round(pool.costPerKm * 1.8)} / Quintal</span>
                  </div>

                  <button
                    id={`join-pool-btn-${pool.id}`}
                    onClick={() => handleOpenPoolModal(pool)}
                    disabled={spaceLeft <= 0}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-emerald-950 font-extrabold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {spaceLeft > 0 ? t.joinPool : 'Pool Full'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Solo & On-Demand Vehicle Roster */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">
            All Available Vehicles & Drivers
          </h2>
          <span className="text-xs text-stone-500">Verified FPO Transporter Registry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {transportOptions.map(veh => (
            <div key={veh.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Truck className="w-3 h-3 text-teal-600" />
                      <span>{veh.vehicleType}</span>
                    </span>
                    <h3 className="text-base font-extrabold text-stone-900 mt-1">
                      {veh.driverName}
                    </h3>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{veh.trustScore.toFixed(1)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-stone-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Stationed: <strong>{veh.currentLocation}</strong></span>
                </div>

                {/* Rates & Capacity */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 mb-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Total Capacity:</span>
                    <span className="font-bold text-stone-900">{veh.capacityQuintals} Quintals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Base Fare:</span>
                    <span className="font-bold text-stone-900">₹{veh.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Running Rate:</span>
                    <span className="font-bold text-stone-900">₹{veh.costPerKm} / km</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1 mb-4">
                  <p>Slots: {veh.availableTimeSlots.join(', ')}</p>
                  <p className="text-emerald-800 font-semibold">✓ Verified by {veh.verifiedBy}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-100 flex gap-2">
                <a
                  href={`tel:${veh.phone}`}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>Call</span>
                </a>
                <button
                  onClick={() => handleOpenPoolModal(veh)}
                  className="flex-1 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Book Vehicle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Pool Modal */}
      {activePoolModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActivePoolModal(null)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-stone-900">Joined Vehicle Pool!</h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Your lot of {poolQtyToAdd} quintals has been reserved on {activePoolModal.vehicleType}. Driver {activePoolModal.driverName} ({activePoolModal.phone}) will call before departure.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmJoin} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-teal-100 text-teal-800">
                      <Truck className="w-4 h-4 text-teal-700" />
                    </span>
                    <h3 className="text-base font-extrabold text-stone-900">
                      Join Pool: {activePoolModal.vehicleType}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500">
                    Route: <strong>{activePoolModal.poolRoute || 'Village to Market'}</strong> • Departs: <strong>{activePoolModal.poolDepartureTime || 'Today'}</strong>
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Quantity to Load (Quintals)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={(activePoolModal.poolTargetQuintals || activePoolModal.capacityQuintals) - (activePoolModal.poolBookedQuintals || 0)}
                      required
                      value={poolQtyToAdd}
                      onChange={(e) => setPoolQtyToAdd(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
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
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Calculated Cost */}
                  <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-teal-900 font-bold block">Estimated Pooled Share:</span>
                      <span className="text-[11px] text-teal-700">Includes {activePoolModal.poolSavingsPercent || 35}% shared discount</span>
                    </div>
                    <span className="text-xl font-black text-teal-950">
                      ₹{Math.round(poolQtyToAdd * (activePoolModal.costPerKm * 1.8)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePoolModal(null)}
                    className="flex-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Confirm Pool Slot
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
