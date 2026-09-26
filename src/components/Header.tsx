import React, { useState } from 'react';
import { 
  Sprout, 
  Globe, 
  UserCheck, 
  Bell, 
  Sparkles, 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Warehouse, 
  Truck, 
  Calculator, 
  BrainCircuit, 
  ShieldCheck,
  X,
  BarChart2,
  MessageSquareQuote
} from 'lucide-react';
import { LanguageCode, AlertItem } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isStewardMode: boolean;
  setIsStewardMode: (mode: boolean) => void;
  alerts: AlertItem[];
  onOpenAiAdvice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  isStewardMode,
  setIsStewardMode,
  alerts,
  onOpenAiAdvice,
}) => {
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'ai-advice', label: t.navAiAdvice, icon: BrainCircuit, badge: 'AI' },
    { id: 'markets', label: t.navMarkets, icon: TrendingUp },
    { id: 'history', label: 'Historical Trends', icon: BarChart2 },
    { id: 'feedback', label: 'Farmer Outcomes', icon: MessageSquareQuote },
    { id: 'buyers', label: t.navBuyers, icon: Users },
    { id: 'storage', label: t.navStorage, icon: Warehouse },
    { id: 'transport', label: t.navTransport, icon: Truck },
    { id: 'calculator', label: t.navCalculator, icon: Calculator },
  ];

  if (isStewardMode) {
    navItems.push({ id: 'steward', label: 'FPO Operations Hub', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-xs">
      {/* Top Banner with Brand & Global Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Slogan */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('dashboard')}
            id="brand-logo-button"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs font-bold text-xl">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-stone-900 tracking-tight">AgriSignal</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  Local Hub
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden md:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Controls: AI Recommendation CTA, Language Selector, Alerts, Steward Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick AI Advice CTA Button */}
            <button
              id="header-ai-recommendation-cta"
              onClick={onOpenAiAdvice}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span className="whitespace-nowrap">{t.getAiRec}</span>
            </button>

            {/* Language Switcher */}
            <div className="relative inline-flex items-center bg-stone-100 rounded-lg p-1">
              <Globe className="w-3.5 h-3.5 text-stone-500 ml-1.5 mr-1" />
              <select
                id="language-select-dropdown"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-semibold text-stone-800 pr-2 py-1 outline-hidden cursor-pointer"
                aria-label="Select Interface Language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
            </div>

            {/* Alerts Bell */}
            <div className="relative">
              <button
                id="header-alerts-toggle-button"
                onClick={() => setShowAlertsMenu(!showAlertsMenu)}
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                aria-label="View Alerts"
              >
                <Bell className="w-5 h-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown Modal */}
              {showAlertsMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-stone-900 text-sm">Market & Arrival Alerts</span>
                    </div>
                    <button 
                      onClick={() => setShowAlertsMenu(false)}
                      className="text-stone-400 hover:text-stone-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 px-2 py-1">
                    {alerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="p-2.5 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          setShowAlertsMenu(false);
                          if (alert.type === 'price_change') setActiveTab('markets');
                          else if (alert.type === 'buyer_offer') setActiveTab('buyers');
                          else if (alert.type === 'storage_capacity') setActiveTab('storage');
                          else if (alert.type === 'transport_pool') setActiveTab('transport');
                          else setActiveTab('dashboard');
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            alert.severity === 'high' ? 'bg-rose-100 text-rose-800' :
                            alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.badgeText}
                          </span>
                          <span className="text-[11px] text-stone-400">{alert.time}</span>
                        </div>
                        <p className="text-xs font-bold text-stone-900">{alert.title}</p>
                        <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FPO Steward Hub / Farmer Toggle */}
            <button
              id="steward-mode-toggle-button"
              onClick={() => setIsStewardMode(!isStewardMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                isStewardMode 
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs' 
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title="Toggle between Farmer View and FPO Data Steward Hub"
            >
              {isStewardMode ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline">Steward Mode</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">FPO Hub</span>
                </>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-emerald-50/60 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-tab`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-emerald-100/70 hover:text-emerald-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive ? 'bg-white text-emerald-800' : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* FPO Steward Tab */}
            <button
              id="nav-steward-tab"
              onClick={() => {
                setIsStewardMode(true);
                setActiveTab('steward');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer border ${
                activeTab === 'steward'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'steward' ? 'text-white' : 'text-amber-700'}`} />
              <span>{t.navStewardHub}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
