import React, { useState } from 'react';
import { 
  Search, 
  Home, 
  Key, 
  Building, 
  MapPin, 
  Compass, 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  TrendingUp,
  X
} from 'lucide-react';
import { PROPERTY_TYPES, BHK_OPTIONS, BUDGET_RANGES } from '../data/mockProperties';

export default function HeroSearch({
  activeTab,
  setActiveTab,
  selectedCity,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedBhk,
  setSelectedBhk,
  selectedBudget,
  setSelectedBudget,
  onlyVerified,
  setOnlyVerified,
  onlyOwner,
  setOnlyOwner,
  onPerformSearch
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const TABS = [
    { id: 'buy', label: 'Buy', icon: Home },
    { id: 'rent', label: 'Rent', icon: Key },
    { id: 'commercial', label: 'Commercial', icon: Building },
    { id: 'plot', label: 'Plots / Land', icon: Compass },
  ];

  const handleBhkToggle = (bhk) => {
    if (selectedBhk.includes(bhk)) {
      setSelectedBhk(selectedBhk.filter((b) => b !== bhk));
    } else {
      setSelectedBhk([...selectedBhk, bhk]);
    }
  };

  const handleQuickTag = (tagType) => {
    if (tagType === 'verified') setOnlyVerified(!onlyVerified);
    if (tagType === 'owner') setOnlyOwner(!onlyOwner);
    if (tagType === 'under1cr') {
      setSelectedBudget(BUDGET_RANGES[2]); // ₹50L - 1Cr
    }
    if (tagType === '3bhk') {
      setSelectedBhk(['3 BHK']);
    }
  };

  return (
    <div className="relative hero-gradient text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner">
      {/* Subtle background decorative shapes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-amber-400 blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Hero Headings */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-300 border border-white/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Over 50,000+ Verified Properties in {selectedCity}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
            Find Your Dream Home in <span className="text-amber-300">{selectedCity}</span>
          </h1>
          <p className="mt-2 text-slate-200 text-sm sm:text-base font-medium">
            Explore verified apartments, builder floors, villas & commercial properties with zero brokerage options.
          </p>
        </div>

        {/* 99acres Search Engine Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-800 border border-slate-100">
          
          {/* Main Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 mb-5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Inputs Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Locality / Landmark Search */}
            <div className="md:col-span-5 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Search Locality / Landmark
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`e.g. Golf Course Road, Whitefield, Bandra...`}
                  className="w-full pl-11 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Property Type Dropdown */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Property Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Budget
              </label>
              <select
                value={selectedBudget.label}
                onChange={(e) => {
                  const match = BUDGET_RANGES.find((b) => b.label === e.target.value);
                  if (match) setSelectedBudget(match);
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm truncate"
              >
                {BUDGET_RANGES.map((b) => (
                  <option key={b.label} value={b.label}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search CTA Button */}
            <div className="md:col-span-2 pt-2 md:pt-4">
              <button
                onClick={onPerformSearch}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition transform active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

          </div>

          {/* BHK Multi-Chips Filter */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase mr-1">BHK / Bedrooms:</span>
              {BHK_OPTIONS.map((bhk) => {
                const isSelected = selectedBhk.includes(bhk);
                return (
                  <button
                    key={bhk}
                    onClick={() => handleBhkToggle(bhk)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {bhk}
                  </button>
                );
              })}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 hover:text-brand-600">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  Verified Only
                </span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 hover:text-brand-600">
                <input
                  type="checkbox"
                  checked={onlyOwner}
                  onChange={(e) => setOnlyOwner(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mr-1" />
                  Zero Brokerage (Owner)
                </span>
              </label>
            </div>
          </div>

          {/* Quick Popular Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Popular Searches:</span>
            <button onClick={() => handleQuickTag('verified')} className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md text-slate-700 transition">
              ⭐ RERA Verified Projects
            </button>
            <button onClick={() => handleQuickTag('owner')} className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md text-slate-700 transition">
              🔑 Owner Direct Properties
            </button>
            <button onClick={() => handleQuickTag('3bhk')} className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md text-slate-700 transition">
              🏢 3 BHK Luxury Flats
            </button>
            <button onClick={() => handleQuickTag('under1cr')} className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md text-slate-700 transition">
              💰 Budget Homes Under 1 Cr
            </button>
          </div>

        </div>

        {/* Bottom Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center text-slate-200 text-xs sm:text-sm">
          <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl py-2.5 px-3 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">100% Verified Listings</span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl py-2.5 px-3 border border-white/10">
            <Users className="w-4 h-4 text-sky-400" />
            <span className="font-medium">Direct Owner Connect</span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl py-2.5 px-3 border border-white/10">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="font-medium">Live Market Price Trends</span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl py-2.5 px-3 border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span className="font-medium">Instant Tour Scheduling</span>
          </div>
        </div>

      </div>
    </div>
  );
}
