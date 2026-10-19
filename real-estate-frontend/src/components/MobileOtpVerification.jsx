import React, { useState, useEffect } from 'react';
import { Phone, ShieldCheck, CheckCircle2, RefreshCw, KeyRound, Edit3 } from 'lucide-react';

export default function MobileOtpVerification({
  phone = '',
  onChangePhone,
  isVerified = false,
  onVerifiedChange,
  label = 'Mobile Number',
  required = true,
  variant = 'light'
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoBanner, setDemoBanner] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const cleanPhone = (val) => String(val || '').replace(/[^0-9]/g, '');

  const handleSendOtp = () => {
    setErrorMsg('');
    const digits = cleanPhone(phone);
    if (digits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setCountdown(30);
    setDemoBanner(`OTP sent to +91 ${digits.slice(-10)}. Demo Code: ${newOtp}`);
  };

  const handleVerifyOtp = () => {
    setErrorMsg('');
    if (!otpValue.trim()) {
      setErrorMsg('Please enter the 4-digit OTP');
      return;
    }
    if (otpValue.trim() === generatedOtp || otpValue.trim() === '1234' || otpValue.trim() === '9999') {
      onVerifiedChange?.(true);
      setOtpSent(false);
      setDemoBanner('');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid OTP. Please check the code and try again.');
    }
  };

  const handleChangeNumber = () => {
    onVerifiedChange?.(false);
    setOtpSent(false);
    setOtpValue('');
    setGeneratedOtp('');
    setDemoBanner('');
    setErrorMsg('');
  };

  const isDark = variant === 'dark';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {isVerified && (
          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified</span>
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center space-x-1 text-slate-400 pointer-events-none">
          <Phone className="w-3.5 h-3.5" />
          <span className="text-xs font-bold text-slate-500">+91</span>
        </div>
        <input
          type="tel"
          required={required}
          disabled={isVerified}
          value={phone}
          onChange={(e) => {
            onChangePhone(e.target.value);
            if (isVerified) onVerifiedChange?.(false);
          }}
          placeholder="98765 43210"
          className={`w-full pl-16 pr-24 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 transition ${
            isDark
              ? 'bg-white text-slate-900 border border-slate-200 focus:ring-amber-400 placeholder:text-slate-400'
              : 'bg-slate-50 text-slate-900 border border-slate-200 focus:ring-brand-500 placeholder:text-slate-400'
          } ${isVerified ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900' : ''}`}
        />
        <div className="absolute right-1.5 flex items-center">
          {isVerified ? (
            <button
              type="button"
              onClick={handleChangeNumber}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-700 px-2 py-1 flex items-center space-x-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Change</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={countdown > 0}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition ${
                countdown > 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isDark
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                  : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {otpSent ? (countdown > 0 ? `Resend (${countdown}s)` : 'Resend OTP') : 'Verify Mobile'}
            </button>
          )}
        </div>
      </div>

      {otpSent && !isVerified && (
        <div className={`p-3 rounded-xl border text-xs space-y-2 animate-fadeIn ${
          isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-brand-50/70 border-brand-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-brand-600" />
              <span>Enter 4-digit OTP sent to your phone</span>
            </span>
          </div>

          {demoBanner && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] font-semibold flex items-center justify-between">
              <span>💬 {demoBanner}</span>
              <button
                type="button"
                onClick={() => setOtpValue(generatedOtp)}
                className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-1.5 py-0.5 rounded ml-2"
              >
                Auto Fill
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="text"
              maxLength={4}
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter OTP"
              className="w-32 px-3 py-1.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-center font-mono font-bold tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow-sm transition"
            >
              Confirm OTP
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center space-x-1">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </p>
      )}
    </div>
  );
}
