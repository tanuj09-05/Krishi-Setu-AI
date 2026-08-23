'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Sprout,
  ArrowUpRight,
  TrendingUp,
  UserCheck2,
  ShieldCheck,
  MapPin,
  LogIn,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { farmer, lots } = useApp();
  const { currentUser, currentRole, isAuthenticated, isBuyer, isFPO, isAdmin } = useAuth();

  const activeCropsCount = lots.filter(
    (l) => l.status === 'active_listed' || l.status === 'offer_received'
  ).length;

  let navItems: { name: string; href: string; icon: React.ElementType; badge?: string | null; isSell?: boolean }[] = [
    { name: 'Home',     href: '/',       icon: Home },
    { name: 'My Crops', href: '/crops',   icon: Sprout,        badge: activeCropsCount > 0 ? String(activeCropsCount) : null },
    { name: 'Sell',     href: '/sell',    icon: ArrowUpRight,  isSell: true },
    { name: 'Market',   href: '/market',  icon: TrendingUp },
    { name: 'Profile',  href: '/profile', icon: UserCheck2 },
  ];

  if (isBuyer) {
    navItems = [
      { name: 'Home',        href: '/',       icon: Home },
      { name: 'Farmer Crops',href: '/crops',   icon: Sprout,        badge: 'Live' },
      { name: 'Procure',     href: '/sell',    icon: ArrowUpRight },
      { name: 'Market',      href: '/market',  icon: TrendingUp },
      { name: 'Profile',     href: '/profile', icon: UserCheck2 },
    ];
  } else if (isFPO) {
    navItems = [
      { name: 'Home',          href: '/',       icon: Home },
      { name: 'Member Crops',  href: '/crops',   icon: Sprout },
      { name: 'Bulk Sell',     href: '/sell',    icon: ArrowUpRight },
      { name: 'Market',        href: '/market',  icon: TrendingUp },
      { name: 'FPO Profile',   href: '/profile', icon: UserCheck2 },
    ];
  } else if (isAdmin) {
    navItems = [
      { name: 'Admin Home',    href: '/',       icon: Home },
      { name: 'All Crops',     href: '/crops',   icon: Sprout },
      { name: 'Transactions',  href: '/sell',    icon: ArrowUpRight },
      { name: 'Market Feed',   href: '/market',  icon: TrendingUp },
      { name: 'System Admin',  href: '/profile', icon: UserCheck2 },
    ];
  }

  const displayName = currentUser?.name || farmer.name || 'My Account';
  const displayLocation = currentUser?.location || (farmer.village ? `${farmer.village}, ${farmer.district}` : 'Maharashtra');

  return (
    <aside className="hidden lg:flex flex-col w-52 shrink-0 bg-[#fafaf9] border-r border-stone-200/80 min-h-[calc(100vh-3.5rem)]">
      {/* Farmer identity snippet */}
      <div className="p-3 mx-2 my-2.5 rounded-lg bg-white border border-stone-200/70 shadow-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center font-bold text-xs shrink-0 select-none">
            {displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-stone-900 truncate leading-tight">{displayName}</p>
            <div className="flex items-center gap-1 text-2xs text-stone-500 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-stone-400 shrink-0" />
              <span className="truncate">{displayLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Item Navigation */}
      <nav className="flex-1 px-2 py-1 space-y-0.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/crops' && pathname.startsWith('/lots')) || (item.href === '/market' && pathname.startsWith('/markets'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 group ${
                isActive
                  ? 'bg-stone-200/70 text-stone-900 font-semibold'
                  : item.isSell
                  ? 'text-brand-800 hover:bg-brand-50 hover:text-brand-900 font-semibold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-brand-700'
                      : item.isSell
                      ? 'text-brand-700'
                      : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span className={`text-2xs font-semibold px-1.5 py-0.2 rounded shrink-0 ml-1 ${
                  isActive
                    ? 'bg-brand-100 text-brand-800'
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
          <ShieldCheck className="w-3.5 h-3.5 text-brand-700 shrink-0" />
          <div className="min-w-0">
            <span className="font-semibold text-stone-700 block truncate">Protected Payouts</span>
            <span className="text-stone-400 block truncate">Direct Bank Credit</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
