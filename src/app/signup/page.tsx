'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Sprout,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('2.5');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }

    if (!email && !phone) {
      setErrorMsg('Please enter either an email address or phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup({
        name,
        email: email || undefined,
        phone_number: phone || undefined,
        location: location || 'Nashik, Maharashtra',
        farm_size_acres: parseFloat(farmSize) || 2.0,
        password,
        confirm_password: confirmPassword,
        role: 'FARMER',
      });

      if (res && res.user) {
        showToast('Welcome to KrishiSetu!', `Account created for ${name}.`);
        router.push('/');
      } else {
        setErrorMsg('Registration failed. Please check your details and try again.');
      }
    } catch (err: any) {
      const data = err?.data !== undefined ? err.data : err;
      if (typeof data === 'string') {
        setErrorMsg(data);
      } else if (data?.email) {
        setErrorMsg(Array.isArray(data.email) ? data.email[0] : String(data.email));
      } else if (data?.phone_number) {
        setErrorMsg(Array.isArray(data.phone_number) ? data.phone_number[0] : String(data.phone_number));
      } else if (data?.password) {
        setErrorMsg(Array.isArray(data.password) ? data.password[0] : String(data.password));
      } else if (data?.confirm_password) {
        setErrorMsg(Array.isArray(data.confirm_password) ? data.confirm_password[0] : String(data.confirm_password));
      } else if (data?.non_field_errors) {
        setErrorMsg(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : String(data.non_field_errors));
      } else if (data?.detail) {
        setErrorMsg(String(data.detail));
      } else if (typeof data === 'object' && data !== null) {
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
          const val = data[firstKey];
          const msg = Array.isArray(val) ? val[0] : String(val);
          setErrorMsg(`${firstKey.replace(/_/g, ' ')}: ${msg}`);
        } else {
          setErrorMsg('Registration error. Please check your information.');
        }
      } else {
        setErrorMsg(err?.message || 'Could not connect to server. Please try again.');
      }
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
            Create your KrishiSetu account
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Direct buyer linkages and real-time market realization for Indian agriculture.
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-card p-5 sm:p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil / Tanuj Bisht"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email & Phone in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="farmer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Location & Farm Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Village / Location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Dindori, Nashik"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Farm Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  placeholder="2.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-700 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 pt-2"
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-4 pt-3 border-t border-stone-100 text-center text-xs text-stone-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
              Log in
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
