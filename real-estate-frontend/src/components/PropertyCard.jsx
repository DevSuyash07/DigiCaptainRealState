import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  Share2
} from 'lucide-react';
import { formatIndianPrice, getPropertySlug } from '../data/mockProperties';

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
    const slug = getPropertySlug(property);
    const url = `${window.location.origin}/property/${slug}`;
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property on 99acres: ${property.title} in ${property.locality}`,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
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
          {property.verified && (\n            <span className=\"bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center shadow\">\n              <ShieldCheck className=\"w-3.5 h-3.5 mr-1\" /> Verified\n            </span>\n          )}\n          {property.reraApproved && (\n            <span className=\"bg-brand-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow\">\n              RERA\n            </span>\n          )}\n          {property.postedBy.includes('Owner') && (\n            <span className=\"bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow\">\n              0% Brokerage\n            </span>\n          )}\n        </div>\n\n        {/* Action buttons (Heart & Share) */}\n        <div className=\"absolute top-3 right-3 flex items-center space-x-1.5 z-10\">\n          <button\n            onClick={handleShare}\n            className=\"p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition\"\n            title=\"Share Property\"\n          >\n            <Share2 className=\"w-4 h-4\" />\n          </button>\n          <button\n            onClick={(e) => {\n              e.stopPropagation();\n              onToggleShortlist(property.id);\n            }}\n            className={`p-1.5 rounded-full backdrop-blur-md transition ${\n              isShortlisted \n                ? 'bg-rose-500 text-white' \n                : 'bg-black/40 hover:bg-black/60 text-white'\n            }`}\n            title=\"Save Property\"\n          >\n            <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-white' : ''}`} />\n          </button>\n        </div>\n\n        {/* Carousel Prev/Next Controls */}\n        {property.images.length > 1 && (\n          <div className=\"absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity\">\n            <button\n              onClick={prevImage}\n              className=\"p-1 rounded-full bg-black/50 text-white hover:bg-black/80 transition\"\n            >\n              <ChevronLeft className=\"w-4 h-4\" />\n            </button>\n            <button\n              onClick={nextImage}\n              className=\"p-1 rounded-full bg-black/50 text-white hover:bg-black/80 transition\"\n            >\n              <ChevronRight className=\"w-4 h-4\" />\n            </button>\n          </div>\n        )}\n\n        {/* Image index pill */}\n        <div className=\"absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md\">\n          {currentImageIndex + 1} / {property.images.length} Photos\n        </div>\n\n        <div className=\"absolute bottom-3 left-3 text-white text-xs font-semibold drop-shadow\">\n          Posted {property.postedDate}\n        </div>\n      </div>\n\n      {/* Right side: Property Details */}\n      <div className=\"p-5 flex-1 flex flex-col justify-between\">\n        <div>\n          \n          {/* Header & Pricing */}\n          <div className=\"flex flex-col sm:flex-row sm:items-start justify-between gap-2\">\n            <div>\n              <div className=\"flex items-center space-x-2\">\n                <span className=\"text-2xl font-black text-slate-900 tracking-tight\">\n                  {formatIndianPrice(property.price, property.purpose)}\n                </span>\n                {property.pricePerSqFt && (\n                  <span className=\"text-xs text-slate-500 font-medium\">\n                    (₹ {property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft)\n                  </span>\n                )}\n              </div>\n              <h3 className=\"text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition mt-1\">\n                {property.title}\n              </h3>\n            </div>\n\n            <span className=\"self-start text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg capitalize\">\n              {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}\n            </span>\n          </div>\n\n          {/* Locality */}\n          <div className=\"flex items-center text-xs text-slate-500 font-medium mt-1.5\">\n            <MapPin className=\"w-3.5 h-3.5 text-brand-600 mr-1 shrink-0\" />\n            <span className=\"truncate\">{property.locality}, {property.city}</span>\n          </div>\n\n          {/* Key Specs Matrix */}\n          <div className=\"grid grid-cols-3 sm:grid-cols-4 gap-3 my-4 py-3 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs\">\n            <div>\n              <span className=\"text-slate-400 block text-[10px] uppercase font-bold\">Configuration</span>\n              <strong className=\"text-slate-800 font-bold\">{property.bhk}</strong>\n            </div>\n            <div>\n              <span className=\"text-slate-400 block text-[10px] uppercase font-bold\">Super Area</span>\n              <strong className=\"text-slate-800 font-bold\">{property.areaSqFt} sq.ft</strong>\n            </div>\n            <div>\n              <span className=\"text-slate-400 block text-[10px] uppercase font-bold\">Furnishing</span>\n              <strong className=\"text-slate-800 font-bold truncate block\">{property.furnishing}</strong>\n            </div>\n            <div className=\"hidden sm:block\">\n              <span className=\"text-slate-400 block text-[10px] uppercase font-bold\">Status</span>\n              <strong className=\"text-emerald-700 font-bold truncate block\">{property.possession}</strong>\n            </div>\n          </div>\n\n          {/* Short description preview */}\n          <p className=\"text-xs text-slate-600 line-clamp-2 leading-relaxed\">\n            {property.description}\n          </p>\n\n        </div>\n\n        {/* Footer Actions & Contact info */}\n        <div className=\"mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3\">\n          \n          {/* Posted By User badge */}\n          <div className=\"flex items-center space-x-2 text-xs\">\n            <div className=\"w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs\">\n              {property.contact?.name?.charAt(0) || 'A'}\n            </div>\n            <div>\n              <span className=\"text-slate-900 font-bold block leading-tight\">{property.contact?.name}</span>\n              <span className=\"text-[10px] text-brand-600 font-semibold\">{property.contact?.badge}</span>\n            </div>\n          </div>\n\n          {/* Buttons */}\n          <div className=\"flex items-center space-x-2\">\n            <button\n              onClick={(e) => {\n                e.stopPropagation();\n                onSelectProperty(property);\n              }}\n              className=\"px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition\"\n            >\n              View Details\n            </button>\n            <button\n              onClick={(e) => {\n                e.stopPropagation();\n                onContactClick(property);\n              }}\n              className=\"px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition\"\n            >\n              <Phone className=\"w-3.5 h-3.5\" />\n              <span>Contact {property.postedBy.includes('Owner') ? 'Owner' : 'Agent'}</span>\n            </button>\n          </div>\n\n        </div>\n      </div>\n    </div>\n  );\n}\n