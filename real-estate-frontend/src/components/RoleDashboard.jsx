import React, { useMemo } from 'react';
import {
  Lock,
  LogIn,
  ShieldAlert,
  Building2,
  Inbox,
  BadgeCheck,
  Info
} from 'lucide-react';
import DashboardPage from './DashboardPage';
import BuyerDashboard from './BuyerDashboard';
import { getUserRole, isListerRole, setStoredUser } from '../auth/authStore';
import { DEMO_ACCOUNTS } from '../auth/demoAccounts';

// A listing belongs to the signed-in account when the API's ownerId (or the
// included owner object) matches their user id. Admins oversee all listings.
function isOwnedBy(property, user) {
  if (!property || !user || user.id === undefined || user.id === null) return false;
  if (getUserRole(user) === 'ADMIN') return true;
  const uid = String(user.id);
  if (property.ownerId !== undefined && property.ownerId !== null) {
    return String(property.ownerId) === uid;
  }
  if (property.owner && property.owner.id !== undefined) {
    return String(property.owner.id) === uid;
  }
  return false;
}

export default function RoleDashboard({
  user,
  properties = [],
  dataSource,
  apiError,
  onRetryFetch,
  onNavigate,
  shortlistIds = [],
  shortlistedProperties = [],
  recentViews = [],
  onToggleShortlist,
  onOpenPostProperty,
  onEditProperty,
  onOpenAuth
}) {
  const role = getUserRole(user);

  const myProperties = useMemo(
    () => properties.filter((p) => isOwnedBy(p, user)),
    [properties, user]
  );

  // 1. Not signed in: the dashboard is not rendered at all.
  if (!user) {
    return (
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign in required</h1>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            The dashboard is private. Sign in with Admin, Owner, or Agent dummy accounts
            to inspect their dashboards.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => (onOpenAuth ? onOpenAuth() : null)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition inline-flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Demo Accounts</span>
            </button>
            <button
              onClick={() => (onNavigate ? onNavigate('/') : null)}
              className="text-sm font-bold text-slate-500 hover:text-slate-800"
            >
              Back to home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 2. Buyers never see the listings management table.
  if (!isListerRole(user)) {
    return (
      <BuyerDashboard
        user={user}
        shortlistedProperties={shortlistedProperties}
        recentViews={recentViews}
        onNavigate={onNavigate}
        onToggleShortlist={onToggleShortlist}
      />
    );
  }

  // 3. Owner / Agent / Admin: scoped to their own account or platform oversight.
  const missingId = user.id === undefined || user.id === null;
  const isAdmin = role === 'ADMIN';
  const isAgent = role === 'AGENT';
  const isOwner = role === 'OWNER';

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Quick Demo Switcher Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 mb-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Test Role Switcher:
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Toggle between Admin, Owner, and Agent dashboards
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setStoredUser(DEMO_ACCOUNTS.admin)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                isAdmin
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>👑 Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setStoredUser(DEMO_ACCOUNTS.owner)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                isOwner
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>🏡 Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setStoredUser(DEMO_ACCOUNTS.agent)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                isAgent
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>💼 Agent</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              isAdmin ? 'bg-purple-50 text-purple-700' : isAgent ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-50 text-brand-700'
            }`}>
              <BadgeCheck className="w-5 h-5" />
            </div>
            <p className="text-sm font-black text-slate-900 capitalize">
              {isAdmin ? 'Admin Portal' : `${role.toLowerCase()} account`}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {user.name || user.email}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-none">
              {myProperties.length}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1.5">
              {isAdmin ? 'Total Platform Listings' : 'Your Listings'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-none">
              {isAdmin ? `${properties.filter((p) => p.verified).length}` : '--'}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1.5">
              {isAdmin ? 'Verified Properties' : 'Enquiries Received'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
              {isAdmin
                ? 'All verified listings currently active across the marketplace.'
                : 'No enquiries endpoint in the API yet, so there is no real number to show here.'}
            </p>
          </div>
        </div>

        {missingId ? (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 leading-relaxed">
              <strong>Your session has no account id.</strong> Sign out and sign in
              again so your listings can be matched to you; until then this table
              stays empty instead of showing other people's properties.
            </p>
          </div>
        ) : null}

        {!missingId && myProperties.length === 0 ? (
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Nothing listed under this account yet. Use{' '}
              <strong>Post Property</strong> to add your first listing.
            </p>
          </div>
        ) : null}
      </div>

      <DashboardPage
        properties={myProperties}
        dataSource={dataSource}
        apiError={apiError}
        onRetryFetch={onRetryFetch}
        onNavigate={onNavigate}
        shortlistIds={shortlistIds}
        onToggleShortlist={onToggleShortlist}
        onOpenPostProperty={onOpenPostProperty}
        onEditProperty={onEditProperty}
      />
    </div>
  );
}
