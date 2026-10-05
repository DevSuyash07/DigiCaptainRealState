import React from 'react';
import { TrendingUp, ArrowRight, MapPin, Building } from 'lucide-react';
import { FEATURED_LOCALITIES } from '../data/mockProperties';

export default function LocalityCards({ onSelectLocality }) {
  return (
    <section id="trends" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Market Intelligence & Insights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Trending Localities & Price Trends
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Analyze real-time average sq.ft rates and capital appreciation across top micro-markets.
            </p>
          </div>
          <button className="mt-4 sm:mt-0 text-sm font-bold text-brand-600 hover:text-brand-800 flex items-center group">
            <span>View All City Insights</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Localities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURED_LOCALITIES.map((loc, idx) => (
            <div
              key={idx}
              onClick={() => onSelectLocality(loc.name)}
              className="group relative bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail image with overlay */}
                <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <span className="absolute bottom-2 left-2 text-white text-[11px] font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                    {loc.city}
                  </span>
                  <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                    {loc.growth}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-brand-600 transition">
                  {loc.name}
                </h3>
                <div className="mt-2 text-xs font-semibold text-slate-900">
                  {loc.avgPrice}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>{loc.propertiesCount}</span>
                <span className="font-bold text-brand-600 group-hover:translate-x-0.5 transition-transform flex items-center">
                  Explore <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
