'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useAuth, UserRoleType } from '../../context/AuthContext';
import {
  Sprout,
  Globe,
  PlusCircle,
  TrendingUp,
  UserCheck,
  Building2,
  Briefcase,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  Mic,
} from 'lucide-react';
import { VoiceAssistantModal } from '../voice/VoiceAssistantModal';

export const Navbar: React.FC = () => {
  const { language, setLanguage, farmer } = useApp();
  const { currentRole, currentUser, loginAsRole } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const pathname = usePathname();

  const rolesList: { id: UserRoleType; label: string; icon: any; subtitle: string; badge: string }[] = [
    { id: 'FARMER', label: 'Farmer Account', icon: UserCheck, subtitle: 'Rameshwar Patil (Dindori)', badge: 'Producer' },
    { id: 'BUYER', label: 'Buyer Account', icon: Briefcase, subtitle: 'Reliance Retail Hub (Ozar)', badge: 'Buyer A' },
    { id: 'FPO', label: 'FPO Aggregator', icon: Building2, subtitle: 'Sahyadri Farmers Co.', badge: 'Aggregator' },
    { id: 'ADMIN', label: 'Administrator', icon: ShieldAlert, subtitle: 'System Admin (Full Access)', badge: 'Admin' },
  ];

  const voiceBtnLabel = language.toLowerCase().includes('marathi')
    ? 'बोलून विचारा'
    : language.toLowerCase().includes('hindi')
    ? 'बोलकर पूछें'
    : 'Ask KrishiSetu';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                  <Sprout className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                      Krishi<span className="text-brand-600">Setu</span>
                    </span>
                    <span className="bg-brand-100 text-brand-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-brand-200">
                      AI
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block">
                    Smart Market Linkage & Net Realization Platform
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Quick Indicator */}
            <div className="hidden md:flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/70 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-900 shadow-inner">
              <TrendingUp className="w-4 h-4 text-brand-600 animate-pulse" />
              <span>Optimal Sale Window: <strong className="text-brand-700">Nashik Hub (₹22.50/kg Net)</strong></span>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Voice AI Button */}
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-sm transition active:scale-95 border border-amber-400"
                title="Ask KrishiSetu via Voice (Hindi, Marathi, English)"
              >
                <Mic className="w-3.5 h-3.5 fill-slate-950 animate-pulse" />
                <span className="hidden sm:inline">{voiceBtnLabel}</span>
              </button>

              {/* Create Lot Button for Farmers */}
              {currentRole === 'FARMER' && (
                <Link
                  href="/lots/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Lot</span>
                </Link>
              )}

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  title="Change Language"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{language}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                    {['English', 'मराठी (Marathi)', 'हिंदी (Hindi)'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang.split(' ')[0]);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-emerald-50 transition flex items-center justify-between ${
                          language.includes(lang.split(' ')[0]) ? 'text-brand-700 font-bold bg-emerald-50/60' : 'text-slate-700'
                        }`}
                      >
                        {lang}
                        {language.includes(lang.split(' ')[0]) && <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 1-Click Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-900 rounded-xl hover:bg-brand-100 transition text-xs font-bold"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></div>
                  <span>Role: {currentRole}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-700" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        Demo Role Switcher (1-Click)
                      </span>
                      <span className="text-xs text-slate-500">
                        Logged in as: <strong className="text-slate-900">{currentUser?.name}</strong>
                      </span>
                    </div>

                    <div className="p-1 space-y-1">
                      {rolesList.map((r) => {
                        const Icon = r.icon;
                        const isSelected = currentRole === r.id;
                        return (
                          <button
                            key={r.id}
                            onClick={() => {
                              loginAsRole(r.id);
                              setIsRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition flex items-center justify-between ${
                              isSelected ? 'bg-emerald-50 text-brand-900 font-bold border border-emerald-200' : 'text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <div className="text-xs">{r.label}</div>
                                <div className="text-[10px] text-slate-500 truncate">{r.subtitle}</div>
                              </div>
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0 ml-1">
                              {r.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Farmer Trust Pill */}
              {currentRole === 'FARMER' && (
                <Link
                  href="/profile"
                  className="hidden lg:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Trust: {farmer.trustScore}%</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </>
  );
};
