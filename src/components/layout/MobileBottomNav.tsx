'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, Sparkles, Boxes, Users, UserCheck2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { lots } = useApp();

  const activeLots = lots.filter(
    (l) => l.status === 'active_listed' || l.status === 'offer_received'
  ).length;

  const items = [
    { name: 'Dashboard', href: '/',               icon: LayoutDashboard },
    { name: 'Markets',   href: '/markets',         icon: Store },
    { name: 'AI Forecast', href: '/recommendations', icon: Sparkles },
    { name: 'Buyers',    href: '/buyers',          icon: Users },
    { name: 'My Lots',   href: '/lots',            icon: Boxes, badge: activeLots > 0 ? activeLots : null },
    { name: 'Profile',   href: '/profile',         icon: UserCheck2 },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-1 py-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-md transition-colors relative min-w-0 flex-1 ${
                isActive
                  ? 'text-brand-700 font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-700 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 truncate">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
