import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Save,
  Building2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  CITIES,
  PROPERTY_TYPES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  POSSESSION_OPTIONS,
  POSTED_BY_OPTIONS,
  formatIndianPrice
} from '../data/mockProperties';

function toForm(property) {
  const p = property || {};
  return {
    title: p.title || '',
    locality: p.locality || '',
    city: p.city || CITIES[0].name,
    type: p.type || 'apartment',
    purpose: p.purpose === 'rent' ? 'rent' : 'buy',
    bhk: p.bhk || '',
    baths: p.baths === 0 || p.baths ? String(p.baths) : '',
    balconies: p.balconies === 0 || p.balconies ? String(p.balconies) : '',
    price: p.price === 0 || p.price ? String(p.price) : '',
    areaSqFt: p.areaSqFt === 0 || p.areaSqFt ? String(p.areaSqFt) : '',
    furnishing: p.furnishing || FURNISHING_OPTIONS[1],
    facing: p.facing || '',
    floor: p.floor || '',
    possession: p.possession || POSSESSION_OPTIONS[0],
    postedBy: p.postedBy || POSTED_BY_OPTIONS[0],
    reraId: p.reraId || '',
    description: p.description || '',
    imageUrl: (p.images && p.images[0]) || '',
    verified: Boolean(p.verified),
    reraApproved: Boolean(p.reraApproved),
    featured: Boolean(p.featured)
  };
}

function withCurrent(options, current) {
  if (!current || options.includes(current)) return options;
  return [current, ...options];
}

export default function EditPropertyModal({ isOpen, property, onClose, onSave }) {
  const [form, setForm] = useState(() => toForm(property));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successNote, setSuccessNote] = useState('');

  // Refill the form every time a different listing is opened for editing.
  useEffect(() => {
    if (isOpen) {
      setForm(toForm(property));
      setSaving(false);
      setError('');
      setSuccessNote('');
    }
  }, [isOpen, property]);

  const bhkOptions = useMemo(() => withCurrent(BHK_OPTIONS, form.bhk), [form.bhk]);
  const possessionOptions = useMemo(
    () => withCurrent(POSSESSION_OPTIONS, form.possession),
    [form.possession]
  );
  const postedByOptions = useMemo(
    () => withCurrent(POSTED_BY_OPTIONS, form.postedBy),
    [form.postedBy]
  );
  const furnishingOptions = useMemo(
    () => withCurrent(FURNISHING_OPTIONS, form.furnishing),
    [form.furnishing]
  );

  const priceNum = Number(form.price) || 0;
  const areaNum = Number(form.areaSqFt) || 0;
  const ratePreview = areaNum > 0 ? Math.round(priceNum / areaNum) : 0;

  if (!isOpen || !property) return null;

  const setField = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildUpdated = () => ({
    ...property,
    title: form.title.trim() || property.title,
    locality: form.locality.trim(),
    city: form.city,
    type: form.type,
    purpose: form.purpose,
    bhk: form.bhk,
    baths: Number(form.baths) || 0,
    balconies: Number(form.balconies) || 0,
    price: priceNum,
    areaSqFt: areaNum,
    pricePerSqFt: ratePreview || property.pricePerSqFt || 0,
    furnishing: form.furnishing,
    facing: form.facing.trim(),
    floor: form.floor.trim(),
    possession: form.possession,
    postedBy: form.postedBy,
    reraId: form.reraId.trim(),
    description: form.description.trim(),
    verified: form.verified,
    reraApproved: form.reraApproved,
    featured: form.featured,
    images: form.imageUrl.trim()
      ? [form.imageUrl.trim(), ...((property.images || []).slice(1))]
      : property.images || []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNote('');
    setSaving(true);
    try {
      const result = await onSave(buildUpdated());
      setSuccessNote(
        (result && result.message) || 'Listing updated.'
      );
    } catch (err) {
      setError(
        err && err.message
          ? err.message
          : 'Could not save this listing. The change was not applied.'
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500';
  const labelClass = 'block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-4 overflow-hidden border border-slate-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 to-brand-700 text-white px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Edit Listing</p>
            <h3 className="font-black text-lg truncate">{property.title || 'Untitled listing'}</h3>
            <p className="text-[11px] text-slate-200 font-mono truncate">{property.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 shrink-0"
            aria-label="Close edit form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {successNote ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Listing updated</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">{successNote}</p>
              <button
                onClick={onClose}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-3 py-2.5">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                  <p className="text-xs font-semibold">{error}</p>
                </div>
              )}

              <div>
                <label className={labelClass}>Listing Title</label>
                <input type="text" required value={form.title} onChange={setField('title')} className={inputClass} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Locality / Sector</label>
                  <input type="text" value={form.locality} onChange={setField('locality')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <select value={form.city} onChange={setField('city')} className={inputClass}>
                    {withCurrent(CITIES.map((c) => c.name), form.city).map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Property Type</label>
                  <select value={form.type} onChange={setField('type')} className={inputClass}>
                    {PROPERTY_TYPES.filter((t) => t.id !== 'all').map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Listed For</label>
                  <select value={form.purpose} onChange={setField('purpose')} className={inputClass}>
                    <option value="buy">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Configuration</label>
                  <select value={form.bhk} onChange={setField('bhk')} className={inputClass}>
                    {bhkOptions.map((b) => (
                      <option key={b} value={b}>{b || 'Not specified'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>{form.purpose === 'rent' ? 'Monthly Rent (₹)' : 'Price (₹)'}</label>
                  <input type="number" min="0" required value={form.price} onChange={setField('price')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Area (sq.ft)</label>
                  <input type="number" min="0" required value={form.areaSqFt} onChange={setField('areaSqFt')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Bathrooms</label>
                  <input type="number" min="0" value={form.baths} onChange={setField('baths')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Balconies</label>
                  <input type="number" min="0" value={form.balconies} onChange={setField('balconies')} className={inputClass} />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <Info className="w-3.5 h-3.5 text-brand-600" />
                <span>
                  Rate recalculated as{' '}
                  <strong className="text-slate-800">
                    {ratePreview ? `₹ ${ratePreview.toLocaleString('en-IN')} / sq.ft` : '—'}
                  </strong>{' '}
                  for {formatIndianPrice(priceNum, form.purpose)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Furnishing</label>
                  <select value={form.furnishing} onChange={setField('furnishing')} className={inputClass}>
                    {furnishingOptions.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Possession</label>
                  <select value={form.possession} onChange={setField('possession')} className={inputClass}>
                    {possessionOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Posted By</label>
                  <select value={form.postedBy} onChange={setField('postedBy')} className={inputClass}>
                    {postedByOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Facing</label>
                  <input type="text" value={form.facing} onChange={setField('facing')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Floor</label>
                  <input type="text" value={form.floor} onChange={setField('floor')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>RERA ID</label>
                  <input type="text" value={form.reraId} onChange={setField('reraId')} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Main Image URL</label>
                <input type="url" value={form.imageUrl} onChange={setField('imageUrl')} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={setField('description')}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                {[
                  { key: 'verified', label: 'Verified' },
                  { key: 'reraApproved', label: 'RERA approved' },
                  { key: 'featured', label: 'Featured' }
                ].map((f) => (
                  <label key={f.key} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={form[f.key]}
                      onChange={setField(f.key)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg shadow-emerald-600/25 transition"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving…' : 'Save Changes'}</span>
                </button>
              </div>

              <p className="flex items-start gap-2 text-[11px] text-slate-500 font-medium">
                <Building2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                <span>
                  Listings loaded from the API are saved with a PATCH request to
                  <code className="font-mono mx-1">/api/v1/properties/{property.id}</code>.
                  Sample and browser-posted listings have no database row, so those edits are saved
                  on this device and stay after a refresh - other devices still see the original.
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
