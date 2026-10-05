import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import LocalityCards from './components/LocalityCards';
import PropertyCard from './components/PropertyCard';
import PropertyDetailModal from './components/PropertyDetailModal';
import PostPropertyModal from './components/PostPropertyModal';
import EmiCalculator from './components/EmiCalculator';
import AuthModal from './components/AuthModal';
import ShortlistDrawer from './components/ShortlistDrawer';
import Footer from './components/Footer';
import { 
  INITIAL_PROPERTIES, 
  BUDGET_RANGES, 
  PROPERTY_TYPES 
} from './data/mockProperties';
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
  Key
} from 'lucide-react';

export default function App() {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [activeTab, setActiveTab] = useState('buy'); // 'buy', 'rent', 'commercial', 'plot'
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBhk, setSelectedBhk] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_RANGES[0]);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyOwner, setOnlyOwner] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Modals & Drawers
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  
  // Shortlisted property IDs
  const [shortlistIds, setShortlistIds] = useState(['prop-1', 'prop-3']);

  // Fetch properties from backend if available
  useEffect(() => {
    fetch('/api/v1/properties')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          // Merge with initial rich data
          setProperties([...data.data, ...INITIAL_PROPERTIES]);
        }
      })
      .catch(() => {
        // Fallback to rich offline dataset
      });
  }, []);

  // Shortlist Toggle
  const handleToggleShortlist = (propertyId) => {
    setShortlistIds((prev) => 
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleRemoveShortlist = (propertyId) => {
    setShortlistIds((prev) => prev.filter((id) => id !== propertyId));
  };

  const shortlistedProperties = useMemo(() => {
    return properties.filter((p) => shortlistIds.includes(p.id));
  }, [properties, shortlistIds]);

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // 1. City Match (allow matching if user searches broad or selects city)
      if (selectedCity && prop.city !== selectedCity) {
        // If user actively searches a specific locality from another city, allow it
        if (!searchQuery) return false;
      }

      // 2. Purpose / Tab Match (Buy vs Rent vs Commercial vs Plot)
      if (activeTab === 'rent' && prop.purpose !== 'rent') return false;
      if (activeTab === 'buy' && prop.purpose !== 'buy') return false;
      if (activeTab === 'commercial' && prop.type !== 'commercial') return false;
      if (activeTab === 'plot' && prop.type !== 'plot') return false;

      // 3. Property Type Filter
      if (selectedType !== 'all' && prop.type !== selectedType) return false;

      // 4. BHK Filter
      if (selectedBhk.length > 0) {
        const matchesBhk = selectedBhk.some((b) => prop.bhk.includes(b.split(' ')[0]));
        if (!matchesBhk) return false;
      }

      // 5. Budget Filter
      if (selectedBudget.min > 0 && prop.price < selectedBudget.min) return false;
      if (selectedBudget.max < 1000000000 && prop.price > selectedBudget.max) return false;

      // 6. Verified & Owner Filters
      if (onlyVerified && !prop.verified) return false;
      if (onlyOwner && !prop.postedBy.includes('Owner')) return false;

      // 7. Search Query text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = prop.title.toLowerCase().includes(q);
        const inLocality = prop.locality.toLowerCase().includes(q);
        const inCity = prop.city.toLowerCase().includes(q);
        const inDesc = prop.description?.toLowerCase().includes(q);
        if (!inTitle && !inLocality && !inCity && !inDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'area-desc') return b.areaSqFt - a.areaSqFt;
      return 0; // relevance
    });
  }, [
    properties,
    selectedCity,
    activeTab,
    selectedType,
    selectedBhk,
    selectedBudget,
    onlyVerified,
    onlyOwner,
    searchQuery,
    sortBy
  ]);

  const handleAddProperty = (newProp) => {
    setProperties((prev) => [newProp, ...prev]);
    setSelectedProperty(newProp);
  };

  const handleSelectLocality = (localityName) => {
    const clean = localityName.split(',')[0];
    setSearchQuery(clean);
    const element = document.getElementById('listings-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedBhk([]);
    setSelectedBudget(BUDGET_RANGES[0]);
    setOnlyVerified(false);
    setOnlyOwner(false);
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      
      {/* 99acres Header */}
      <Header
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        shortlistCount={shortlistIds.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Hero Multi-Tab Search Engine */}
      <HeroSearch
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedBhk={selectedBhk}
        setSelectedBhk={setSelectedBhk}
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
        onlyVerified={onlyVerified}
        setOnlyVerified={setOnlyVerified}
        onlyOwner={onlyOwner}
        setOnlyOwner={setOnlyOwner}
        onPerformSearch={() => {
          const el = document.getElementById('listings-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Market Intelligence / Trending Localities */}
      <LocalityCards onSelectLocality={handleSelectLocality} />

      {/* Main Listings Section */}
      <main id="listings-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Category Shortcuts */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase shrink-0 mr-2">Quick Browse:</span>
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                selectedType === t.id
                  ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Results Bar & Sorting */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {filteredProperties.length} Properties in {selectedCity} {searchQuery && `matching "${searchQuery}"`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified listings with photos, floor plans & owner contact details
            </p>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            {(searchQuery || selectedType !== 'all' || selectedBhk.length > 0 || onlyVerified || onlyOwner) && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-desc">Area: Largest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Property Cards Feed */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm my-8">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <h3 className="text-xl font-black text-slate-800">No matching properties found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              We couldn't find any properties matching your exact filter criteria in {selectedCity}. Try expanding your budget or resetting filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
            >
              Show All Properties
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isShortlisted={shortlistIds.includes(prop.id)}
                onToggleShortlist={handleToggleShortlist}
                onSelectProperty={(p) => setSelectedProperty(p)}
                onContactClick={(p) => setSelectedProperty(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Interactive Home Loan EMI Calculator */}
      <EmiCalculator />

      {/* 99acres Footer */}
      <Footer />

      {/* Full Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isShortlisted={shortlistIds.includes(selectedProperty.id)}
          onToggleShortlist={handleToggleShortlist}
        />
      )}

      {/* Post Free Property Ad Modal */}
      <PostPropertyModal
        isOpen={isPostPropertyOpen}
        onClose={() => setIsPostPropertyOpen(false)}
        onPropertyAdded={handleAddProperty}
      />

      {/* User Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlistedProperties={shortlistedProperties}
        onRemoveShortlist={handleRemoveShortlist}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

    </div>
  );
}
