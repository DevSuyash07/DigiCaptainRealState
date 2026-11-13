import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Building2,
  Users,
  Clock,
  Smartphone,
  Info
} from 'lucide-react';
import { getLocalListings } from '../data/propertyStore';
import { API_BASE_URL } from '../config/featureFlags';

// Platform-wide listings view for an admin account.
//
// It asks /api/v1/properties itself instead of reusing the merged list the
// home page renders, because that merged list also contains the built-in
// sample properties from src/data/mockProperties.js. An admin checking "has
// anybody posted a property?" must never be shown a sample as if a real
// person had posted it.
//
// When the API cannot be reached the table stays empty and the reason is
// printed. Nothing here invents a listing, an owner, or a count.

const LISTINGS_URL = `${API_BASE_URL}/api/v1/properties?limit=100&sortBy=createdAt&sortOrder=desc`;

const formatPrice = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return '--';
  if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
  return num.toLocaleString('en-IN');
};

const formatDate = (value) => {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const titleOf = (prop) =>
  prop.title || prop.name || `Listing #${prop.id !== undefined ? prop.id : '?'}`;

const placeOf = (prop) =>
  [prop.locality, prop.city].filter(Boolean).join(', ') || prop.address || '--';

const posterOf = (prop) => {
  const owner = prop.owner && typeof prop.owner === 'object' ? prop.owner : null;
  const name = owner && owner.name ? owner.name : '';
  const role = owner && owner.role ? String(owner.role).toLowerCase() : '';
  const id = prop.ownerId !== undefined && prop.ownerId !== null ? prop.ownerId : owner && owner.id;
  if (name) return role ? `${name} (${role})` : name;
  if (id !== undefined && id !== null) return `User #${id}`;
  return 'No owner on the row';
};

export default function AdminDashboard({ user, onNavigate }) {
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setStatus('loading');
    setError('');
    fetch(LISTINGS_URL, { credentials: 'include' })
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.toLowerCase().includes('application/json')) {
          throw new Error(
            `The properties API answered ${res.status} with ${
              contentType || 'no content type'
            }, not JSON. On this deployment /api/v1/* is served by the frontend, which means the backend API is not deployed yet.`
          );
        }
        const body = await res.json();
        if (!res.ok) {
          const reason = (body && (body.message || body.error)) || `status ${res.status}`;
          throw new Error(`The properties API refused the request: ${reason}`);
        }
        return body;
      })
      .then((body) => {
        const payload = body && body.data ? body.data : null;
        const list = Array.isArray(payload)
          ? payload
          : payload && Array.isArray(payload.properties)
            ? payload.properties
            : null;
        if (!list) {
          throw new Error('The properties API returned a body with no properties array in it.');
        }
        setRows(list);
        setTotal(
          body && body.pagination && Number.isFinite(Number(body.pagination.total))
            ? Number(body.pagination.total)
            : list.length
        );
        setStatus('ok');
      })
      .catch((err) => {
        setRows([]);
        setTotal(null);
        setError(err && err.message ? err.message : 'request failed');
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const localListings = useMemo(() => getLocalListings(), []);

  const posters = useMemo(() => {
    const seen = new Set();
    for (const prop of rows) {
      const owner = prop.owner && typeof prop.owner === 'object' ? prop.owner : null;
      const id = prop.ownerId !== undefined && prop.ownerId !== null ? prop.ownerId : owner && owner.id;
      if (id !== undefined && id !== null) seen.add(String(id));
    }
    return seen.size;
  }, [rows]);

  const recentCount = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return rows.filter((prop) => {
      const created = prop.createdAt ? new Date(prop.createdAt).getTime() : NaN;
      return Number.isFinite(created) && created >= cutoff;
    }).length;
  }, [rows]);

  return (
    <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-start space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Admin — all listings</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Signed in as {user && (user.name || user.email) ? user.name || user.email : 'admin'} ·
              every property stored by the API, newest first
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={load}
            className="bg-white border border-slate-200 hover:border-brand-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
            <span>{status === 'loading' ? 'Checking…' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => (onNavigate ? onNavigate('/collection') : null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Browse site
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">
            {status === 'ok' && total !== null ? total : '--'}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1.5">
            Listings in the database
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">
            {status === 'ok' ? recentCount : '--'}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1.5">
            Posted in last 7 days
          </p>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
            Counted from the {rows.length} newest rows loaded here.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">
            {status === 'ok' ? posters : '--'}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1.5">
            Different people posting
          </p>
        </div>
      </div>

      {status === 'error' ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start space-x-2.5 mb-5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-[12px] text-rose-900 leading-relaxed">
            <strong>No listing data could be read, so this page is showing none.</strong>
            <p className="mt-1">{error}</p>
            <p className="mt-1">
              Until the API answers, nobody's posted property can be monitored from here — not
              because there are none, but because there is nothing to read.
            </p>
          </div>
        </div>
      ) : null}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Posted by</th>
                <th className="px-4 py-3">For</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Posted on</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center">
                    <p className="text-sm font-bold text-slate-700">
                      {status === 'loading'
                        ? 'Reading the properties API…'
                        : status === 'ok'
                          ? 'The API answered, and it holds no listings yet.'
                          : 'Nothing to show — the API could not be read.'}
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((prop) => (
                  <tr key={String(prop.id)} className="text-sm hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 leading-snug">{titleOf(prop)}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{placeOf(prop)}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{posterOf(prop)}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {prop.propertyFor ? String(prop.propertyFor).toLowerCase() : '--'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">₹ {formatPrice(prop.price)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(prop.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-2.5">
        <Smartphone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-600 leading-relaxed">
          <strong>What this page cannot see.</strong> While the backend API is not reachable, the
          Post Property form keeps a new listing in the visitor's own browser
          (src/data/propertyStore.js). Those never leave that device, so they cannot appear here
          for anyone else.{' '}
          {localListings.length > 0
            ? `This browser itself is holding ${localListings.length} such listing${
                localListings.length === 1 ? '' : 's'
              }.`
            : 'This browser is holding none of them.'}
        </div>
      </div>

      <div className="mt-3 bg-white border border-slate-200 rounded-2xl p-4 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-600 leading-relaxed">
          <strong>Who sees this page.</strong> The email addresses listed in the
          <code className="mx-1 px-1 py-0.5 bg-slate-100 rounded">VITE_ADMIN_EMAILS</code>
          environment variable, and nobody else. The signup role picker cannot grant it.
        </div>
      </div>
    </main>
  );
}
