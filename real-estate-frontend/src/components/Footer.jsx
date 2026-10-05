import React from 'react';
import { Building2, ShieldCheck, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#00203d] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-lg">
                99
              </div>
              <span className="text-2xl font-black tracking-tight text-white">acres</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's leading real estate platform connecting millions of home buyers, tenants, agents, and top developers across 100+ cities.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>📍 Info Edge (India) Limited</p>
              <p>📞 1800-41-99099 (Toll Free)</p>
              <p>✉️ support@99acres.com</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Popular Cities</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition">Properties in Delhi NCR</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Flats in Mumbai</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Villas in Bangalore</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Apartments in Hyderabad</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Commercial in Pune</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Plots in Chennai</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Property Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition">Post Property Free</a></li>
              <li><a href="#emi-calc" className="hover:text-amber-400 transition">Home Loan EMI Calculator</a></li>
              <li><a href="#trends" className="hover:text-amber-400 transition">City Price Trends & Rates</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">RERA Registered Projects</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Rent Agreement Generator</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Real Estate Agent Directory</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal & Trust</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">RERA Disclaimer</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Fraud Prevention Guide</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Grievance Redressal</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 99acres.com. All rights reserved. Real Estate Portal.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% SSL Secure & Verified
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
