import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Heart,
  PlusCircle,
  Pencil,
  Search,
  Layers,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  RefreshCw,
  Home,
  Key,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { formatIndianPrice, getPropertySlug, PROPERTY_TYPES, CITIES } from '../data/mockProperties';

const TYPE_LABELS = PROPERTY_TYPES.reduce((acc, t) => {
  acc[t.id] = t.label;
  return acc;
}, {});

function typeLabel(id) {
  return TYPE_LABELS[id] || (id ? String(id) : 'Unspecified');
}

function compactValue(num) {
  const n = Number(num) || 0;
  if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (n >= 100000) return `₹ ${(n / 100000).toFixed(2).replace(/\.00$/, '')} Lac`;
  return `₹ ${n.toLocaleString('en-IN')}`;
}

function StatCard({ icon: Icon, label, value, sub, tone }) {
  const tones = {
    brand: 'from-brand-600 to-brand-800 text-white',
    emerald: 'from-emerald-600 to-teal-700 text-white',
    amber: 'from-amber-500 to-orange-600 text-white',
    slate: 'from-slate-700 to-slate-900 text-white'
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-1 truncate">{value}</p>
        {sub && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{sub}</p>}
      </div>
      <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${tones[tone] || tones.brand} flex items-center justify-center shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

function BreakdownPanel({ title, icon: Icon, rows }) {
  const max = rows.reduce((m, r) => Math.max(m, r.count), 0) || 1;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="w-4 h-4 text-brand-600" />
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-slate-400">No data to summarise yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 truncate pr-3">{r.key}</span>
                <span className="font-black text-slate-900 shrink-0">{r.count}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full"
                  style={{ width: `${Math.round((r.count / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage({
  properties = [],
  dataSource = 'offline',
  apiError = '',
  onRetryFetch,
  onNavigate,
  shortlistIds = [],
  onToggleShortlist,
  onOpenPostProperty,
  onEditProperty
}) {
  const [query, setQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState({ key: 'price', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const stats = useMemo(() => {
    const total = properties.length;
    const sale = properties.filter((p) => p.purpose === 'buy').length;
    const rent = properties.filter((p) => p.purpose === 'rent').length;
    const verified = properties.filter((p) => p.verified).length;
    const rera = properties.filter((p) => p.reraApproved).length;
    const featured = properties.filter((p) => p.featured).length;
    const saleProps = properties.filter((p) => p.purpose === 'buy');
    const portfolio = saleProps.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const ppsfList = saleProps.map((p) => Number(p.pricePerSqFt) || 0).filter((n) => n > 0);
    const avgPpsf = ppsfList.length
      ? Math.round(ppsfList.reduce((a, b) => a + b, 0) / ppsfList.length)
      : 0;
    const areaList = properties.map((p) => Number(p.areaSqFt) || 0).filter((n) => n > 0);
    const totalArea = areaList.reduce((a, b) => a + b, 0);
    return { total, sale, rent, verified, rera, featured, portfolio, avgPpsf, totalArea };
  }, [properties]);

  const byCity = useMemo(() => {
    const map = new Map();
    properties.forEach((p) => {
      const k = p.city || 'Unknown city';
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map, ([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
  }, [properties]);

  const byType = useMemo(() => {
    const map = new Map();
    properties.forEach((p) => {
      const k = typeLabel(p.type);
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map, ([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
  }, [properties]);

  const byPostedBy = useMemo(() => {
    const map = new Map();
    properties.forEach((p) => {
      const k = p.postedBy || 'Not specified';
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map, ([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
  }, [properties]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = properties.filter((p) => {
      if (cityFilter !== 'all' && p.city !== cityFilter) return false;
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (purposeFilter !== 'all' && p.purpose !== purposeFilter) return false;
      if (verifiedOnly && !p.verified) return false;
      if (q) {
        const haystack = [p.title, p.locality, p.city, p.id, p.bhk, p.postedBy, p.reraId]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const dir = sort.dir === 'asc' ? 1 : -1;
    return rows.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (typeof av === 'number' || typeof bv === 'number') {
        return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
      }
      return String(av || '').localeCompare(String(bv || '')) * dir;
    });
  }, [properties, query, cityFilter, typeFilter, purposeFilter, verifiedOnly, sort]);

  useEffect(() => {
    setPage(1);
  }, [query, cityFilter, typeFilter, purposeFilter, verifiedOnly, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }
    );
  };

  const resetFilters = () => {
    setQuery('');
    setCityFilter('all');
    setTypeFilter('all');
    setPurposeFilter('all');
    setVerifiedOnly(false);
  };

  const filtersActive =
    query || cityFilter !== 'all' || typeFilter !== 'all' || purposeFilter !== 'all' || verifiedOnly;

  const SortButton = ({ label, sortKey, className = '' }) => (
    <button
      onClick={() => toggleSort(sortKey)}
      className={`flex items-center space-x-1 font-bold uppercase tracking-wider text-[11px] transition ${
        sort.key === sortKey ? 'text-brand-700' : 'text-slate-500 hover:text-slate-800'
      } ${className}`}
    >
      <span>{label}</span>
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page heading */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Listings Control Centre</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Properties Dashboard</h1>
          <p className="text-slate-200 text-xs sm:text-sm max-w-2xl">
            Every listing in one table &mdash; search, filter by city, type and purpose, sort by price or area,
            and jump straight to any property page.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPostProperty}
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-brand-900 font-extrabold px-5 py-3 rounded-2xl text-sm shadow-lg transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Listing</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/collection')}
            className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-4 py-3 rounded-2xl text-sm transition"
          >
            <Layers className="w-4 h-4" />
            <span>Public Collection</span>
          </button>
        </div>
      </div>

      {/* Data source honesty banner */}
      {dataSource === 'live' ? (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
          <p className="text-xs font-semibold">
            Live data: listings loaded from the API at <code className="font-mono">/api/v1/properties</code>.
          </p>
        </div>
      ) : dataSource === 'loading' ? (
        <div className="flex items-start gap-3 bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3">
          <RefreshCw className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
          <p className="text-xs font-semibold">Contacting the properties API&hellip;</p>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl px-4 py-3">
          <X className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
          <div className="text-xs space-y-1">
            <p className="font-black uppercase tracking-wide">Not live data &mdash; showing the built-in sample dataset</p>
            <p className="font-medium">
              <code className="font-mono">/api/v1/properties</code> did not return listings
              {apiError ? ` (${apiError})` : ''}. Numbers below describe the sample data, not your database.
            </p>
            {onRetryFetch && (
              <button
                onClick={onRetryFetch}
                className="inline-flex items-center space-x-1.5 mt-1 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry API</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={Building2} tone="brand" label="Total Listings" value={stats.total} sub={`${byCity.length} cities covered`} />
        <StatCard icon={Home} tone="slate" label="For Sale" value={stats.sale} sub={stats.total ? `${Math.round((stats.sale / stats.total) * 100)}% of inventory` : '—'} />
        <StatCard icon={Key} tone="slate" label="For Rent" value={stats.rent} sub={stats.total ? `${Math.round((stats.rent / stats.total) * 100)}% of inventory` : '—'} />
        <StatCard icon={CheckCircle2} tone="emerald" label="Verified" value={stats.verified} sub={`${stats.rera} RERA approved`} />
        <StatCard icon={Layers} tone="amber" label="Sale Portfolio" value={compactValue(stats.portfolio)} sub={`${stats.featured} featured listings`} />
        <StatCard icon={MapPin} tone="brand" label="Avg Rate" value={stats.avgPpsf ? `₹ ${stats.avgPpsf.toLocaleString('en-IN')}` : '—'} sub={`per sq.ft · ${stats.totalArea.toLocaleString('en-IN')} sq.ft total`} />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BreakdownPanel title="Listings by City" icon={MapPin} rows={byCity} />
        <BreakdownPanel title="Listings by Property Type" icon={Building2} rows={byType} />
        <BreakdownPanel title="Listings by Poster" icon={CheckCircle2} rows={byPostedBy} />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, locality, city, listing ID or RERA number"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Cities</option>
              {CITIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>

            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Sale &amp; Rent</option>
              <option value="buy">For Sale</option>
              <option value="rent">For Rent</option>
            </select>

            <button
              onClick={() => setVerifiedOnly((v) => !v)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 ${
                verifiedOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified only</span>
            </button>

            {filtersActive && (
              <button
                onClick={resetFilters}
                className="px-3 py-2.5 rounded-xl text-xs font-bold text-brand-700 hover:bg-brand-50 border border-brand-200 flex items-center space-x-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-brand-600" />
            <span>
              Showing <strong className="text-slate-900">{filtered.length}</strong> of{' '}
              <strong className="text-slate-900">{stats.total}</strong> listings
            </span>
          </span>
          <label className="flex items-center space-x-2">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      {/* Listings table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {pageRows.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-14 h-14 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-800">No listings match these filters</h3>
            <p className="text-xs text-slate-500 mt-1">Clear the filters to see the full inventory again.</p>
            {filtersActive && (
              <button
                onClick={resetFilters}
                className="mt-5 bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3"><SortButton label="Property" sortKey="title" /></th>
                  <th className="text-left px-4 py-3"><SortButton label="City" sortKey="city" /></th>
                  <th className="text-left px-4 py-3"><SortButton label="Type" sortKey="type" /></th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Config</th>
                  <th className="text-right px-4 py-3"><SortButton label="Area" sortKey="areaSqFt" className="ml-auto" /></th>
                  <th className="text-right px-4 py-3"><SortButton label="Price" sortKey="price" className="ml-auto" /></th>
                  <th className="text-right px-4 py-3"><SortButton label="Rate/sq.ft" sortKey="pricePerSqFt" className="ml-auto" /></th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageRows.map((p) => {
                  const shortlisted = shortlistIds.includes(p.id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3 max-w-[380px]">
                          <div className="w-14 h-11 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                            {p.images && p.images[0] ? (
                              <img src={p.images[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">{p.title || 'Untitled listing'}</p>
                            <p className="text-[11px] text-slate-500 truncate">{p.locality || '—'}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700 whitespace-nowrap">{p.city || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{typeLabel(p.type)}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                        <span className="font-bold text-slate-800">{p.bhk || '—'}</span>
                        <span className="text-slate-400"> · {p.baths || 0} bath</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-right text-slate-700 whitespace-nowrap">
                        {p.areaSqFt ? `${Number(p.areaSqFt).toLocaleString('en-IN')} sq.ft` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="font-black text-slate-900 text-xs">{formatIndianPrice(p.price, p.purpose)}</span>
                        <span className={`block text-[10px] font-bold uppercase ${p.purpose === 'rent' ? 'text-sky-600' : 'text-emerald-600'}`}>
                          {p.purpose === 'rent' ? 'Rent' : 'Sale'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-right text-slate-700 whitespace-nowrap">
                        {p.pricePerSqFt ? `₹ ${Number(p.pricePerSqFt).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[190px]">
                          {p.verified && (
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">Verified</span>
                          )}
                          {p.reraApproved && (
                            <span className="text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 px-1.5 py-0.5 rounded">RERA</span>
                          )}
                          {p.featured && (
                            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">Featured</span>
                          )}
                          <span className="text-[10px] font-semibold text-slate-500 block w-full truncate">
                            {p.possession || '—'} · {p.postedBy || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onNavigate && onNavigate(`/property/${getPropertySlug(p)}`)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-brand-600 hover:bg-brand-700 text-white transition whitespace-nowrap"
                          >
                            View
                          </button>
                          {onEditProperty && (
                            <button
                              onClick={() => onEditProperty(p)}
                              title="Edit this listing"
                              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 transition whitespace-nowrap inline-flex items-center space-x-1"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          )}
                          <button
                            onClick={() => onToggleShortlist && onToggleShortlist(p.id)}
                            title={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                            className={`p-1.5 rounded-lg border transition ${
                              shortlisted
                                ? 'bg-rose-50 border-rose-200 text-rose-600'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${shortlisted ? 'fill-rose-500' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-[11px] font-semibold text-slate-500">
              Page {safePage} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, safePage - 1))}
                disabled={safePage <= 1}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-300 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                disabled={safePage >= totalPages}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-300 transition"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
