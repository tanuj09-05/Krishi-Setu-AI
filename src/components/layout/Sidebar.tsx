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
      { name: 'Escrow Settlements',  href: '/transactions',   icon: Receipt },
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
    ? 'Nashik Procurement Hub'
    : isFPO
    ? 'Member Collective · 320 Farmers'
    : `${farmer.village}, ${farmer.district}`;

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-[#fafaf9] border-r border-stone-200/80 min-h-[calc(100vh-3.5rem)]">
      {/* User identity snippet */}
      <div className="p-3.5 mx-2 my-2 rounded-lg bg-white border border-stone-200/70 shadow-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center font-bold text-xs shrink-0 select-none">
            {displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-stone-900 truncate leading-snug">{displayName}</p>
            <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-stone-400 shrink-0" />
              <span className="truncate">{subtitle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 group ${
                isActive
                  ? 'bg-stone-200/70 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-brand-700' : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded shrink-0 ml-1 ${
                  isActive
                    ? 'bg-brand-100 text-brand-800 font-semibold'
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Trust badge */}
      <div className="px-3 py-3 border-t border-stone-200/80">
        <div className="flex items-center gap-2 text-2xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <div className="min-w-0">
            <span className="font-semibold text-stone-700 block truncate">Escrow Protected</span>
            <span className="text-stone-400 block truncate">DBT Direct Settlement</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
