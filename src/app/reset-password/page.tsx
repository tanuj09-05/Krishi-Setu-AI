'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sprout,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { authService } from '../../services/authService';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }

    if (!uid || !token) {
      setErrorMsg('Invalid or missing password reset token. Please request a new link.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.confirmPasswordReset({
        uidb64: uid,
        token: token,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      }) as any;

      if (res && res.message) {
        setIsSuccess(true);
      } else {
        setErrorMsg('Password reset failed. The link may have expired.');
      }
    } catch (err: any) {
      if (err?.data?.token) {
        setErrorMsg(Array.isArray(err.data.token) ? err.data.token[0] : String(err.data.token));
      } else if (err?.data?.new_password) {
        setErrorMsg(Array.isArray(err.data.new_password) ? err.data.new_password[0] : String(err.data.new_password));
      } else {
        setErrorMsg('Could not reset password. Please request a new reset link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Create new password
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Choose a strong password to secure your KrishiSetu account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-card p-5 sm:p-6">
          {isSuccess ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-stone-900">Password Reset Complete</h2>
                <p className="text-xs text-stone-600 mt-1">
                  Your password has been successfully updated. You can now log in with your new credentials.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Proceed to Log In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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

              {/* New Password */}
              <div>
                <label className={labelClass}>New Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                <label className={labelClass}>Confirm New Password</label>
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
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-md shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <span>{isLoading ? 'Resetting Password...' : 'Reset Password'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Return to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-2xs text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
          <span>Encrypted Password Storage</span>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-12 text-center text-xs text-stone-400">Loading reset form...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
