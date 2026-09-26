import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  PhoneCall, 
  TrendingUp, 
  Warehouse, 
  Truck, 
  Volume2, 
  VolumeX, 
  X,
  History,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  MarketPrice, 
  BuyerOrder, 
  StorageFacility, 
  TransportOption, 
  BroadcastMessage, 
  FarmerSellRequest,
  LanguageCode,
  CropInfo
} from '../types';
import { CROPS } from '../data/initialData';
import { TRANSLATIONS } from '../i18n/translations';
import { speakText, stopSpeaking, isSpeaking } from '../services/speechService';

interface FpoStewardDashboardProps {
  markets: MarketPrice[];
  buyers: BuyerOrder[];
  storage: StorageFacility[];
  transport: TransportOption[];
  farmerRequests: FarmerSellRequest[];
  broadcasts: BroadcastMessage[];
  selectedCrop: CropInfo;
  language: LanguageCode;
  onVerifySignal: (type: 'market' | 'buyer' | 'storage' | 'transport', id: string) => void;
  onFlagSignal: (type: 'market' | 'buyer' | 'storage' | 'transport', id: string) => void;
  onAddBuyerOrder: (order: Partial<BuyerOrder>) => void;
  onAddStorageFacility: (storage: Partial<StorageFacility>) => void;
  onAddTransportOption: (transport: Partial<TransportOption>) => void;
  onSendBroadcast: (broadcast: Omit<BroadcastMessage, 'id' | 'sentAt'>) => void;
  onUpdateFarmerRequestStatus: (requestId: string, status: any) => void;
}

export const FpoStewardDashboard: React.FC<FpoStewardDashboardProps> = ({
  markets,
  buyers,
  storage,
  transport,
  farmerRequests,
  broadcasts,
  selectedCrop,
  language,
  onVerifySignal,
  onFlagSignal,
  onAddBuyerOrder,
  onAddStorageFacility,
  onAddTransportOption,
  onSendBroadcast,
  onUpdateFarmerRequestStatus,
}) => {
  const [activeSection, setActiveSection] = useState<'broadcast' | 'verify' | 'add' | 'requests'>('broadcast');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Broadcast Form State
  const [broadcastTarget, setBroadcastTarget] = useState('All Tomato Farmers (42 registered)');
  const [broadcastChannel, setBroadcastChannel] = useState<'whatsapp' | 'sms' | 'ivr'>('whatsapp');
  const [broadcastCrop, setBroadcastCrop] = useState(selectedCrop.id);
  const [broadcastContent, setBroadcastContent] = useState(
    `🌾 AgriSignal FPO Update:\nFreshBazaar is paying ₹2,150/qtl for Grade A Tomato at farmgate today (+₹200 over local mandi). 1 shared truck departing at 3:30 PM with 6 qtl space open. Contact FPO hub to lock lot.`
  );
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [isSimulatingIvr, setIsSimulatingIvr] = useState(false);

  // Add Buyer Order Form State
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerCompany, setNewBuyerCompany] = useState('');
  const [newBuyerPrice, setNewBuyerPrice] = useState(2000);
  const [newBuyerQty, setNewBuyerQty] = useState(50);
  const [newBuyerCrop, setNewBuyerCrop] = useState(selectedCrop.id);
  const [newBuyerTerms, setNewBuyerTerms] = useState('Immediate Cash at Weighment');
  const [addBuyerSuccess, setAddBuyerSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    onSendBroadcast({
      targetGroup: broadcastTarget,
      channel: broadcastChannel,
      cropId: broadcastCrop,
      messageTitle: `Urgent Market Signal for ${broadcastCrop.toUpperCase()}`,
      content: broadcastContent,
      author: 'FPO Data Steward (Kolar Hub)',
      recipientCount: broadcastTarget.includes('42') ? 42 : broadcastTarget.includes('28') ? 28 : 185,
    });
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const handleSimulateIvrVoice = () => {
    if (isSimulatingIvr) {
      stopSpeaking();
      setIsSimulatingIvr(false);
    } else {
      const started = speakText(broadcastContent, language);
      if (started) {
        setIsSimulatingIvr(true);
        const timer = setInterval(() => {
          if (!isSpeaking()) {
            setIsSimulatingIvr(false);
            clearInterval(timer);
          }
        }, 800);
      }
    }
  };

  const handleCreateBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuyerName || !newBuyerCompany) return;

    onAddBuyerOrder({
      buyerName: newBuyerName,
      company: newBuyerCompany,
      commodity: newBuyerCrop as any,
      requiredQuantityQuintals: newBuyerQty,
      offeredPrice: newBuyerPrice,
      requiredGrade: 'Grade A (Premium)',
      location: 'Kolar Agro Park',
      distanceKm: 12,
      phone: '+91 98450 77112',
      paymentTerms: newBuyerTerms,
      pickupType: 'Farmgate Pickup',
      validUntil: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      verified: true,
      verifiedBy: 'FPO Lead Officer',
      trustScore: 4.8,
      status: 'active',
    });

    setAddBuyerSuccess(true);
    setNewBuyerName('');
    setNewBuyerCompany('');
    setTimeout(() => setAddBuyerSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {t.stewardTitle}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-medium">
              {t.stewardSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-950/80 px-3.5 py-2 rounded-xl border border-amber-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-amber-200">185 Active Village Farmers Connected</span>
          </div>
        </div>

        {/* Steward Sub-tabs */}
        <div className="mt-5 pt-4 border-t border-amber-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSection('broadcast')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'broadcast'
                ? 'bg-amber-500 text-amber-950 shadow-xs'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
            }`}
          >
            📢 Farmer Broadcast Center
          </button>
          <button
            onClick={() => setActiveSection('verify')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'verify'
                ? 'bg-amber-500 text-amber-950 shadow-xs'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
            }`}
          >
            🛡️ Trust Layer & Verification
          </button>
          <button
            onClick={() => setActiveSection('requests')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
              activeSection === 'requests'
                ? 'bg-amber-500 text-amber-950 shadow-xs'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
            }`}
          >
            📥 Farmer Requests ({farmerRequests.length})
          </button>
          <button
            onClick={() => setActiveSection('add')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'add'
                ? 'bg-amber-500 text-amber-950 shadow-xs'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
            }`}
          >
            ➕ Add Market Signals
          </button>
        </div>
      </div>

      {/* SECTION 1: BROADCAST CENTER */}
      {activeSection === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 7 cols: Broadcast Compose Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-stone-900">
                Broadcast Post-Harvest Advisory to Farmers
              </h2>
              <p className="text-xs text-stone-500">
                Push trusted decision signals via WhatsApp, SMS, or automated voice calls.
              </p>
            </div>

            {broadcastSuccess && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Broadcast dispatched successfully to {broadcastTarget}!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Target Group</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm font-semibold bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="All Tomato Farmers (42 registered)">All Tomato Farmers (42 registered)</option>
                    <option value="Potato & Onion Cluster (28 registered)">Potato & Onion Cluster (28 registered)</option>
                    <option value="All Village Farmers (185 registered)">All Village Farmers (185 registered)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Channel Mode</label>
                  <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setBroadcastChannel('whatsapp')}
                      className={`py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        broadcastChannel === 'whatsapp' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
                      }`}
                    >
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastChannel('sms')}
                      className={`py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        broadcastChannel === 'sms' ? 'bg-white text-amber-800 shadow-xs' : 'text-stone-600'
                      }`}
                    >
                      SMS
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastChannel('ivr')}
                      className={`py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        broadcastChannel === 'ivr' ? 'bg-white text-purple-800 shadow-xs' : 'text-stone-600'
                      }`}
                    >
                      Voice Call
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Advisory Message Body ({broadcastContent.length} chars)
                </label>
                <textarea
                  rows={5}
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-medium bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Quick Template Fillers */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-stone-500 font-bold">Templates:</span>
                <button
                  type="button"
                  onClick={() => setBroadcastContent(`🌾 AgriSignal Alert: Bangalore APMC tomato price jumped to ₹2,350/qtl (+18%). FPO shared truck leaves Kolar at 3:30 PM. 6 quintals room available. Call 9845012345 to book.`)}
                  className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-semibold cursor-pointer"
                >
                  Price Surge
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastContent(`❄️ AgriSignal Storage: Local mandi arrivals heavy. Kolar Cold Chain has 65 MT open at ₹2.2/qtl/day. Recommend storing 3 days to avoid price slump.`)}
                  className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-semibold cursor-pointer"
                >
                  Glut & Cold Chain
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastContent(`🤝 FreshBazaar buyer verified at Kolar Hub: Immediate payment ₹2,150/qtl at farmgate. Bring produce to center before 4:00 PM.`)}
                  className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-semibold cursor-pointer"
                >
                  Buyer Match
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSimulateIvrVoice}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    isSimulatingIvr ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {isSimulatingIvr ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                      <span>Stop Voice Simulation</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Simulate Audio Voice (TTS)</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right 5 cols: Live Device Phone Preview */}
          <div className="lg:col-span-5 bg-stone-100 rounded-2xl p-5 border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Live Farmer Device Simulation
              </span>

              {/* Smartphone Frame */}
              <div className="bg-stone-900 text-white rounded-3xl p-4 shadow-xl border-4 border-stone-800 max-w-xs mx-auto">
                <div className="flex items-center justify-between text-[10px] text-stone-400 pb-2 mb-2 border-b border-stone-800">
                  <span>9:41 AM</span>
                  <span className="font-bold">AgriSignal Hub</span>
                  <span>4G • 92%</span>
                </div>

                {broadcastChannel === 'whatsapp' && (
                  <div className="bg-[#0b141a] p-3 rounded-2xl min-h-[220px] flex flex-col justify-end space-y-2">
                    <div className="bg-[#005c4b] text-white p-3 rounded-xl text-xs rounded-br-xs shadow-xs font-sans whitespace-pre-wrap leading-relaxed">
                      {broadcastContent}
                      <div className="text-[9px] text-emerald-200 text-right mt-1 font-mono">
                        09:41 AM ✓✓
                      </div>
                    </div>
                  </div>
                )}

                {broadcastChannel === 'sms' && (
                  <div className="bg-stone-800 p-3 rounded-2xl min-h-[220px] flex flex-col justify-end space-y-2">
                    <div className="bg-blue-600 text-white p-3 rounded-xl text-xs rounded-bl-xs shadow-xs whitespace-pre-wrap">
                      {broadcastContent}
                    </div>
                  </div>
                )}

                {broadcastChannel === 'ivr' && (
                  <div className="bg-purple-950 p-4 rounded-2xl min-h-[220px] flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-800 text-purple-200 rounded-full flex items-center justify-center animate-pulse">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Incoming AgriSignal Voice Call</h4>
                      <p className="text-[10px] text-purple-300">Speaking in {language.toUpperCase()}</p>
                    </div>
                    <button
                      onClick={handleSimulateIvrVoice}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold"
                    >
                      {isSimulatingIvr ? 'Call in Progress...' : 'Listen to Call'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-500 text-center">
              Target: <strong>{broadcastTarget}</strong> • Mode: <strong>{broadcastChannel.toUpperCase()}</strong>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: TRUST LAYER & VERIFICATION */}
      {activeSection === 'verify' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-black text-stone-900">
              Ground Truth Verification Console
            </h2>
            <p className="text-xs text-stone-500">
              Review market price feeds, buyer bids, and storage capacities. Verified items carry high trust ratings.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
              <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Signal / Entity</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Reported Rate / Space</th>
                  <th className="p-3">Last Verified</th>
                  <th className="p-3">Trust Score</th>
                  <th className="p-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {/* Markets */}
                {markets.map(m => (
                  <tr key={m.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-stone-900">
                      {m.marketName} ({m.commodity})
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        APMC Price
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-stone-800">
                      ₹{m.modalPrice}/qtl ({m.buyerCount} bidders)
                    </td>
                    <td className="p-3 text-stone-500">{m.lastUpdated}</td>
                    <td className="p-3 font-bold text-amber-700">{m.reliabilityScore.toFixed(1)} ★</td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => onVerifySignal('market', m.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold cursor-pointer"
                      >
                        ✓ Verify Ground
                      </button>
                      <button
                        onClick={() => onFlagSignal('market', m.id)}
                        className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-md font-bold cursor-pointer"
                      >
                        Flag Stale
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Buyers */}
                {buyers.map(b => (
                  <tr key={b.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-stone-900">
                      {b.buyerName} - {b.company} ({b.commodity})
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                        Buyer Bid
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-stone-800">
                      ₹{b.offeredPrice}/qtl ({b.requiredQuantityQuintals} qtl)
                    </td>
                    <td className="p-3 text-stone-500">{b.verifiedBy}</td>
                    <td className="p-3 font-bold text-amber-700">{b.trustScore.toFixed(1)} ★</td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => onVerifySignal('buyer', b.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold cursor-pointer"
                      >
                        ✓ Confirm Bid
                      </button>
                      <button
                        onClick={() => onFlagSignal('buyer', b.id)}
                        className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-md font-bold cursor-pointer"
                      >
                        Flag
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: INCOMING FARMER REQUESTS */}
      {activeSection === 'requests' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-black text-stone-900">
              Incoming Farmer Sell Requests & Transport Tickets
            </h2>
            <p className="text-xs text-stone-500">
              Farmers requesting buyer matching or pooled transit assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmerRequests.map(req => (
              <div key={req.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{req.farmerName}</h3>
                    <p className="text-xs text-stone-500">{req.village} • {req.farmerPhone}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    req.status === 'dispatched' ? 'bg-emerald-100 text-emerald-800' :
                    req.status === 'matched' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-stone-700 font-medium">
                  Offering: <strong>{req.quantity} Quintals {req.crop}</strong> to <strong>{req.buyerName}</strong>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
                  <span>Value: ₹{req.totalValue.toLocaleString('en-IN')}</span>
                  <span>{new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onUpdateFarmerRequestStatus(req.id, 'matched')}
                    className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-md"
                  >
                    Mark Matched
                  </button>
                  <button
                    onClick={() => onUpdateFarmerRequestStatus(req.id, 'dispatched')}
                    className="flex-1 px-2 py-1 bg-emerald-600 text-white text-xs font-bold rounded-md"
                  >
                    Mark Dispatched
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: ADD NEW MARKET SIGNALS */}
      {activeSection === 'add' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4 max-w-2xl">
          <div>
            <h2 className="text-base font-black text-stone-900">
              Register New Buyer Procurement Bid
            </h2>
            <p className="text-xs text-stone-500">
              Verified bids become instantly visible to local farmers on their dashboard.
            </p>
          </div>

          {addBuyerSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>New buyer bid verified and posted live to AgriSignal network!</span>
            </div>
          )}

          <form onSubmit={handleCreateBuyer} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Buyer Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newBuyerName}
                  onChange={(e) => setNewBuyerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Company / Facility</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sahyadri Agro Food Ltd"
                  value={newBuyerCompany}
                  onChange={(e) => setNewBuyerCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Crop</label>
                <select
                  value={newBuyerCrop}
                  onChange={(e) => setNewBuyerCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Offered Price (₹/qtl)</label>
                <input
                  type="number"
                  required
                  value={newBuyerPrice}
                  onChange={(e) => setNewBuyerPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Req. Volume (Qtl)</label>
                <input
                  type="number"
                  required
                  value={newBuyerQty}
                  onChange={(e) => setNewBuyerQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Payment Settlement Terms</label>
              <input
                type="text"
                required
                value={newBuyerTerms}
                onChange={(e) => setNewBuyerTerms(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Verify & Add Buyer to Live Signals
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
