'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetData, setResetData] = useState<{ uidb64?: string; token?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) {
      setErrorMsg('Please enter your registered email address or phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.requestPasswordReset(email.trim()) as any;
      if (res && res.message) {
        setSubmitted(true);
        if (res.uidb64 && res.token) {
          setResetData({ uidb64: res.uidb64, token: res.token });
        }
      } else {
        setErrorMsg('Could not find an account with that email. Please check your spelling.');
      }
    } catch (err: any) {
      if (err?.data?.email) {
        setErrorMsg(Array.isArray(err.data.email) ? err.data.email[0] : String(err.data.email));
      } else {
        setErrorMsg('Could not process password reset. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700 transition';

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
            Reset your password
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Enter your registered email address or phone number to receive reset instructions.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-card p-5 sm:p-6">
          {submitted ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-stone-900">Reset Instructions Sent</h2>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  We've verified your account. Click the button below to choose a new password.
                </p>
              </div>

              {resetData?.uidb64 && resetData?.token && (
                <div className="pt-2">
                  <Link
                    href={`/reset-password?uid=${resetData.uidb64}&token=${resetData.token}`}
                    className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Proceed to Set New Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Registered Email Address or Phone
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="farmer@example.com or 98XXXXXXXX"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <span>{isLoading ? 'Processing...' : 'Send Reset Link'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-2xs text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
          <span>Secure Tokenized Password Recovery</span>
        </div>
      </div>
    </div>
  );
}
