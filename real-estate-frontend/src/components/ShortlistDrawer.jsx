import React from 'react';
import { X, Heart, Trash2, ArrowRight, MapPin } from 'lucide-react';
import { formatIndianPrice } from '../data/mockProperties';

export default function ShortlistDrawer({ 
  isOpen, 
  onClose, 
  shortlistedProperties, 
  onRemoveShortlist, 
  onSelectProperty 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-base text-slate-900">
              Shortlisted Properties ({shortlistedProperties.length})
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List of shortlisted items */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {shortlistedProperties.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Heart className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2" />
              <p className="text-sm font-semibold">No properties saved yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click the heart icon on any property card to save it for quick comparison.
              </p>
            </div>
          ) : (
            shortlistedProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => {
                  onSelectProperty(prop);
                  onClose();
                }}
                className="flex items-center space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer group"
              >
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-slate-900">
                    {formatIndianPrice(prop.price, prop.purpose)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-brand-600">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-0.5 text-brand-600" />
                    {prop.locality}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveShortlist(prop.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer CTA */}
        {shortlistedProperties.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow"
            >
              <span>Continue Browsing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
