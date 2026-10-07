import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Home, 
  Compass, 
  Building, 
  Key, 
  ArrowLeft, 
  ShieldCheck, 
  SlidersHorizontal, 
  MapPin, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Search, 
  LayoutGrid, 
  List, 
  Phone, 
  Heart, 
  Share2, 
  Send, 
  PhoneCall,
  CheckSquare,
  Square,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import PropertyCard from './PropertyCard';
import { 
  CITIES,
  PROPERTY_TYPES, 
  BHK_OPTIONS, 
  BUDGET_RANGES,
  POSSESSION_OPTIONS,
  POSTED_BY_OPTIONS,
  FURNISHING_OPTIONS,
  FACING_OPTIONS,
  AMENITIES_LIST,
  formatIndianPrice,
  getPropertySlug 
} from '../data/mockProperties';

export default function CollectionPage({
  properties = [],
  selectedCity,
  setSelectedCity,
  activeTab,
  setActiveTab,
  shortlistIds = [],
  onToggleShortlist,
  onNavigate,
  onOpenAuth
}) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(['all']);
  const [selectedBhks, setSelectedBhks] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_RANGES[0]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedPossessions, setSelectedPossessions] = useState([]);
  const [selectedPostedBy, setSelectedPostedBy] = useState([]);
  const [selectedFurnishings, setSelectedFurnishings] = useState([]);
  const [selectedFacings, setSelectedFacings] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyRera, setOnlyRera] = useState(false);
  const [onlyOwner, setOnlyOwner] = useState(false);
  
  // UI Display States
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [contactProperty, setContactProperty] = useState(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', message: '' });

  // Accordion toggle states for sidebar sections
  const [openSections, setOpenSections] = useState({
    purpose: true,
    location: true,
    budget: true,
    bhk: true,
    type: true,
    verification: true,
    possession: true,
    postedBy: true,
    furnishing: true,
    facing: false,
    amenities: false,
    area: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper toggle functions
  const toggleType = (typeId) => {
    if (typeId === 'all') {
      setSelectedTypes(['all']);
      return;
    }
    const filtered = selectedTypes.filter((t) => t !== 'all');
    if (filtered.includes(typeId)) {
      const next = filtered.filter((t) => t !== typeId);
      setSelectedTypes(next.length > 0 ? next : ['all']);
    } else {
      setSelectedTypes([...filtered, typeId]);
    }
  };

  const toggleBhk = (bhk) => {
    if (selectedBhks.includes(bhk)) {
      setSelectedBhks(selectedBhks.filter((b) => b !== bhk));
    } else {
      setSelectedBhks([...selectedBhks, bhk]);
    }
  };

  const togglePossession = (pos) => {
    if (selectedPossessions.includes(pos)) {
      setSelectedPossessions(selectedPossessions.filter((p) => p !== pos));
    } else {
      setSelectedPossessions([...selectedPossessions, pos]);
    }
  };

  const togglePostedBy = (pb) => {
    if (selectedPostedBy.includes(pb)) {
      setSelectedPostedBy(selectedPostedBy.filter((p) => p !== pb));
    } else {
      setSelectedPostedBy([...selectedPostedBy, pb]);
    }
  };

  const toggleFurnishing = (furn) => {
    if (selectedFurnishings.includes(furn)) {
      setSelectedFurnishings(selectedFurnishings.filter((f) => f !== furn));
    } else {
      setSelectedFurnishings([...selectedFurnishings, furn]);
    }
  };

  const toggleFacing = (facing) => {
    if (selectedFacings.includes(facing)) {
      setSelectedFacings(selectedFacings.filter((f) => f !== facing));
    } else {
      setSelectedFacings([...selectedFacings, facing]);
    }
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedTypes(['all']);
    setSelectedBhks([]);
    setSelectedBudget(BUDGET_RANGES[0]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedPossessions([]);
    setSelectedPostedBy([]);
    setSelectedFurnishings([]);
    setSelectedFacings([]);
    setSelectedAmenities([]);
    setMinArea('');
    setMaxArea('');
    setOnlyVerified(false);
    setOnlyRera(false);
    setOnlyOwner(false);
    setSortBy('relevance');
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (!selectedTypes.includes('all')) count += selectedTypes.length;
    if (selectedBhks.length > 0) count += selectedBhks.length;
    if (selectedBudget.min > 0 || selectedBudget.max < 1000000000) count++;
    if (minPrice || maxPrice) count++;
    if (selectedPossessions.length > 0) count += selectedPossessions.length;
    if (selectedPostedBy.length > 0) count += selectedPostedBy.length;
    if (selectedFurnishings.length > 0) count += selectedFurnishings.length;
    if (selectedFacings.length > 0) count += selectedFacings.length;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (minArea || maxArea) count++;
    if (onlyVerified) count++;
    if (onlyRera) count++;
    if (onlyOwner) count++;
    return count;
  }, [
    searchQuery,
    selectedTypes,
    selectedBhks,
    selectedBudget,
    minPrice,
    maxPrice,
    selectedPossessions,
    selectedPostedBy,
    selectedFurnishings,
    selectedFacings,
    selectedAmenities,
    minArea,
    maxArea,
    onlyVerified,
    onlyRera,
    onlyOwner
  ]);

  // Main Filtering logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // 1. City Filter
      if (selectedCity && prop.city !== selectedCity) {
        if (!searchQuery) return false;
      }

      // 2. Tab / Purpose Filter (Buy vs Rent vs Commercial vs Plot)
      if (activeTab === 'rent' && prop.purpose !== 'rent') return false;
      if (activeTab === 'buy' && prop.purpose !== 'buy') return false;
      if (activeTab === 'commercial' && prop.type !== 'commercial') return false;
      if (activeTab === 'plot' && prop.type !== 'plot') return false;

      // 3. Property Types Filter
      if (!selectedTypes.includes('all') && !selectedTypes.includes(prop.type)) {
        return false;
      }

      // 4. BHK Filter
      if (selectedBhks.length > 0) {
        const matchesBhk = selectedBhks.some((b) => {
          const numberPart = b.split(' ')[0];
          return prop.bhk && prop.bhk.toLowerCase().includes(numberPart.toLowerCase());
        });
        if (!matchesBhk) return false;
      }

      // 5. Budget Filter (Presets and custom min/max)
      const effectiveMinPrice = minPrice ? Number(minPrice) : selectedBudget.min;
      const effectiveMaxPrice = maxPrice ? Number(maxPrice) : selectedBudget.max;
      if (effectiveMinPrice > 0 && prop.price < effectiveMinPrice) return false;
      if (effectiveMaxPrice < 1000000000 && prop.price > effectiveMaxPrice) return false;

      // 6. Possession Filter
      if (selectedPossessions.length > 0) {
        if (!selectedPossessions.some((p) => prop.possession && prop.possession.toLowerCase().includes(p.toLowerCase()))) {
          return false;
        }
      }

      // 7. Posted By Filter
      if (selectedPostedBy.length > 0) {
        const matchesPosted = selectedPostedBy.some((pb) => {
          if (pb.includes('Owner') && prop.postedBy?.includes('Owner')) return true;
          if (pb.includes('Agent') && prop.postedBy?.includes('Agent')) return true;
          if (pb.includes('Developer') && (prop.postedBy?.includes('Developer') || prop.postedBy?.includes('Builder'))) return true;
          return false;
        });
        if (!matchesPosted) return false;
      }

      // 8. Trust Badges
      if (onlyVerified && !prop.verified) return false;
      if (onlyRera && !prop.reraApproved) return false;
      if (onlyOwner && !prop.postedBy?.includes('Owner')) return false;

      // 9. Furnishing Filter
      if (selectedFurnishings.length > 0) {
        if (!selectedFurnishings.includes(prop.furnishing)) return false;
      }

      // 10. Facing Filter
      if (selectedFacings.length > 0) {
        if (!selectedFacings.some((f) => prop.facing && prop.facing.toLowerCase().includes(f.toLowerCase()))) {
          return false;
        }
      }

      // 11. Amenities Filter
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every((amenity) =>
          prop.amenities && prop.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }

      // 12. Area Range Filter
      if (minArea && prop.areaSqFt < Number(minArea)) return false;
      if (maxArea && prop.areaSqFt > Number(maxArea)) return false;

      // 13. Search Query Text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = prop.title?.toLowerCase().includes(q);
        const inLocality = prop.locality?.toLowerCase().includes(q);
        const inCity = prop.city?.toLowerCase().includes(q);
        const inDesc = prop.description?.toLowerCase().includes(q);
        if (!inTitle && !inLocality && !inCity && !inDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'area-desc') return b.areaSqFt - a.areaSqFt;
      if (sortBy === 'newest') return (b.id || '').localeCompare(a.id || '');
      return 0; // relevance
    });
  }, [
    properties,
    selectedCity,
    activeTab,
    selectedTypes,
    selectedBhks,
    selectedBudget,
    minPrice,
    maxPrice,
    selectedPossessions,
    selectedPostedBy,
    selectedFurnishings,
    selectedFacings,
    selectedAmenities,
    minArea,
    maxArea,
    onlyVerified,
    onlyRera,
    onlyOwner,
    searchQuery,
    sortBy
  ]);

  const handleSelectProperty = (prop) => {
    if (onNavigate) {
      onNavigate(`/property/${getPropertySlug(prop)}`);
    }
  };

  const handleOpenContact = (prop) => {
    setContactProperty(prop);
    setInquirySubmitted(false);
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  // Reusable Sidebar Filters Component
  const FilterSidebarContent = () => (
    <div className="space-y-5 text-sm text-slate-700">
      
      {/* Sidebar Header & Clear All */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span className="font-extrabold text-base text-slate-900">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-brand-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Purpose / Transaction Type */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('purpose')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>I am looking to</span>
          {openSections.purpose ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.purpose && (
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'buy', label: 'Buy Property' },
              { id: 'rent', label: 'Rent / Lease' },
              { id: 'commercial', label: 'Commercial' },
              { id: 'plot', label: 'Plots / Land' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition text-center border ${
                  activeTab === p.id
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. City & Locality Search */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>City & Locality</span>
          {openSections.location ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.location && (
          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Select City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Search Locality / Landmark</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Golf Course Road, Bandra, Whitefield..."
                  className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Budget Filter */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('budget')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>Budget / Price</span>
          {openSections.budget ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.budget && (
          <div className="space-y-2">
            <div className="space-y-1.5">
              {BUDGET_RANGES.map((b) => {
                const isSelected = selectedBudget.label === b.label && !minPrice && !maxPrice;
                return (
                  <label
                    key={b.label}
                    onClick={() => {
                      setSelectedBudget(b);
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                      isSelected ? 'bg-brand-50 text-brand-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{b.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </label>
                );
              })}
            </div>

            {/* Custom Min / Max Price */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Min (₹)</span>
                <input
                  type="number"
                  placeholder="e.g. 2000000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Max (₹)</span>
                <input
                  type="number"
                  placeholder="e.g. 10000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. BHK / Bedrooms */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('bhk')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>BHK / Bedrooms</span>
          {openSections.bhk ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.bhk && (
          <div className="grid grid-cols-2 gap-1.5">
            {BHK_OPTIONS.map((bhk) => {
              const isSelected = selectedBhks.includes(bhk);
              return (
                <button
                  key={bhk}
                  onClick={() => toggleBhk(bhk)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition text-center ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {bhk}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Property Type */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('type')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>Property Type</span>
          {openSections.type ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.type && (
          <div className="space-y-1.5">
            {PROPERTY_TYPES.map((t) => {
              const isSelected = selectedTypes.includes(t.id);
              return (
                <label
                  key={t.id}
                  onClick={() => toggleType(t.id)}
                  className="flex items-center space-x-2 text-xs text-slate-700 hover:text-brand-600 cursor-pointer select-none py-0.5"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-brand-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={isSelected ? 'font-bold text-brand-700' : ''}>{t.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Verification & Trust */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('verification')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>Trust & Verification</span>
          {openSections.verification ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.verification && (
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-xs text-slate-700 hover:text-brand-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <span className="flex items-center font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                Verified Listings Only
              </span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-700 hover:text-brand-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyRera}
                onChange={(e) => setOnlyRera(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <span className="flex items-center font-medium">
                <BadgeCheck className="w-3.5 h-3.5 text-brand-600 mr-1.5" />
                RERA Approved Projects
              </span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-700 hover:text-brand-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOwner}
                onChange={(e) => setOnlyOwner(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <span className="flex items-center font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
                0% Brokerage (Owner Only)
              </span>
            </label>
          </div>
        )}
      </div>

      {/* 7. Possession Status */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('possession')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>Possession Status</span>
          {openSections.possession ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.possession && (
          <div className="space-y-1.5">
            {POSSESSION_OPTIONS.map((pos) => {
              const isSelected = selectedPossessions.includes(pos);
              return (
                <label
                  key={pos}
                  onClick={() => togglePossession(pos)}
                  className="flex items-center space-x-2 text-xs text-slate-700 hover:text-brand-600 cursor-pointer select-none py-0.5"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-brand-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={isSelected ? 'font-bold text-brand-700' : ''}>{pos}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 8. Posted By */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('postedBy')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>Posted By</span>
          {openSections.postedBy ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.postedBy && (
          <div className="space-y-1.5">
            {POSTED_BY_OPTIONS.map((pb) => {
              const isSelected = selectedPostedBy.includes(pb);
              return (
                <label
                  key={pb}
                  onClick={() => togglePostedBy(pb)}
                  className="flex items-center space-x-2 text-xs text-slate-700 hover:text-brand-600 cursor-pointer select-none py-0.5"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-brand-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={isSelected ? 'font-bold text-brand-700' : ''}>{pb}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 9. Furnishing */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('furnishing')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>Furnishing Status</span>
          {openSections.furnishing ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.furnishing && (
          <div className="space-y-1.5">
            {FURNISHING_OPTIONS.map((f) => {
              const isSelected = selectedFurnishings.includes(f);
              return (
                <label
                  key={f}
                  onClick={() => toggleFurnishing(f)}
                  className="flex items-center space-x-2 text-xs text-slate-700 hover:text-brand-600 cursor-pointer select-none py-0.5"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-brand-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={isSelected ? 'font-bold text-brand-700' : ''}>{f}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 10. Facing */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('facing')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>Facing Direction</span>
          {openSections.facing ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.facing && (
          <div className="grid grid-cols-2 gap-1.5">
            {FACING_OPTIONS.map((fac) => {
              const isSelected = selectedFacings.includes(fac);
              return (
                <button
                  key={fac}
                  onClick={() => toggleFacing(fac)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition text-center ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {fac}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 11. Amenities */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('amenities')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>Amenities</span>
          {openSections.amenities ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.amenities && (
          <div className="space-y-1.5">
            {AMENITIES_LIST.map((am) => {
              const isSelected = selectedAmenities.includes(am);
              return (
                <label
                  key={am}
                  onClick={() => toggleAmenity(am)}
                  className="flex items-center space-x-2 text-xs text-slate-700 hover:text-brand-600 cursor-pointer select-none py-0.5"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-brand-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={isSelected ? 'font-bold text-brand-700' : ''}>{am}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 12. Area (Sq.Ft) */}
      <div>
        <button
          onClick={() => toggleSection('area')}
          className="w-full flex items-center justify-between font-bold text-slate-900 mb-2.5"
        >
          <span>Super Area (Sq.Ft)</span>
          {openSections.area ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {openSections.area && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Min sq.ft</span>
              <input
                type="number"
                placeholder="e.g. 800"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Max sq.ft</span>
              <input
                type="number"
                placeholder="e.g. 3000"
                value={maxArea}
                onChange={(e) => setMaxArea(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] pb-16">
      
      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2">
          
          {/* Breadcrumb path */}
          <nav className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate('/')} className="hover:text-brand-600 font-semibold flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="capitalize font-semibold text-slate-700">
              {activeTab === 'rent' ? 'Properties for Rent' : activeTab === 'commercial' ? 'Commercial Properties' : activeTab === 'plot' ? 'Plots & Land' : 'Properties for Sale'}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-brand-700">{selectedCity}</span>
          </nav>

          {/* Quick Back button */}
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Collection Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN: 99acres Detailed Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <FilterSidebarContent />
            </div>
          </aside>

          {/* RIGHT COLUMN: Results Feed & Controls */}
          <main className="flex-1 min-w-0">
            
            {/* Results Title & Summary Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-5">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {filteredProperties.length} Properties in {selectedCity}
                    {activeTab === 'rent' ? ' for Rent' : activeTab === 'commercial' ? ' - Commercial' : activeTab === 'plot' ? ' - Plots/Land' : ' for Sale'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified real estate listings with photos, floor plans & direct owner / agent contacts
                  </p>
                </div>

                {/* Mobile Filter Trigger Button */}
                <div className="flex items-center space-x-2 lg:hidden self-start">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex items-center space-x-2 bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters ({activeFiltersCount})</span>
                  </button>
                </div>
              </div>

              {/* Active Filter Pills Bar */}
              {activeFiltersCount > 0 && (
                <div className="pt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Active:</span>
                  
                  {searchQuery && (
                    <span className="bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <span>"{searchQuery}"</span>
                      <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 hover:text-brand-900" /></button>
                    </span>
                  )}

                  {!selectedTypes.includes('all') && selectedTypes.map((t) => {
                    const typeObj = PROPERTY_TYPES.find((pt) => pt.id === t);
                    return (
                      <span key={t} className="bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                        <span>{typeObj?.label || t}</span>
                        <button onClick={() => toggleType(t)}><X className="w-3 h-3 hover:text-brand-900" /></button>
                      </span>
                    );
                  })}

                  {selectedBhks.map((bhk) => (
                    <span key={bhk} className="bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <span>{bhk}</span>
                      <button onClick={() => toggleBhk(bhk)}><X className="w-3 h-3 hover:text-brand-900" /></button>
                    </span>
                  ))}

                  {(selectedBudget.min > 0 || selectedBudget.max < 1000000000) && !minPrice && !maxPrice && (
                    <span className="bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <span>{selectedBudget.label}</span>
                      <button onClick={() => setSelectedBudget(BUDGET_RANGES[0])}><X className="w-3 h-3 hover:text-brand-900" /></button>
                    </span>
                  )}

                  {(minPrice || maxPrice) && (
                    <span className="bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <span>₹{minPrice || 0} - ₹{maxPrice || 'Any'}</span>
                      <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><X className="w-3 h-3 hover:text-brand-900" /></button>
                    </span>
                  )}

                  {onlyVerified && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <span>Verified Only</span>
                      <button onClick={() => setOnlyVerified(false)}><X className="w-3 h-3 hover:text-emerald-900" /></button>
                    </span>
                  )}

                  {onlyRera && (
                    <span className="bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <span>RERA Approved</span>
                      <button onClick={() => setOnlyRera(false)}><X className="w-3 h-3 hover:text-brand-900" /></button>
                    </span>
                  )}

                  {onlyOwner && (
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <span>Zero Brokerage (Owner)</span>
                      <button onClick={() => setOnlyOwner(false)}><X className="w-3 h-3 hover:text-teal-900" /></button>
                    </span>
                  )}

                  {selectedPossessions.map((pos) => (
                    <span key={pos} className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <span>{pos}</span>
                      <button onClick={() => togglePossession(pos)}><X className="w-3 h-3 hover:text-slate-900" /></button>
                    </span>
                  ))}

                  {selectedFurnishings.map((furn) => (
                    <span key={furn} className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <span>{furn}</span>
                      <button onClick={() => toggleFurnishing(furn)}><X className="w-3 h-3 hover:text-slate-900" /></button>
                    </span>
                  ))}

                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Sorting and View Options Toolbar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                
                {/* Quick shortcut tags */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0 mr-1">Quick:</span>
                  <button
                    onClick={() => setOnlyVerified(!onlyVerified)}
                    className={`px-2.5 py-1 rounded-lg font-semibold border transition shrink-0 ${
                      onlyVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ✓ Verified
                  </button>
                  <button
                    onClick={() => setOnlyOwner(!onlyOwner)}
                    className={`px-2.5 py-1 rounded-lg font-semibold border transition shrink-0 ${
                      onlyOwner ? 'bg-teal-50 text-teal-700 border-teal-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🔑 Zero Brokerage
                  </button>
                  <button
                    onClick={() => togglePossession('Ready to Move')}
                    className={`px-2.5 py-1 rounded-lg font-semibold border transition shrink-0 ${
                      selectedPossessions.includes('Ready to Move') ? 'bg-brand-50 text-brand-700 border-brand-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🏢 Ready to Move
                  </button>
                  <button
                    onClick={() => toggleBhk('3 BHK')}
                    className={`px-2.5 py-1 rounded-lg font-semibold border transition shrink-0 ${
                      selectedBhks.includes('3 BHK') ? 'bg-brand-50 text-brand-700 border-brand-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🛏️ 3 BHK Only
                  </button>
                </div>

                {/* Right controls: Sort dropdown & Grid/List view */}
                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <div className="flex items-center space-x-2">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="relevance">Sort: Relevance</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="area-desc">Area: Largest First</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* View mode toggle */}
                  <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition ${
                        viewMode === 'list' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition ${
                        viewMode === 'grid' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Properties Listings Feed */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm my-6">
                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                <h3 className="text-xl font-black text-slate-800">No properties match your filters</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                  We couldn't find any properties matching all your filter criteria in {selectedCity}. Try loosening price or bedroom filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-6 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition inline-flex items-center space-x-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isShortlisted={shortlistIds.includes(prop.id)}
                    onToggleShortlist={onToggleShortlist}
                    onSelectProperty={handleSelectProperty}
                    onContactClick={handleOpenContact}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isShortlisted={shortlistIds.includes(prop.id)}
                    onToggleShortlist={onToggleShortlist}
                    onSelectProperty={handleSelectProperty}
                    onContactClick={handleOpenContact}
                  />
                ))}
              </div>
            )}

          </main>

        </div>
      </div>

      {/* MOBILE FILTERS MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-base">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <span>Filters & Preferences</span>
              </div>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebarContent />
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center space-x-3">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-xs"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-2 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Apply Filters ({filteredProperties.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT AGENT / OWNER MODAL */}
      {contactProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setContactProperty(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 z-10 animate-scale-up">
            <button
              onClick={() => setContactProperty(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {inquirySubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-slate-500 mt-2">
                  The seller <strong className="text-slate-800">{contactProperty.contact?.name}</strong> has been notified and will call you back shortly.
                </p>
                <button
                  onClick={() => setContactProperty(null)}
                  className="mt-6 w-full py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-lg">
                    {contactProperty.contact?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{contactProperty.contact?.name}</h3>
                    <span className="text-xs text-brand-600 font-semibold">{contactProperty.contact?.badge}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Inquiring About:</span>
                  <strong className="text-slate-800 block truncate mt-0.5">{contactProperty.title}</strong>
                  <span className="text-brand-600 font-bold">{formatIndianPrice(contactProperty.price, contactProperty.purpose)}</span>
                </div>

                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="I am interested in this property. Please share brochure and schedule a site visit."
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry to Seller</span>
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-[11px] text-slate-400">
                      Direct phone: <strong className="text-slate-700">{contactProperty.contact?.phone}</strong>
                    </span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
