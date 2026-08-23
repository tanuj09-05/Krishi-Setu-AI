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
  ShieldCheck,
  MapPin,
  Building,
  Briefcase,
  ShieldAlert,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { farmer, lots } = useApp();
  const { currentRole, currentUser, isFarmer, isBuyer, isFPO, isAdmin } = useAuth();

  const activeLotsCount = lots.filter(
    (l) => l.status === 'active_listed' || l.status === 'offer_received'
  ).length;

  let navItems: { name: string; href: string; icon: React.ElementType; badge?: string | null }[] = [
    { name: 'Dashboard',           href: '/',               icon: LayoutDashboard },
    { name: 'Market Intelligence', href: '/markets',        icon: Store,           badge: 'Live' },
    { name: 'AI Recommendations',  href: '/recommendations', icon: Sparkles },
    { name: 'Verified Buyers',     href: '/buyers',         icon: Users },
    { name: 'My Lots',             href: '/lots',           icon: Boxes,           badge: activeLotsCount > 0 ? String(activeLotsCount) : null },
    { name: 'Logistics',           href: '/logistics',      icon: Truck },
    { name: 'Transactions',        href: '/transactions',   icon: Receipt },
    { name: 'Profile & Trust',     href: '/profile',        icon: UserCheck2 },
  ];

  if (isBuyer) {
    navItems = [
      { name: 'Procurement',         href: '/buyers',         icon: Briefcase },
      { name: 'Farmer Lots',         href: '/lots',           icon: Boxes,       badge: 'Live' },
      { name: 'Market Intelligence', href: '/markets',        icon: Store },
      { name: 'AI Forecasts',        href: '/recommendations', icon: Sparkles },
      { name: 'Logistics',           href: '/logistics',      icon: Truck },
      { name: 'Escrow Transactions', href: '/transactions',   icon: Receipt },
    ];
  } else if (isFPO) {
    navItems = [
      { name: 'FPO Dashboard',       href: '/',               icon: Building },
      { name: 'Consolidated Lots',   href: '/lots',           icon: Boxes },
      { name: 'Institutional Buyers',href: '/buyers',         icon: Users },
      { name: 'Market Intelligence', href: '/markets',        icon: Store },
      { name: 'Logistics',           href: '/logistics',      icon: Truck },
      { name: 'Farmer Settlements',  href: '/transactions',   icon: Receipt },
    ];
  } else if (isAdmin) {
    navItems = [
      { name: 'Admin Console',       href: '/',               icon: ShieldAlert,  badge: 'Admin' },
      { name: 'All Market Prices',   href: '/markets',        icon: Store },
      { name: 'Buyer Verification',  href: '/buyers',         icon: Users },
      { name: 'All Digital Lots',    href: '/lots',           icon: Boxes },
      { name: 'Escrow & Disputes',   href: '/transactions',   icon: Receipt },
      { name: 'Logistics Fleet',     href: '/logistics',      icon: Truck },
    ];
  }

  const displayName = currentUser?.name || (isBuyer ? 'Reliance Retail Hub' : isFPO ? 'Sahyadri Agro FPO' : farmer.name);
  const subtitle = isBuyer
    ? 'Nashik Procurement Centre'
    : isFPO
    ? 'Member Collective · 320 Farmers'
    : `${farmer.village}, ${farmer.district}`;

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-[#0d1810] text-slate-200 min-h-[calc(100vh-3.5rem)] border-r border-white/5">
      {/* User identity card */}
      <div className="px-3 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-brand-800/50 border border-brand-700/40 flex items-center justify-center text-brand-300 font-bold text-sm shrink-0 select-none">
            {displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate leading-snug">{displayName}</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-brand-500 shrink-0" />
              <span className="truncate">{subtitle}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-slate-500">Role</span>
          <span className="text-[10px] font-semibold text-brand-400 bg-brand-950/60 border border-brand-800/50 px-2 py-0.5 rounded-full">
            {currentRole}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isAIRec = item.href === '/recommendations';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item-active relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-white/10 text-white'
                  : isAIRec
                  ? 'text-amber-300/80 hover:bg-white/5 hover:text-amber-200'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    isActive ? 'text-brand-400' : isAIRec ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${
                  isActive
                    ? 'bg-brand-700 text-brand-200'
                    : isAIRec
                    ? 'bg-amber-800/40 text-amber-300'
                    : 'bg-white/10 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer — Trust indicator */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <div>
            <p className="text-slate-400 font-medium">Safe Escrow Protection</p>
            <p className="text-slate-600">100% DBT Guaranteed</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
