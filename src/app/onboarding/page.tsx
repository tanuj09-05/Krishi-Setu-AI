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
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { UserRole } from '../../types';

export default function OnboardingPage() {
  const router = useRouter();
  const { role, setRole, language, setLanguage, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [mobile, setMobile] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [state, setState] = useState<string>('Maharashtra');
  const [primaryCrop, setPrimaryCrop] = useState<string>('Tomato');

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Onboarding Complete', `Welcome to KrishiSetu AI as ${role.toUpperCase()}`);
    router.push('/');
  };

  const inputClass =
    'w-full px-3 py-2 bg-white border border-stone-200 rounded-md text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700 transition';

  const labelClass = 'block text-xs font-semibold text-stone-700 mb-1';

  const steps = [
    { n: 1, label: 'Role & Language' },
    { n: 2, label: 'Verification' },
    { n: 3, label: 'Farm Profile' },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-700 text-white mb-3 shadow-subtle">
            <Sprout className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            Welcome to Krishi<span className="text-brand-700">Setu</span> AI
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Market intelligence and direct buyer linkages for Indian agriculture.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    s.n < step
                      ? 'bg-brand-700 text-white'
                      : s.n === step
                      ? 'bg-brand-700 text-white ring-4 ring-brand-50'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {s.n < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.n}
                </div>
                <span className={`text-2xs mt-1 font-medium ${s.n === step ? 'text-brand-800 font-semibold' : 'text-stone-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mb-4 transition-colors ${s.n < step ? 'bg-brand-500' : 'bg-stone-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Card */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-card p-5 sm:p-6">
          {/* Step 1: Role & Language */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                  <Globe className="w-3.5 h-3.5 text-stone-500" />
                  Language / भाषा
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'English', label: 'English', sub: 'Default' },
                    { id: 'मराठी', label: 'मराठी', sub: 'Marathi' },
                    { id: 'हिंदी', label: 'हिंदी', sub: 'Hindi' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLanguage(l.id)}
                      className={`py-2 px-2 rounded-md border text-center transition-all ${
                        language.includes(l.id)
                          ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <p className="text-xs">{l.label}</p>
                      <p className="text-2xs text-stone-400">{l.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Your Role</label>
                <div className="space-y-2">
                  {[
                    { id: 'farmer', title: 'Farmer', icon: UserCheck, desc: 'Sell harvest & maximize take-home profit' },
                    { id: 'fpo', title: 'FPO / Aggregator', icon: Building2, desc: 'Aggregate lots for collective pricing' },
                    { id: 'buyer', title: 'Verified Corporate Buyer', icon: Briefcase, desc: 'Procure high grade crop lots' },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id as UserRole)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/70 text-brand-900'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${isSelected ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-500'} shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs text-stone-900">{r.title}</p>
                          <p className="text-2xs text-stone-500">{r.desc}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-md shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-95 text-xs"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-xs pointer-events-none">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass} style={{ marginBottom: 0 }}>4-Digit OTP</label>
                  <span className="text-2xs text-brand-700 font-medium">Demo: 4421</span>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-[0.4em] text-xl font-bold py-2 bg-stone-50 border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3.5 py-2 bg-stone-100 text-stone-700 font-medium rounded-md text-xs hover:bg-stone-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-md shadow-subtle transition-colors flex items-center justify-center gap-1.5 text-xs"
                >
                  <span>Verify & Proceed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Farm Profile */}
          {step === 3 && (
            <form onSubmit={handleComplete} className="space-y-3.5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={labelClass}>Village</label>
                  <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>District</label>
                  <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className={inputClass} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
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

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3.5 py-2 bg-stone-100 text-stone-700 font-medium rounded-md text-xs hover:bg-stone-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-md shadow-subtle transition-colors flex items-center justify-center gap-1.5 text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enter KrishiSetu AI</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-2xs text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
          <span>UIDAI KYC · RBI-Compliant Escrow · DBT Payouts</span>
        </div>
      </div>
    </div>
  );
}
