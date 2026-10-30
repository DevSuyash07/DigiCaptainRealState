import React from 'react';
import {
  Heart,
  Eye,
  MessageSquare,
  Building2,
  MapPin,
  ArrowRight,
  Info,
  Search
} from 'lucide-react';
import { formatIndianPrice, getPropertySlug } from '../data/mockProperties';

const TONES = {
  brand: 'bg-brand-50 text-brand-700',
  rose: 'bg-rose-50 text-rose-600',
  slate: 'bg-slate-100 text-slate-500'
};

function StatCard({ icon: Icon, label, value, hint, tone }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
          TONES[tone] || TONES.brand
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1.5">
        {label}
      </p>
      {hint ? (
        <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">{hint}</p>
      ) : null}
    </div>
  );
}

export default function BuyerDashboard({
  user,
  shortlistedProperties = [],
  recentViews = [],
  onNavigate,
  onToggleShortlist
}) {
  const go = (path) => {
    if (typeof onNavigate === 'function') onNavigate(path);
  };

  return (
    <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Heading */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-1.5 bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5" />
          <span>Buyer Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Hi {user && user.name ? user.name : 'there'}, here is your activity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Shortlisted homes, the enquiries you sent and the listings you looked at
          recently.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Heart}
          tone="rose"
          label="Wishlisted Properties"
          value={shortlistedProperties.length}
          hint="Saved from listing and detail pages"
        />
        <StatCard
          icon={MessageSquare}
          tone="slate"
          label="Enquiries Sent"
          value="--"
          hint="Not countable yet: the API has no enquiries endpoint, so nothing is stored server-side to count."
        />
        <StatCard
          icon={Eye}
          tone="brand"
          label="Recently Viewed"
          value={recentViews.length}
          hint="Tracked in this browser for your account"
        />
      </div>

      {/* Wishlist */}
      <section className="mb-8">
        <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center space-x-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Your Wishlist ({shortlistedProperties.length})</span>
        </h2>

        {shortlistedProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-black text-slate-800">Nothing shortlisted yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Tap the heart on any listing to keep it here.
            </p>
            <button
              onClick={() => go('/collection')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition inline-flex items-center space-x-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Properties</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {shortlistedProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">
                    {prop.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {prop.locality}
                      {prop.city ? `, ${prop.city}` : ''}
                    </span>
                  </p>
                  <p className="text-sm font-black text-brand-700 mt-1.5">
                    {formatIndianPrice(prop.price, prop.purpose)}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <button
                    onClick={() => go(`/property/${getPropertySlug(prop)}`)}
                    className="bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  {typeof onToggleShortlist === 'function' ? (
                    <button
                      onClick={() => onToggleShortlist(prop.id)}
                      className="text-[11px] font-bold text-slate-400 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recently viewed */}
      <section className="mb-8">
        <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center space-x-2">
          <Eye className="w-4 h-4 text-brand-600" />
          <span>Recently Viewed ({recentViews.length})</span>
        </h2>

        {recentViews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-xs text-slate-500">
              No listings opened yet while signed in. Open any property and it will
              appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {recentViews.map((v) => (
              <button
                key={v.id}
                onClick={() => go(`/property/${v.slug || v.id}`)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {v.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {v.locality}
                    {v.city ? `, ${v.city}` : ''}
                  </p>
                </div>
                <span className="text-xs font-black text-brand-700 shrink-0">
                  {formatIndianPrice(v.price, v.purpose)}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Honest note about what is not wired up */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed">
          <strong>Enquiry history is not available yet.</strong> The backend has no
          enquiries table or endpoint, so there is nothing to read a real count from.
          Wishlist and recently-viewed are stored in this browser for your account.
        </p>
      </div>
    </main>
  );
}
