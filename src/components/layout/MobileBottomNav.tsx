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
    { name: 'Home',    href: '/',               icon: LayoutDashboard },
    { name: 'Markets', href: '/markets',         icon: Store },
    { name: 'AI',      href: '/recommendations', icon: Sparkles,   highlight: true },
    { name: 'Buyers',  href: '/buyers',          icon: Users },
    { name: 'Lots',    href: '/lots',            icon: Boxes,      badge: activeLots > 0 ? activeLots : null },
    { name: 'Profile', href: '/profile',         icon: UserCheck2 },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-stone-200 shadow-[0_-1px_12px_rgba(0,0,0,0.06)]"
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
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-150 relative min-w-0 flex-1 ${
                isActive
                  ? 'text-brand-700'
                  : item.highlight
                  ? 'text-amber-600'
                  : 'text-stone-500 hover:text-gray-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.name}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-600 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
