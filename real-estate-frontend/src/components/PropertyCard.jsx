import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Maximize2, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Share2,
  Building,
  Layers
} from 'lucide-react';
import { formatIndianPrice } from '../data/mockProperties';

export default function PropertyCard({ 
  property, 
  isShortlisted, 
  onToggleShortlist, 
  onSelectProperty,
  onContactClick 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property on 99acres: ${property.title} in ${property.locality}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  return (
    <div 
      onClick={() => onSelectProperty(property)}
      className="card-shine bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 flex flex-col md:flex-row cursor-pointer group"
    >
      {/* Left side: Image Carousel Preview */}
      <div className="relative md:w-80 h-56 md:h-auto bg-slate-900 shrink-0 overflow-hidden">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.verified && (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center shadow">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
            </span>
          )}
          {property.reraApproved && (
            <span className="bg-brand-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
              RERA
            </span>
          )}
          {property.postedBy.includes('Owner') && (
            <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
              0% Brokerage
            </span>
          )}
        </div>

        {/* Action buttons (Heart & Share) */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
          <button
            onClick={handleShare}
            className="p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition"
            title="Share Property"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(property.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition ${
              isShortlisted 
                ? 'bg-rose-500 text-white' 
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            title="Save Property"
          >
            <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Carousel Prev/Next Controls */}
        {property.images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImage}
              className="p-1 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="p-1 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image index pill */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md">
          {currentImageIndex + 1} / {property.images.length} Photos
        </div>

        <div className="absolute bottom-3 left-3 text-white text-xs font-semibold drop-shadow">
          Posted {property.postedDate}
        </div>
      </div>

      {/* Right side: Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Header & Pricing */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {formatIndianPrice(property.price, property.purpose)}
                </span>
                {property.pricePerSqFt && (
                  <span className="text-xs text-slate-500 font-medium">
                    (₹ {property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft)
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition mt-1">
                {property.title}
              </h3>
            </div>

            <span className="self-start text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg capitalize">
              {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>

          {/* Locality */}
          <div className="flex items-center text-xs text-slate-500 font-medium mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-600 mr-1 shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>

          {/* Key Specs Matrix */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 my-4 py-3 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Configuration</span>
              <strong className="text-slate-800 font-bold">{property.bhk}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Super Area</span>
              <strong className="text-slate-800 font-bold">{property.areaSqFt} sq.ft</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Furnishing</span>
              <strong className="text-slate-800 font-bold truncate block">{property.furnishing}</strong>
            </div>
            <div className="hidden sm:block">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
              <strong className="text-emerald-700 font-bold truncate block">{property.possession}</strong>
            </div>
          </div>

          {/* Short description preview */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {property.description}
          </p>

        </div>

        {/* Footer Actions & Contact info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Posted By User badge */}
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
              {property.contact?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <span className="text-slate-900 font-bold block leading-tight">{property.contact?.name}</span>
              <span className="text-[10px] text-brand-600 font-semibold">{property.contact?.badge}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProperty(property);
              }}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContactClick(property);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact {property.postedBy.includes('Owner') ? 'Owner' : 'Agent'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
