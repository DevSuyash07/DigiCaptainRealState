import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import LocalityCards from './components/LocalityCards';
import PropertyCard from './components/PropertyCard';
import PropertyDetailPage from './components/PropertyDetailPage';
import CollectionPage from './components/CollectionPage';
import DashboardPage from './components/DashboardPage';
import PostPropertyModal from './components/PostPropertyModal';
import EmiCalculator from './components/EmiCalculator';
import AuthModal from './components/AuthModal';
import ShortlistDrawer from './components/ShortlistDrawer';
import Footer from './components/Footer';
import { 
  INITIAL_PROPERTIES, 
  BUDGET_RANGES, 
  PROPERTY_TYPES,
  getPropertySlug,
  findPropertyBySlug
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
  Key, 
  ArrowLeft,
  SlidersHorizontal,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function App() {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [dataSource, setDataSource] = useState('loading'); // 'loading' | 'live' | 'offline'
  const [apiError, setApiError] = useState('');
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
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
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  
  // Shortlisted property IDs
  const [shortlistIds, setShortlistIds] = useState(['prop-1', 'prop-3']);

  // Handle URL history and routing
  const navigateTo = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch properties from backend if available.
  // If it fails we still render the sample dataset, but dataSource/apiError make
  // that visible in the dashboard instead of silently passing mock data off as live.
  const loadProperties = useCallback(() => {
    setDataSource('loading');
    setApiError('');
    fetch('/api/v1/properties')
      .then((res) => {
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const live = data && Array.isArray(data.data) ? data.data : null;
        if (live && live.length > 0) {
          // Merge with initial rich data
          setProperties([...live, ...INITIAL_PROPERTIES]);
          setDataSource('live');
        } else {
          setDataSource('offline');
          setApiError('API reachable but returned no listings');
        }
      })
      .catch((err) => {
        setDataSource('offline');
        setApiError(err && err.message ? err.message : 'request failed');
      });
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  // Determine current active route for /property/:slug
  const propertyMatch = currentPath.match(/^\/property\/(.+)$/);
  const propertySlug = propertyMatch ? propertyMatch[1] : null;
  const currentProperty = propertySlug ? findPropertyBySlug(properties, propertySlug) : null;

  const isCollectionRoute = currentPath === '/collection' || currentPath === '/properties' || currentPath.startsWith('/collection');

  const isDashboardRoute = currentPath === '/dashboard' || currentPath.startsWith('/dashboard');

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

  // Filtered Properties for Home preview
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (selectedCity && prop.city !== selectedCity) {
        if (!searchQuery) return false;
      }
      if (activeTab === 'rent' && prop.purpose !== 'rent') return false;
      if (activeTab === 'buy' && prop.purpose !== 'buy') return false;
      if (activeTab === 'commercial' && prop.type !== 'commercial') return false;
      if (activeTab === 'plot' && prop.type !== 'plot') return false;
      if (selectedType !== 'all' && prop.type !== selectedType) return false;
      if (selectedBhk.length > 0) {
        const matchesBhk = selectedBhk.some((b) => prop.bhk.includes(b.split(' ')[0]));
        if (!matchesBhk) return false;
      }
      if (selectedBudget.min > 0 && prop.price < selectedBudget.min) return false;
      if (selectedBudget.max < 1000000000 && prop.price > selectedBudget.max) return false;
      if (onlyVerified && !prop.verified) return false;
      if (onlyOwner && !prop.postedBy.includes('Owner')) return false;

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
      return 0;
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
    navigateTo(`/property/${getPropertySlug(newProp)}`);
  };

  const handleSelectLocality = (localityName) => {
    const clean = localityName.split(',')[0];
    setSearchQuery(clean);
    navigateTo('/collection');
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

  const handleSelectProperty = (prop) => {
    navigateTo(`/property/${getPropertySlug(prop)}`);
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
        onNavigate={navigateTo}
        currentPath={currentPath}
      />

      {/* Main View Router */}
      {propertySlug ? (
        currentProperty ? (
          <PropertyDetailPage
            property={currentProperty}
            allProperties={properties}
            onNavigate={navigateTo}
            isShortlisted={shortlistIds.includes(currentProperty.id)}
            onToggleShortlist={handleToggleShortlist}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        ) : (
          <div className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <h2 className="text-2xl font-black text-slate-800">Property Listing Not Found</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6 max-w-md mx-auto">
              The property you are looking for may have been removed, sold, or the link may be invalid.
            </p>
            <button
              onClick={() => navigateTo('/collection')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Properties</span>
            </button>
          </div>
        )
      ) : isDashboardRoute ? (
        /* Internal Listings Dashboard */
        <DashboardPage
          properties={properties}
          dataSource={dataSource}
          apiError={apiError}
          onRetryFetch={loadProperties}
          onNavigate={navigateTo}
          shortlistIds={shortlistIds}
          onToggleShortlist={handleToggleShortlist}
          onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        />
      ) : isCollectionRoute ? (
        /* Full 99acres Detailed Collection Page with Left Filter Sidebar */
        <CollectionPage
          properties={properties}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          shortlistIds={shortlistIds}
          onToggleShortlist={handleToggleShortlist}
          onNavigate={navigateTo}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      ) : (
        /* Marketplace Home Page View */
        <>
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
            onPerformSearch={() => navigateTo('/collection')}
          />

          {/* Market Intelligence / Trending Localities */}
          <LocalityCards onSelectLocality={handleSelectLocality} />

          {/* Collection Showcase Banner */}
          <section className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>99acres Collection View</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  Explore All Properties with Detailed Filters
                </h2>
                <p className="text-slate-200 text-xs sm:text-sm max-w-xl">
                  Filter by Budget, BHK, Locality, Possession status, RERA approval, Furnishing, Facing, and Amenities in our full collection page.
                </p>
              </div>

              <button
                onClick={() => navigateTo('/collection')}
                className="shrink-0 bg-white hover:bg-slate-100 text-brand-900 font-extrabold px-6 py-3.5 rounded-2xl text-sm shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center space-x-2"
              >
                <Layers className="w-4 h-4 text-brand-700" />
                <span>Open Collection & Filters</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Main Listings Section */}
          <main id="listings-section" className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
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
                <button
                  onClick={() => navigateTo('/collection')}
                  className="bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                  <span>Full Filter Sidebar</span>
                </button>

                {(searchQuery || selectedType !== 'all' || selectedBhk.length > 0 || onlyVerified || onlyOwner) && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset</span>
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
                    onSelectProperty={handleSelectProperty}
                    onContactClick={handleSelectProperty}
                  />
                ))}
              </div>
            )}

            {/* View Full Collection button */}
            <div className="text-center mt-10">
              <button
                onClick={() => navigateTo('/collection')}
                className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-lg shadow-brand-500/25 transition transform active:scale-95"
              >
                <Layers className="w-4 h-4" />
                <span>View All Properties in Detailed Collection Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </main>

          {/* Interactive Home Loan EMI Calculator */}
          <EmiCalculator />
        </>
      )}

      {/* 99acres Footer */}
      <Footer />

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
        onSelectProperty={handleSelectProperty}
      />

    </div>
  );
}
