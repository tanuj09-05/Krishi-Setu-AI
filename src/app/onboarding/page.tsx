'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import {
  Sprout,
  ShieldCheck,
  UserCheck,
  Building2,
  Briefcase,
  Globe,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Mic,
} from 'lucide-react';
import { UserRole } from '../../types';

export default function OnboardingPage() {
  const router = useRouter();
  const { role, setRole, language, setLanguage, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [mobile, setMobile] = useState<string>('9823456789');
  const [otp, setOtp] = useState<string>('4421');
  const [name, setName] = useState<string>('Rameshwar Patil');
  const [village, setVillage] = useState<string>('Dindori');
  const [district, setDistrict] = useState<string>('Nashik');
  const [state, setState] = useState<string>('Maharashtra');
  const [primaryCrop, setPrimaryCrop] = useState<string>('Tomato');

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Onboarding Complete!', `Welcome to KrishiSetu AI as ${role.toUpperCase()}`);
    router.push('/');
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-gray-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition';

  const labelClass = 'block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5';

  const steps = [
    { n: 1, label: 'Role & Language' },
    { n: 2, label: 'Verification' },
    { n: 3, label: 'Farm Profile' },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-800 text-white mb-4 shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome to Krishi<span className="text-brand-700">Setu</span> AI
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Market linkages, fair price discovery, and net profit optimization for Indian agriculture.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    s.n < step
                      ? 'bg-brand-700 text-white'
                      : s.n === step
                      ? 'bg-brand-700 text-white ring-4 ring-brand-100'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {s.n < step ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                </div>
                <p className={`text-[10px] mt-1 font-medium ${s.n === step ? 'text-brand-700' : 'text-stone-400'}`}>
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mb-4 transition-colors ${s.n < step ? 'bg-brand-400' : 'bg-stone-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-6 sm:p-8">
          {/* Step 1: Role & Language */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className={`${labelClass} flex items-center gap-1.5`}>
                  <Globe className="w-3.5 h-3.5 text-brand-600" />
                  Language / भाषा
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'English', label: 'English', sub: 'Standard' },
                    { id: 'मराठी', label: 'मराठी', sub: 'Marathi' },
                    { id: 'हिंदी', label: 'हिंदी', sub: 'Hindi' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLanguage(l.id)}
                      className={`py-3 px-2 rounded-xl border text-center transition-all ${
                        language.includes(l.id)
                          ? 'border-brand-600 bg-brand-50 text-brand-900'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <p className="font-semibold text-sm">{l.label}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">{l.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Your Role on Platform</label>
                <div className="space-y-2">
                  {[
                    { id: 'farmer', title: 'Farmer', icon: UserCheck, desc: 'Sell produce & maximize net profit' },
                    { id: 'fpo', title: 'FPO / Aggregator', icon: Building2, desc: 'Aggregate lots & bulk market access' },
                    { id: 'buyer', title: 'Verified Buyer', icon: Briefcase, desc: 'Procure high quality crop lots' },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id as UserRole)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50 text-brand-900'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-500'} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{r.title}</p>
                          <p className="text-xs text-stone-500">{r.desc}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                Continue to Verification
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-semibold text-sm pointer-events-none">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass} style={{ marginBottom: 0 }}>4-Digit OTP</label>
                  <span className="text-[11px] text-brand-700 font-semibold">Sent to +91 {mobile}</span>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 bg-stone-50 border border-stone-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 mt-1.5"
                />
                <p className="text-[11px] text-stone-400 text-center mt-1.5">Demo OTP: 4421 (pre-filled)</p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 bg-stone-100 text-stone-700 font-semibold rounded-xl text-sm hover:bg-stone-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  Verify & Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Farm Profile */}
          {step === 3 && (
            <form onSubmit={handleComplete} className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Village</label>
                  <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>District</label>
                  <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className={inputClass} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>State</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Primary Crop</label>
                  <select value={primaryCrop} onChange={(e) => setPrimaryCrop(e.target.value)} className={inputClass}>
                    <option value="Tomato">Tomato (टमाटर)</option>
                    <option value="Onion">Onion (कांदा)</option>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Grapes">Table Grapes (द्राक्षे)</option>
                    <option value="Wheat">Wheat (गहू)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 bg-stone-100 text-stone-700 font-semibold rounded-xl text-sm hover:bg-stone-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete & Go to Dashboard
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer trust indicator */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>UIDAI KYC · RBI Safe Escrow · DBT Direct Payout</span>
        </div>
      </div>
    </div>
  );
}
