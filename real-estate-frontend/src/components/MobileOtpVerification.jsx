import React, { useState, useEffect } from 'react';
import { Phone, CheckCircle2, KeyRound, Edit3 } from 'lucide-react';

// Production me backend doosre host par hota hai, isliye base URL env se aata hai.
// Local dev me khali string rehti hai aur vite proxy /api ko 5000 par bhej deta hai.
const API_BASE = (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

const postJson = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
};

export default function MobileOtpVerification({
  phone = '',
  onChangePhone,
  isVerified = false,
  onVerifiedChange,
  label = 'Mobile Number',
  required = true,
  variant = 'light',
  purpose = 'GENERIC'
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

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

  const handleSendOtp = async () => {
    setErrorMsg('');
    setInfoMsg('');

    const digits = cleanPhone(phone);
    if (digits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setSending(true);
    try {
      const data = await postJson('/api/v1/auth/phone-otp/request', {
        phone: digits,
        purpose
      });
      setOtpSent(true);
      setOtpValue('');
      setCountdown(data?.data?.resendAfterSeconds || 30);
      setInfoMsg(`OTP sent by SMS to ${data?.data?.phone || `+91 ${digits.slice(-10)}`}`);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMsg('');

    if (!/^\d{6}$/.test(otpValue.trim())) {
      setErrorMsg('Please enter the 6-digit OTP sent to your phone');
      return;
    }

    setVerifying(true);
    try {
      const data = await postJson('/api/v1/auth/phone-otp/verify', {
        phone: cleanPhone(phone),
        otp: otpValue.trim()
      });
      onVerifiedChange?.(true, data?.data?.phoneToken || null);
      setOtpSent(false);
      setOtpValue('');
      setInfoMsg('');
      setCountdown(0);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleChangeNumber = () => {
    onVerifiedChange?.(false, null);
    setOtpSent(false);
    setOtpValue('');
    setInfoMsg('');
    setErrorMsg('');
    setCountdown(0);
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
            if (isVerified) onVerifiedChange?.(false, null);
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
              disabled={countdown > 0 || sending}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition ${
                countdown > 0 || sending
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isDark
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                  : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {sending
                ? 'Sending...'
                : otpSent
                ? countdown > 0
                  ? `Resend (${countdown}s)`
                  : 'Resend OTP'
                : 'Verify Mobile'}
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
              <span>Enter the 6-digit OTP sent to your phone</span>
            </span>
          </div>

          {infoMsg && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] font-semibold">
              {infoMsg}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter OTP"
              className="w-36 px-3 py-1.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-center font-mono font-bold tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verifying}
              className={`font-bold px-4 py-1.5 rounded-lg text-xs shadow-sm transition ${
                verifying
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {verifying ? 'Checking...' : 'Confirm OTP'}
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-start space-x-1">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </p>
      )}
    </div>
  );
}
