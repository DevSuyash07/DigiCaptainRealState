import React, { useState, useRef, useEffect } from 'react';
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
  Layers,
  Navigation,
  Loader2,
  Check,
  LogOut
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
  currentPath,
  currentUser,
  onLogout
}) {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchCityQuery, setSearchCityQuery] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCityDropdownOpen(false);
      }
    }
    if (cityDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cityDropdownOpen]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    setIsDetectingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedCityName = '';

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            {
              headers: { 'Accept-Language': 'en' },
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data && data.address ? data.address : {};
            const raw = addr.city || addr.town || addr.state_district || addr.county || addr.state || '';
            const lower = raw.toLowerCase();

            if (
              lower.includes('delhi') ||
              lower.includes('gurgaon') ||
              lower.includes('gurugram') ||
              lower.includes('noida') ||
              lower.includes('ghaziabad') ||
              lower.includes('faridabad')
            ) {
              detectedCityName = 'Delhi NCR';
            } else {
              const matched = CITIES.find(
                (c) => c.name.toLowerCase() === lower || lower.includes(c.name.toLowerCase())
              );
              if (matched) {
                detectedCityName = matched.name;
              } else if (raw) {
                detectedCityName = raw;
              }
            }
          }
        } catch (e) {
          // Ignore network or abort errors, fallback will resolve
        }

        if (!detectedCityName) {
          const CITY_COORDS = [
            { name: 'Delhi NCR', lat: 28.6139, lon: 77.2090 },
            { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
            { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
            { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
            { name: 'Pune', lat: 18.5204, lon: 73.8567 },
            { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
            { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
            { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 }
          ];
          let closest = CITY_COORDS[0].name;
          let minD = Infinity;
          for (const c of CITY_COORDS) {
            const d = Math.hypot(c.lat - latitude, c.lon - longitude);
            if (d < minD) {
              minD = d;
              closest = c.name;
            }
          }
          detectedCityName = closest;
        }

        setSelectedCity(detectedCityName);
        try {
          localStorage.setItem('selectedCity', detectedCityName);
        } catch (e) {}
        setIsDetectingLocation(false);
        setCityDropdownOpen(false);
      },
      (error) => {
        setIsDetectingLocation(false);
        if (error.code === 1) {
          setLocationError('Location access was denied. You can still select or type your city.');
        } else if (error.code === 2) {
          setLocationError('GPS position unavailable. Please choose your city manually.');
        } else if (error.code === 3) {
          setLocationError('Location request timed out. Please choose your city manually.');
        } else {
          setLocationError('Could not detect location. Please choose your city manually.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const filteredCities = CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchCityQuery.trim().toLowerCase())
  );

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
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setCityDropdownOpen(!cityDropdownOpen);
                  setLocationError('');
                }}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                title="Select or detect your location"
                aria-expanded={cityDropdownOpen}
              >
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="max-w-[110px] sm:max-w-[150px] truncate">{selectedCity}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
                  {/* Manual Search Input */}
                  <div className="relative mb-2.5">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchCityQuery}
                      onChange={(e) => setSearchCityQuery(e.target.value)}
                      placeholder="Search city, locality or state..."
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                      autoFocus
                    />
                    {searchCityQuery && (
                      <button
                        onClick={() => setSearchCityQuery('')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Geolocation Auto-Detect CTA */}
                  <button
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs transition border border-brand-200 group disabled:opacity-60 text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      {isDetectingLocation ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Navigation className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>{isDetectingLocation ? 'Detecting your location...' : 'Use current location'}</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold uppercase">GPS</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        Auto-fetch via browser geolocation
                      </span>
                    </div>
                  </button>

                  {locationError && (
                    <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2 mt-2">
                      {locationError}
                    </div>
                  )}

                  {/* Cities List */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center justify-between px-1 mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {searchCityQuery.trim() ? 'Search Results' : 'Major Metros'}
                      </span>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
                      {/* Custom typed location fallback */}
                      {searchCityQuery.trim() && !CITIES.some((c) => c.name.toLowerCase() === searchCityQuery.trim().toLowerCase()) && (
                        <button
                          onClick={() => {
                            const manualCity = searchCityQuery.trim();
                            setSelectedCity(manualCity);
                            try { localStorage.setItem('selectedCity', manualCity); } catch (e) {}
                            setSearchCityQuery('');
                            setCityDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center space-x-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold border border-amber-200 transition mb-1"
                        >
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">Use &quot;{searchCityQuery.trim()}&quot;</span>
                        </button>
                      )}

                      {filteredCities.map((city) => {
                        const isSelected = selectedCity === city.name;
                        return (
                          <button
                            key={city.id}
                            onClick={() => {
                              setSelectedCity(city.name);
                              try { localStorage.setItem('selectedCity', city.name); } catch (e) {}
                              setSearchCityQuery('');
                              setCityDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                              isSelected
                                ? 'font-bold text-brand-700 bg-brand-50 border border-brand-200'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                              <span>{city.name}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              {city.popular && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                                  Popular
                                </span>
                              )}
                              {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                            </div>
                          </button>
                        );
                      })}

                      {filteredCities.length === 0 && !searchCityQuery.trim() && (
                        <div className="text-center py-4 text-xs text-slate-400">
                          No cities found
                        </div>
                      )}
                    </div>
                  </div>
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

            {/* User Login or Dashboard */}
            {currentUser ? (
              <div className="hidden sm:flex items-center space-x-1.5">
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className={`flex items-center space-x-2 border px-3.5 py-2 rounded-xl text-sm font-bold transition ${
                    currentPath === '/dashboard'
                      ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-600'
                  }`}
                  title="Go to Dashboard"
                >
                  <Building2 className="w-4 h-4 text-brand-600" />
                  <span>Dashboard</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-2 border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center space-x-2 border border-slate-300 hover:border-brand-500 text-slate-700 hover:text-brand-600 px-3.5 py-2 rounded-xl text-sm font-semibold transition bg-white"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

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
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onNavigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl font-bold"
              >
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>Go to Dashboard</span>
              </button>
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2.5 border border-rose-200 bg-rose-50 text-rose-700 rounded-xl font-semibold text-xs flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-100 rounded-xl font-semibold text-slate-800"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
