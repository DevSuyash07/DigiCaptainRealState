import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Building,
  Check,
  Send,
  Calculator
} from 'lucide-react';
import { formatIndianPrice } from '../data/mockProperties';

export default function PropertyDetailModal({ 
  property, 
  onClose, 
  isShortlisted, 
  onToggleShortlist 
}) {
  if (!property) return null;

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      // Auto reset feedback after 4s
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {property.reraApproved && (
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                RERA ID: <strong className="text-slate-800">{property.reraId}</strong>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleShortlist(property.id)}
              className={`p-2 rounded-xl border transition ${
                isShortlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Gallery Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Primary Large Image */}
            <div className="lg:col-span-8 relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              <img
                src={property.images[activePhotoIdx]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between">
                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev - 1 + property.images.length) % property.images.length)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev + 1) % property.images.length)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                Photo {activePhotoIdx + 1} of {property.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-96 pb-2">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIdx(i)}
                  className={`relative shrink-0 w-24 h-20 sm:w-28 sm:h-24 lg:w-full lg:h-28 rounded-xl overflow-hidden border-2 transition ${
                    activePhotoIdx === i ? 'border-brand-600 scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>

          {/* Title & Key Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Details */}
            <div className="lg:col-span-8 space-y-6">
              
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-3xl font-black text-slate-900">
                    {formatIndianPrice(property.price, property.purpose)}
                    {property.pricePerSqFt && (
                      <span className="text-sm text-slate-500 font-semibold ml-2">
                        (₹ {property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft)
                      </span>
                    )}
                  </div>
                  {property.verified && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                      99acres Verified Property
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-sm text-slate-600 font-medium mt-1">
                  <MapPin className="w-4 h-4 text-brand-600 mr-1 shrink-0" />
                  <span>{property.locality}, {property.city}</span>
                </div>
              </div>

              {/* Comprehensive Property Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">Bedrooms / BHK</span>
                  <strong className="text-slate-900 font-extrabold">{property.bhk}</strong>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">Super Builtup Area</span>
                  <strong className="text-slate-900 font-extrabold">{property.areaSqFt} sq.ft</strong>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">Bathrooms</span>
                  <strong className="text-slate-900 font-extrabold">{property.baths || '2'} Baths</strong>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">Balconies</span>
                  <strong className="text-slate-900 font-extrabold">{property.balconies || '2'} Balconies</strong>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">Furnishing Status</span>
                  <strong className="text-slate-900 font-extrabold">{property.furnishing}</strong>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">Facing / Vastu</span>
                  <strong className="text-slate-900 font-extrabold">{property.facing}</strong>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">Floor Info</span>
                  <strong className="text-slate-900 font-extrabold">{property.floor}</strong>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">Possession Status</span>
                  <strong className="text-emerald-700 font-extrabold">{property.possession}</strong>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">About This Property</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200">
                  {property.description}
                </p>
              </div>

              {/* Amenities List */}
              {property.amenities && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Project & Society Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm font-semibold text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right 4 Cols: Contact Form & Agent Card */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Agent / Owner Info Card */}
              <div className="bg-gradient-to-br from-brand-900 to-brand-700 text-white rounded-2xl p-5 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Direct Contact Desk
                </span>
                <div className="flex items-center space-x-3 mt-3">
                  <div className="w-12 h-12 rounded-full bg-white text-brand-700 font-black text-lg flex items-center justify-center shadow">
                    {property.contact?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-base">{property.contact?.name}</h4>
                    <p className="text-xs text-slate-300 font-medium">{property.contact?.badge}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                    <strong className="text-white text-sm">{property.contact?.phone}</strong>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-200">
                    <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="truncate">{property.contact?.email}</span>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  Send Instant Callback Inquiry
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Get verified seller contact details and schedule a property tour.
                </p>

                {inquirySent ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h5 className="font-bold text-emerald-900 text-sm">Inquiry Sent Successfully!</h5>
                    <p className="text-xs text-emerald-700 mt-1">The property manager will contact you within 15 minutes.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Your Full Name"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="Mobile Number (+91)"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-brand-600/30 flex items-center justify-center space-x-2 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Instant Callback</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      By submitting you agree to 99acres Terms of Use and Privacy Policy.
                    </p>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
