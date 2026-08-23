'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useAuth, UserRoleType } from '../../context/AuthContext';
import {
  Sprout,
  Globe,
  ArrowUpRight,
  UserCheck,
  Building2,
  Briefcase,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  Mic,
  Check,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';
import { VoiceAssistantModal } from '../voice/VoiceAssistantModal';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { language, setLanguage, farmer } = useApp();
  const { currentUser, currentRole, isAuthenticated, loginAsRole, logout } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const rolesList: { id: UserRoleType; label: string; icon: React.ElementType; subtitle: string }[] = [
    { id: 'FARMER',  label: 'Farmer',        icon: UserCheck,   subtitle: 'Direct Farmer Account' },
    { id: 'BUYER',   label: 'Buyer',          icon: Briefcase,   subtitle: 'Reliance / BigBasket Hub' },
    { id: 'FPO',     label: 'FPO Aggregator', icon: Building2,   subtitle: 'Farmer Producer Collective' },
    { id: 'ADMIN',   label: 'Administrator',  icon: ShieldAlert, subtitle: 'Full System Access' },
  ];

  const voiceBtnLabel = language.toLowerCase().includes('marathi')
    ? 'बोलून विचारा'
    : language.toLowerCase().includes('hindi')
    ? 'बोलकर पूछें'
    : 'Ask Advice';

  const languages = [
    { id: 'English', label: 'English' },
    { id: 'मराठी',   label: 'मराठी'   },
    { id: 'हिंदी',   label: 'हिंदी'   },
  ];

  const roleLabel = rolesList.find(r => r.id === currentRole)?.label ?? currentRole;
  const displayName = currentUser?.name || farmer.name || 'Account';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200/80">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13 sm:h-14 gap-3">

            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-7 h-7 rounded-md bg-brand-700 flex items-center justify-center text-white shadow-subtle group-hover:bg-brand-800 transition-colors">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-stone-900 tracking-tight">
                Krishi<span className="text-brand-700">Setu</span>
              </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Voice button */}
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 transition-colors"
                title="Ask KrishiSetu via Voice"
                aria-label="Open voice assistant"
              >
                <Mic className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">{voiceBtnLabel}</span>
              </button>

              {/* Primary "Sell Crop" Action */}
              <Link
                href="/sell"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-md shadow-subtle transition-colors active:scale-95"
              >
                <span>Sell Crop</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Language selector */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                  aria-label="Change language"
                  aria-expanded={isLangDropdownOpen}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{language.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-menu border border-stone-200 py-1 z-50 animate-slide-up">
                    {languages.map((lang) => {
                      const isSelected = language.startsWith(lang.id);
                      return (
                        <button
                          key={lang.id}
                          onClick={() => { setLanguage(lang.id); setIsLangDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between hover:bg-stone-50 ${
                            isSelected ? 'text-brand-700 font-semibold' : 'text-stone-700'
                          }`}
                        >
                          {lang.label}
                          {isSelected && <Check className="w-3 h-3 text-brand-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Demo Role Switcher */}
              <div className="relative" ref={roleRef}>
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md border border-stone-200/60 transition-colors"
                  aria-expanded={isRoleDropdownOpen}
                  aria-label="Switch demo role"
                >
                  <span className="hidden md:inline text-stone-400">Role:</span>
                  <span className="font-semibold text-stone-900">{roleLabel}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-menu border border-stone-200 py-1 z-50 animate-slide-up">
                    <div className="px-3 py-1.5 border-b border-stone-100 mb-0.5">
                      <p className="text-2xs font-semibold text-stone-400 uppercase tracking-wider">Demo User Switcher</p>
                    </div>
                    {rolesList.map((r) => {
                      const Icon = r.icon;
                      const isSelected = currentRole === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => { loginAsRole(r.id); setIsRoleDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 hover:bg-stone-50 transition-colors flex items-center gap-2.5 ${
                            isSelected ? 'bg-stone-50 text-stone-900' : 'text-stone-700'
                          }`}
                        >
                          <div className={`p-1 rounded shrink-0 ${isSelected ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-500'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold ${isSelected ? 'text-brand-800' : 'text-stone-800'}`}>
                              {r.label}
                            </p>
                            <p className="text-2xs text-stone-400 truncate">{r.subtitle}</p>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* User Account / Auth Actions */}
              {isAuthenticated ? (
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-md hover:bg-stone-100 border border-stone-200 transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center text-2xs font-bold shrink-0">
                      {displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-stone-800 max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="w-3 h-3 text-stone-400 hidden sm:inline" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-menu border border-stone-200 py-1 z-50 animate-slide-up text-xs">
                      <div className="px-3 py-2 border-b border-stone-100">
                        <p className="font-semibold text-stone-900 truncate">{displayName}</p>
                        <p className="text-2xs text-stone-400 truncate">{currentUser?.email || currentUser?.phone_number}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-stone-700 hover:bg-stone-50"
                      >
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-700 hover:bg-rose-50 border-t border-stone-100"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </header>

      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </>
  );
};
