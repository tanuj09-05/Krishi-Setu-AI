'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Store,
  Sparkles,
  Users,
  Boxes,
  Truck,
  Receipt,
  UserCheck2,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Building,
  Briefcase,
  FileCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { farmer, lots } = useApp();
  const { currentRole, currentUser, isFarmer, isBuyer, isFPO, isAdmin } = useAuth();

  const activeLotsCount = lots.filter(
    (l) => l.status === 'active_listed' || l.status === 'offer_received'
  ).length;

  // Role-Aware Navigation Configuration
  let navItems = [
    {
      name: 'Farmer Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Market Intelligence',
      href: '/markets',
      icon: Store,
      badge: 'Live',
    },
    {
      name: 'AI Recommendations',
      href: '/recommendations',
      icon: Sparkles,
      badge: '91% Match',
      highlight: true,
    },
    {
      name: 'Verified Buyers',
      href: '/buyers',
      icon: Users,
      badge: '5 Active',
    },
    {
      name: 'My Digital Lots',
      href: '/lots',
      icon: Boxes,
      badge: activeLotsCount > 0 ? `${activeLotsCount}` : null,
    },
    {
      name: 'Logistics & Rates',
      href: '/logistics',
      icon: Truck,
      badge: null,
    },
    {
      name: 'Transactions & Escrow',
      href: '/transactions',
      icon: Receipt,
      badge: null,
    },
    {
      name: 'Profile & Trust Score',
      href: '/profile',
      icon: UserCheck2,
      badge: '94 Score',
    },
  ];

  if (isBuyer) {
    navItems = [
      {
        name: 'Buyer Procurement',
        href: '/buyers',
        icon: Briefcase,
        badge: 'Active Demand',
      },
      {
        name: 'Available Farmer Lots',
        href: '/lots',
        icon: Boxes,
        badge: 'Live Listings',
      },
      {
        name: 'Market Intelligence',
        href: '/markets',
        icon: Store,
        badge: 'Regional Mandis',
      },
      {
        name: 'AI Price Forecasts',
        href: '/recommendations',
        icon: Sparkles,
        badge: 'Predictor',
      },
      {
        name: 'Procurement Logistics',
        href: '/logistics',
        icon: Truck,
        badge: null,
      },
      {
        name: 'Escrow Transactions',
        href: '/transactions',
        icon: Receipt,
        badge: 'Safe Escrow',
      },
    ];
  } else if (isFPO) {
    navItems = [
      {
        name: 'FPO Aggregation Hub',
        href: '/',
        icon: Building,
        badge: 'FPO View',
      },
      {
        name: 'Consolidated Lots',
        href: '/lots',
        icon: Boxes,
        badge: 'Aggregated',
      },
      {
        name: 'Institutional Buyers',
        href: '/buyers',
        icon: Users,
        badge: 'Bulk Tenders',
      },
      {
        name: 'Market Intelligence',
        href: '/markets',
        icon: Store,
        badge: 'Price Discovery',
      },
      {
        name: 'Consolidated Logistics',
        href: '/logistics',
        icon: Truck,
        badge: null,
      },
      {
        name: 'Farmer Settlements',
        href: '/transactions',
        icon: Receipt,
        badge: 'DBT Payouts',
      },
    ];
  } else if (isAdmin) {
    navItems = [
      {
        name: 'System Admin Console',
        href: '/',
        icon: ShieldCheck,
        badge: 'Admin',
      },
      {
        name: 'All Market Prices',
        href: '/markets',
        icon: Store,
        badge: 'Master',
      },
      {
        name: 'Buyer Verification',
        href: '/buyers',
        icon: Users,
        badge: 'KYC',
      },
      {
        name: 'All Digital Lots',
        href: '/lots',
        icon: Boxes,
        badge: 'Audit',
      },
      {
        name: 'Escrow & Disputes',
        href: '/transactions',
        icon: Receipt,
        badge: 'Escrow Vault',
      },
      {
        name: 'Logistics Fleet Master',
        href: '/logistics',
        icon: Truck,
        badge: 'Fleet',
      },
    ];
  }

  const displayName = currentUser?.name || (isBuyer ? 'Reliance Retail Hub' : isFPO ? 'Sahyadri Agro FPO' : farmer.name);
  const subtitle = isBuyer ? 'Nashik Procurement Centre' : isFPO ? 'Member Collective (320 Farmers)' : `${farmer.village}, ${farmer.district}`;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-200 min-h-[calc(100vh-4rem)] p-4 border-r border-slate-800 shrink-0">
      {/* Active User / Role Card */}
      <div className="bg-slate-800/80 rounded-2xl p-3.5 mb-6 border border-slate-700/60 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold text-base">
            {displayName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{displayName}</h4>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
              <span className="truncate">{subtitle}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">Role Status</span>
          <span className="text-brand-300 font-bold text-[11px] bg-brand-950/60 px-2 py-0.5 rounded border border-brand-500/30">
            {currentRole}
          </span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${item.highlight && !isActive ? 'border border-amber-500/30 text-amber-200 bg-amber-500/10' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-1 ${
                    isActive
                      ? 'bg-brand-700 text-white'
                      : item.highlight
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Trust & Safe Escrow Footer Badge */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <div className="font-bold text-white text-[11px]">Safe Escrow Protection</div>
            <div className="text-[10px] text-emerald-300 truncate">100% DBT Bank Guaranteed</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
