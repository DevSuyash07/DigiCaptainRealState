import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Upload, 
  Building, 
  Home, 
  DollarSign, 
  MapPin, 
  User, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { CITIES, PROPERTY_TYPES, BHK_OPTIONS } from '../data/mockProperties';

export default function PostPropertyModal({ isOpen, onClose, onPropertyAdded }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    purpose: 'buy', // buy (for sale) or rent
    type: 'apartment',
    title: '',
    locality: '',
    city: 'Delhi NCR',
    bhk: '3 BHK',
    price: '',
    areaSqFt: '',
    furnishing: 'Semi-Furnished',
    description: '',
    userName: '',
    userPhone: '',
    userRole: 'Owner',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProperty = {
      id: `prop-${Date.now()}`,
      title: formData.title || `${formData.bhk} ${formData.type} in ${formData.locality}`,
      locality: formData.locality || 'Prime Locality',
      city: formData.city,
      price: Number(formData.price) || 8500000,
      pricePerSqFt: Math.round((Number(formData.price) || 8500000) / (Number(formData.areaSqFt) || 1500)),
      areaSqFt: Number(formData.areaSqFt) || 1500,
      bhk: formData.bhk,
      baths: 2,
      balconies: 2,
      type: formData.type,
      purpose: formData.purpose,
      furnishing: formData.furnishing,
      facing: 'East Facing Vastu Compliant',
      floor: '5th of 15 Floors',
      possession: 'Ready to Move',
      postedBy: `${formData.userRole} (Zero Brokerage)`,
      postedDate: 'Just Now',
      verified: true,
      reraApproved: true,
      reraId: 'RERA/NEW/2026/01',
      featured: true,
      images: [
        formData.imageUrl,
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
      ],
      description: formData.description || 'Newly listed verified property with modern amenities and high connectivity.',
      amenities: ['24x7 Security', 'Power Backup', 'Covered Parking', 'Gated Community'],
      contact: {
        name: formData.userName || 'Property Owner',
        phone: formData.userPhone || '+91 98000 00000',
        email: 'contact@propertyowner.in',
        badge: `Verified ${formData.userRole}`
      }
    };

    onPropertyAdded(newProperty);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-brand-800 to-brand-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 font-black flex items-center justify-center text-xs">
              FREE
            </div>
            <div>
              <h3 className="font-bold text-base">Post Free Property Ad on 99acres</h3>
              <p className="text-xs text-slate-200">Reach 10+ Lac genuine buyers and tenants every month</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-200 hover:text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        {!isSuccess && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
            <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-brand-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}>1</span>
              <span>Type & Purpose</span>
            </div>
            <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-brand-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}>2</span>
              <span>Location & Price</span>
            </div>
            <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-brand-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}>3</span>
              <span>Publish</span>
            </div>
          </div>
        )}

        {/* Modal Form Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Property Listed Successfully!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your property ad is now live on 99acres and visible to thousands of potential buyers in {formData.city}.
              </p>
              <button
                onClick={handleReset}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition"
              >
                View Live Listing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      I want to:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, purpose: 'buy' })}
                        className={`py-3 px-4 rounded-xl font-bold text-sm border text-center transition ${
                          formData.purpose === 'buy'
                            ? 'bg-brand-50 border-brand-600 text-brand-700 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Sell Property
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, purpose: 'rent' })}
                        className={`py-3 px-4 rounded-xl font-bold text-sm border text-center transition ${
                          formData.purpose === 'rent'
                            ? 'bg-brand-50 border-brand-600 text-brand-700 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Rent / Lease Out
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Property Type:
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500"
                    >
                      {PROPERTY_TYPES.filter(t => t.id !== 'all').map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      BHK / Configuration:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {BHK_OPTIONS.map((bhk) => (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => setFormData({ ...formData, bhk })}
                          className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition ${
                            formData.bhk === bhk
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {bhk}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center space-x-1.5 shadow"
                    >
                      <span>Continue to Location</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                      >
                        {CITIES.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Locality / Sector</label>
                      <input
                        type="text"
                        required
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        placeholder="e.g. Sector 65, Golf Course Extn"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Expected {formData.purpose === 'buy' ? 'Price (₹)' : 'Monthly Rent (₹)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder={formData.purpose === 'buy' ? 'e.g. 15000000 (1.5 Cr)' : 'e.g. 45000'}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Super Area (Sq.Ft)</label>
                      <input
                        type="number"
                        required
                        value={formData.areaSqFt}
                        onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                        placeholder="e.g. 1850"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Property Ad Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Luxury 3 BHK with Modular Kitchen & Park Facing"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-slate-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-slate-100 flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center space-x-1.5 shadow"
                    >
                      <span>Continue to Contact</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        placeholder="e.g. Amit Sharma"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.userPhone}
                        onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">You Are:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Owner', 'Agent / Broker', 'Builder / Developer'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({ ...formData, userRole: role })}
                          className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition ${
                            formData.userRole === role
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Property Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Highlight key amenities, society features, sunlight, parking, etc."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-slate-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-slate-100 flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-2.5 rounded-xl text-sm flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30"
                    >
                      <Check className="w-4 h-4" />
                      <span>Publish Property (FREE)</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
