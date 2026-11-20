import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import LocalityCards from './components/LocalityCards';
import PropertyCard from './components/PropertyCard';
import PropertyDetailPage from './components/PropertyDetailPage';
import CollectionPage from './components/CollectionPage';
import RoleDashboard from './components/RoleDashboard';
import PostPropertyModal from './components/PostPropertyModal';
import EditPropertyModal from './components/EditPropertyModal';
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
  mergeStoredProperties,
  saveLocalListing,
  savePropertyEdit,
  isLocalListing
} from './data/propertyStore';
import { useAuthUser, getStoredUser } from './auth/authStore';
import { recordPropertyView, useRecentViews } from './auth/activityStore';
import { 
  getStoredShortlist, 
  saveStoredShortlist, 
  getCachedProperties, 
  SHORTLIST_EVENT 
} from './auth/shortlistStore';
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
  // Samples, plus every listing this browser posted and every edit it saved,
  // so a refresh no longer throws the person's own work away.
  const [properties, setProperties] = useState(() => mergeStoredProperties(INITIAL_PROPERTIES));
  const [dataSource, setDataSource] = useState('loading'); // 'loading' | 'live' | 'offline'
  const [apiError, setApiError] = useState('');
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      return localStorage.getItem('selectedCity') || 'Delhi NCR';
    } catch (e) {
      return 'Delhi NCR';
    }
  });

  const handleCityChange = useCallback((city) => {
    setSelectedCity(city);
    try {
      localStorage.setItem('selectedCity', city);
    } catch (e) {}
  }, []);
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
  const [editingProperty, setEditingProperty] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  
  // Shortlisted property IDs (persisted across refreshes and synced to user account)
  const [shortlistIds, setShortlistIds] = useState(() => {
    const user = getStoredUser();
    return getStoredShortlist(user && user.email ? user.email : null);
  });

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
        // The API answers { status, data: { properties: [...] } }. It used to be
        // read as data.data being the array itself, which made every successful
        // response look like "no listings" and silently fall back to samples.
        const payload = data && data.data ? data.data : null;
        const live = Array.isArray(payload)
          ? payload
          : payload && Array.isArray(payload.properties)
            ? payload.properties
            : null;
        if (live && live.length > 0) {
          // Merge with initial rich data, then re-apply this browser's own
          // saved listings and edits on top so the fetch does not wipe them.
          setProperties(mergeStoredProperties([...live, ...INITIAL_PROPERTIES]));
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

  // Signed-in account drives what the dashboard route is allowed to render.
  const authUser = useAuthUser();
  const recentViews = useRecentViews(authUser && authUser.email);
  const authEmail = authUser && authUser.email ? authUser.email : null;

  // "Recently viewed" on the buyer dashboard is built from listings this account
  // actually opened, recorded here when a /property/:slug route resolves.
  const viewedPropertyId = currentProperty ? currentProperty.id : null;
  useEffect(() => {
    if (!authEmail || !viewedPropertyId || !currentProperty) return;
    recordPropertyView(authEmail, {
      ...currentProperty,
      slug: getPropertySlug(currentProperty)
    });
  }, [authEmail, viewedPropertyId]);

  // Keep shortlist in sync with account switches and across tabs
  useEffect(() => {
    setShortlistIds(getStoredShortlist(authEmail));
  }, [authEmail]);

  useEffect(() => {
    const syncShortlist = () => {
      setShortlistIds(getStoredShortlist(authEmail));
    };
    window.addEventListener(SHORTLIST_EVENT, syncShortlist);
    window.addEventListener('storage', syncShortlist);
    return () => {
      window.removeEventListener(SHORTLIST_EVENT, syncShortlist);
      window.removeEventListener('storage', syncShortlist);
    };
  }, [authEmail]);

  // Shortlist Toggle (persisted to localStorage)
  const handleToggleShortlist = (propertyId, propObj) => {
    const rawId = propertyId;
    setShortlistIds((prev) => {
      const exists = prev.some((id) => String(id) === String(rawId));
      const next = exists
        ? prev.filter((id) => String(id) !== String(rawId))
        : [...prev, rawId];
      const targetProp = propObj || properties.find((p) => String(p.id) === String(rawId));
      saveStoredShortlist(
        authEmail,
        next,
        targetProp ? { [String(rawId)]: targetProp } : {}
      );
      return next;
    });
  };

  const handleRemoveShortlist = (propertyId) => {
    const rawId = propertyId;
    setShortlistIds((prev) => {
      const next = prev.filter((id) => String(id) !== String(rawId));
      saveStoredShortlist(authEmail, next);
      return next;
    });
  };

  const shortlistedProperties = useMemo(() => {
    const cachedMap = getCachedProperties(authEmail);
    return shortlistIds
      .map((id) => {
        const found = properties.find((p) => String(p.id) === String(id));
        if (found) return found;
        return cachedMap[String(id)] || null;
      })
      .filter(Boolean);
  }, [properties, shortlistIds, authEmail]);

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
    // Written to this browser as well, otherwise the new listing exists only
    // until the next reload. A plain numeric id means the API already stored
    // it, and a stale local copy would shadow the real row - so skip those.
    const isDatabaseId = /^[0-9]+$/.test(String(newProp && newProp.id ? newProp.id : ''));
    if (!isDatabaseId) saveLocalListing(newProp);
    setProperties((prev) => [newProp, ...prev]);
    navigateTo(`/property/${getPropertySlug(newProp)}`);
  };

  // Sample listings (and anything added in-browser) use the `prop-` id prefix and
  // live only in this tab. Anything else came from /api/v1/properties, so an edit
  // there has to go back to the API instead of only changing local state.
  const isBrowserOnlyListing = (id) =>
    String(id || '').startsWith('prop-') || isLocalListing(id);

  const buildApiPatch = (prop) => {
    const furnishingMap = {
      'Fully Furnished': 'FULLY_FURNISHED',
      'Semi-Furnished': 'SEMI_FURNISHED',
      Unfurnished: 'UNFURNISHED'
    };
    const payload = {
      title: prop.title,
      locality: prop.locality,
      city: prop.city,
      price: Number(prop.price) || 0
    };
    if (prop.description) payload.description = prop.description;
    if (Number(prop.areaSqFt) > 0) payload.superBuiltUpArea = Number(prop.areaSqFt);
    const bedrooms = parseInt(String(prop.bhk), 10);
    if (Number.isFinite(bedrooms)) payload.bedrooms = bedrooms;
    if (Number(prop.baths) >= 0) payload.bathrooms = Number(prop.baths) || 0;
    if (Number(prop.balconies) >= 0) payload.balconies = Number(prop.balconies) || 0;
    if (furnishingMap[prop.furnishing]) payload.furnishingStatus = furnishingMap[prop.furnishing];
    if (prop.reraId) payload.reraId = prop.reraId;
    return payload;
  };

  const handleUpdateProperty = async (updated) => {
    if (!isBrowserOnlyListing(updated.id)) {
      const res = await fetch(`/api/v1/properties/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(buildApiPatch(updated))
      });
      let body = null;
      try {
        body = await res.json();
      } catch (err) {
        body = null;
      }
      if (!res.ok) {
        const reason = (body && (body.message || body.error)) || `API responded ${res.status}`;
        throw new Error(`Not saved — the properties API rejected this change: ${reason}`);
      }
    }

    if (isBrowserOnlyListing(updated.id)) {
      // There is no database row to PATCH for these, so the edit is kept on
      // this device instead of being dropped on the next reload.
      savePropertyEdit(updated);
    }

    setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    return {
      message: isBrowserOnlyListing(updated.id)
        ? 'Saved on this device — the change stays after a refresh. This listing has no database row, so other devices still see the original.'
        : 'Saved to the properties API and refreshed in the table.'
    };
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
        setSelectedCity={handleCityChange}
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
            isShortlisted={shortlistIds.some((id) => String(id) === String(currentProperty.id))}
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
        /* Private dashboard — signed in only, and different per account role */
        <RoleDashboard
          user={authUser}
          properties={properties}
          dataSource={dataSource}
          apiError={apiError}
          onRetryFetch={loadProperties}
          onNavigate={navigateTo}
          shortlistIds={shortlistIds}
          shortlistedProperties={shortlistedProperties}
          recentViews={recentViews}
          onToggleShortlist={handleToggleShortlist}
          onOpenPostProperty={() => setIsPostPropertyOpen(true)}
          onEditProperty={(prop) => setEditingProperty(prop)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      ) : isCollectionRoute ? (
        /* Full 99acres Detailed Collection Page with Left Filter Sidebar */
        <CollectionPage
          properties={properties}
          selectedCity={selectedCity}
          setSelectedCity={handleCityChange}
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
                  <span>NCRBRIX Collection View</span>
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
                    isShortlisted={shortlistIds.some((id) => String(id) === String(prop.id))}
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

      {/* Edit an existing listing from the dashboard table */}
      <EditPropertyModal
        isOpen={Boolean(editingProperty)}
        property={editingProperty}
        onClose={() => setEditingProperty(null)}
        onSave={handleUpdateProperty}
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
