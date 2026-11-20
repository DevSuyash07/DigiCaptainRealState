import React from 'react';
import { Building2, ShieldCheck, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#00203d] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="md:col-span-1 space-y-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-baseline tracking-tight leading-none">
                <span className="text-2xl font-black text-white tracking-tight">NCR</span>
                <span className="text-2xl font-black text-sky-400 flex items-baseline tracking-tight">
                  <span>BR</span>
                  <span className="inline-flex items-center justify-center px-[1px] self-center">
                    <svg className="w-3 h-5 text-sky-400" viewBox="0 0 14 28" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6 1h2v4H6z M4 5h6v3H4z M2 8h10v20H2z M4 11h2v2.5H4z M8 11h2v2.5H8z M4 15h2v2.5H4z M8 15h2v2.5H8z M4 19h2v2.5H4z M8 19h2v2.5H8z M4 23h2v2.5H4z M8 23h2v2.5H8z" />
                    </svg>
                  </span>
                  <span>X</span>
                </span>
              </div>
              <span className="text-[9px] text-slate-300 font-bold tracking-[0.2em] uppercase">
                BUILDER | DEVELOPER | PARTNER
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's leading real estate platform connecting millions of home buyers, tenants, agents, and top developers across 100+ cities.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>📍 NCRBRIX Technologies</p>
              <p>📞 1800-41-99099 (Toll Free)</p>
              <p>✉️ support@ncrbrix.com</p>
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
          <p>© 2026 NCRBRIX. All rights reserved. Real Estate Portal.</p>
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
