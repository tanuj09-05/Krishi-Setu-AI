'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRoleType } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Sprout,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Building2,
  ShieldAlert,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsRole } = useAuth();
  const { showToast } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier || !password) {
      setErrorMsg('Please enter your email/phone and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login({
        email: identifier.includes('@') ? identifier.trim() : undefined,
        phone_number: !identifier.includes('@') ? identifier.trim() : undefined,
        password,
      });

      if (res && res.user) {
        showToast('Login Successful', `Welcome back, ${res.user.name.split(' ')[0]}!`);
        router.push('/');
      } else {
        setErrorMsg('Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      const data = err?.data !== undefined ? err.data : err;
      if (typeof data === 'string') {
        setErrorMsg(data);
      } else if (data?.non_field_errors) {
        setErrorMsg(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : String(data.non_field_errors));
      } else if (data?.detail) {
        setErrorMsg(String(data.detail));
      } else if (data?.email) {
        setErrorMsg(Array.isArray(data.email) ? data.email[0] : String(data.email));
      } else if (data?.phone_number) {
        setErrorMsg(Array.isArray(data.phone_number) ? data.phone_number[0] : String(data.phone_number));
      } else if (data?.password) {
        setErrorMsg(Array.isArray(data.password) ? data.password[0] : String(data.password));
      } else {
        setErrorMsg(err?.message || 'Login failed. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRoleType) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await loginAsRole(role);
      showToast('Demo Login Active', `Signed in as ${role}`);
      router.push('/');
    } catch (e) {
      setErrorMsg('Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700 transition';

  const labelClass = 'block text-xs font-semibold text-stone-700 mb-1';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in space-y-6">

        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center text-white shadow-subtle">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-stone-900 tracking-tight">
              Krishi<span className="text-brand-700">Setu</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            Log in to your account
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Manage your crops, review buyer bids, and track protected payouts.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-card p-5 sm:p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Phone */}
            <div>
              <label className={labelClass}>Email or Phone Number</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="farmer@example.com or 98XXXXXXXX"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass} style={{ marginBottom: 0 }}>Password</label>
                <Link
                  href="/forgot-password"
                  className="text-2xs text-brand-700 hover:text-brand-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 pt-2"
            >
              <span>{isLoading ? 'Logging in...' : 'Log In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="mt-5 pt-4 border-t border-stone-100">
            <span className="text-2xs font-semibold text-stone-400 uppercase tracking-wider block mb-2 text-center">
              Or Instant Demo Sign-In
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              {[
                { role: 'FARMER' as UserRoleType, label: 'Farmer', icon: UserCheck },
                { role: 'BUYER' as UserRoleType, label: 'Buyer', icon: Briefcase },
                { role: 'FPO' as UserRoleType, label: 'FPO Co.', icon: Building2 },
                { role: 'ADMIN' as UserRoleType, label: 'Admin', icon: ShieldAlert },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleDemoLogin(item.role)}
                    className="p-2 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-700 font-medium flex flex-col items-center gap-1 text-2xs transition"
                  >
                    <Icon className="w-3.5 h-3.5 text-stone-500" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-4 pt-3 border-t border-stone-100 text-center text-xs text-stone-500">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-brand-700 hover:text-brand-800">
              Create account
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-2xs text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
          <span>Secure Django Authentication · 100% Protected Farmer Data</span>
        </div>
      </div>
    </div>
  );
}
