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
  Phone,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { UserRole } from '../../types';

export default function OnboardingPage() {
  const router = useRouter();
  const { role, setRole, language, setLanguage, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [mobile, setMobile] = useState<string>('9823456789');
  const [otp, setOtp] = useState<string>('4421');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(true);
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

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-200">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-600/30 mb-3">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome to Krishi<span className="text-brand-600">Setu</span> AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Market Linkages, Fair Price Discovery, and Net Profit Optimization for Indian Agriculture.
          </p>
        </div>

        {/* Multi-step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-brand-600'
                  : s < step
                  ? 'w-6 bg-brand-300'
                  : 'w-6 bg-slate-200'
              }`}
            ></div>
          ))}
        </div>

        {/* Step 1: Language & Role Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-brand-600" />
                Select Preferred Language / भाषा निवडा
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'English', label: 'English', sub: 'Standard' },
                  { id: 'मराठी', label: 'मराठी', sub: 'Marathi' },
                  { id: 'हिंदी', label: 'हिंदी', sub: 'Hindi' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLanguage(l.id)}
                    className={`p-3.5 rounded-2xl border text-center transition ${
                      language.includes(l.id)
                        ? 'border-brand-600 bg-brand-50/70 text-brand-900 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-sm sm:text-base font-bold">{l.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{l.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Choose Your Role on Platform
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/70 text-brand-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white border border-slate-200/80 w-fit text-brand-700 mb-2">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{r.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{r.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Mobile & OTP Verification */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Enter 4-Digit OTP
                </label>
                <span className="text-[11px] text-emerald-600 font-semibold">OTP sent to +91 {mobile}</span>
              </div>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-widest text-2xl font-black py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block text-center">
                Demo OTP: 4421 (Pre-filled for fast testing)
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Verify & Enter Farm Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Farm & Location Profile */}
        {step === 3 && (
          <form onSubmit={handleComplete} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Village
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Crop
                </label>
                <select
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Onion">Onion (कांदा)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Grapes">Table Grapes (द्राक्षे)</option>
                  <option value="Wheat">Wheat (गहू)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Registration & Go to Dashboard</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
