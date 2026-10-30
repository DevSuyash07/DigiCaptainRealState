import React, { useState } from 'react';
import MobileOtpVerification from './MobileOtpVerification';
import { X, Lock, Mail, User, Phone, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { setStoredUser } from '../auth/authStore';

const API_BASE = (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('BUYER'); // 'BUYER', 'AGENT', 'OWNER'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register' && !isPhoneVerified) {
      setError('Please verify your mobile number with OTP before registering.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const endpoint = `${API_BASE}${mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/signup'}`;
      const body = mode === 'login' 
        ? { email, password }
        : { name, email, password, role, phone };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      const signedInUser = data && data.user ? data.user : {};
      setStoredUser({
        name: signedInUser.name || name || email,
        email: signedInUser.email || email,
        role: signedInUser.role || role
      });

      setMessage(mode === 'login' ? 'Login Successful! Welcome back.' : 'Account created successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err && err.message ? err.message : 'Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Top Header */}
        <div className="bg-brand-900 text-white p-6 pb-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure 99acres Portal</span>
          </div>
          <h3 className="text-2xl font-black">{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</h3>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login' ? 'Access saved properties, alerts & owner inquiries' : 'Join India’s largest real estate community'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => { setMode('login'); setError(''); setMessage(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition ${
              mode === 'login' ? 'bg-white text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); setMessage(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition ${
              mode === 'register' ? 'bg-white text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {message && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">I am a</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['BUYER', 'OWNER', 'AGENT'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-1.5 text-xs font-bold rounded-lg border capitalize ${
                          role === r ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {r.toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <MobileOtpVerification
                    phone={phone}
                    onChangePhone={(p) => {
                      setPhone(p);
                      setError('');
                    }}
                    isVerified={isPhoneVerified}
                    onVerifiedChange={(v) => {
                      setIsPhoneVerified(v);
                      if (v) setError('');
                    }}
                    label="Mobile Number"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-brand-600/30 flex items-center justify-center space-x-1.5 transition mt-4"
            >
              <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-bold text-brand-600 hover:underline"
            >
              {mode === 'login' ? 'Register Free' : 'Sign In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
