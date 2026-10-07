import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  Heart, 
  User, 
  PlusCircle, 
  Search,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  Layers
} from 'lucide-react';
import { CITIES } from '../data/mockProperties';

export default function Header({ 
  selectedCity, 
  setSelectedCity, 
  shortlistCount, 
  onOpenShortlist, 
  onOpenPostProperty, 
  onOpenAuth,
  activeTab,
  setActiveTab,
  onNavigate,
  currentPath
}) {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (onNavigate) onNavigate('/');
    setActiveTab('buy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onNavigate) onNavigate('/collection');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top micro-bar */}
      <div className="bg-[#002e54] text-slate-300 text-xs py-1 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> India's #1 Property & Real Estate Portal
            </span>
            <span>Toll Free Support: <strong className="text-white">1800-41-99099</strong></span>
            <span>RERA Approved Projects Only</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('/collection')} 
              className="hover:text-white transition font-medium"
            >
              All Listings
            </button>
            <a href="#emi-calc" className="hover:text-white transition">EMI Calculator</a>
            <a href="#trends" className="hover:text-white transition">Price Trends</a>
            <span className="text-slate-500">|</span>
            <button 
              onClick={onOpenPostProperty} 
              className="text-amber-300 font-semibold hover:underline flex items-center"
            >
              Post Free Ad
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          
          {/* Brand Logo & City Selector */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div 
              onClick={handleLogoClick}
              className="flex items-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-500 to-sky-400 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                99
              </div>
              <div className="ml-2.5">
                <div className="flex items-center">
                  <span className="text-2xl font-black tracking-tight text-brand-700">acres</span>
                  <span className="text-xs bg-amber-500 text-slate-900 font-extrabold px-1.5 py-0.5 rounded ml-1.5 uppercase">India</span>
                </div>
                <span className="text-[10px] text-slate-500 block -mt-1 font-medium tracking-wide">Property Search Made Simple</span>
              </div>
            </div>

            {/* City Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
              >
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Select Major Metro</div>
                  {CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.name);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-brand-50 hover:text-brand-600 transition ${
                        selectedCity === city.name ? 'font-bold text-brand-600 bg-brand-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{city.name}</span>
                      {city.popular && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">Popular</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('/collection')}
              className={`px-3.5 py-2 text-sm font-bold rounded-lg transition flex items-center space-x-1.5 ${
                currentPath === '/collection' || currentPath === '/properties'
                  ? 'text-brand-700 bg-brand-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-brand-600" />
              <span>All Collection</span>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.2 rounded-full uppercase">99acres</span>
            </button>
            <button
              onClick={() => handleTabClick('buy')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'buy' && (currentPath === '/collection' || currentPath === '/') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => handleTabClick('rent')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'rent' && currentPath === '/collection' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Rent
            </button>
            <button
              onClick={() => handleTabClick('commercial')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'commercial' && currentPath === '/collection' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Commercial
            </button>
            <button
              onClick={() => handleTabClick('plot')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'plot' && currentPath === '/collection' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Plots / Land
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center space-x-3">
            {/* Post Property Button (Free Badge) */}
            <button
              onClick={onOpenPostProperty}
              className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition group"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Post Property</span>
              <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                FREE
              </span>
            </button>

            {/* Shortlisted items button */}
            <button
              onClick={onOpenShortlist}
              className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {shortlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                  {shortlistCount}
                </span>
              )}
            </button>

            {/* User Login */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center space-x-2 border border-slate-300 hover:border-brand-500 text-slate-700 hover:text-brand-600 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-white"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => {
              onNavigate('/collection');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-50 text-brand-700 font-bold rounded-xl border border-brand-200"
          >
            <Layers className="w-4 h-4" />
            <span>View All Properties Collection</span>
          </button>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {['buy', 'rent', 'commercial', 'plot'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  handleTabClick(tab);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 text-sm font-bold rounded-lg uppercase text-center ${
                  activeTab === tab ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-100 rounded-xl font-semibold text-slate-800"
          >
            <User className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        </div>
      )}
    </header>
  );
}
