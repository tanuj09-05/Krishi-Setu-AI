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
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Markets', href: '/markets', icon: Store },
    { name: 'AI Advice', href: '/recommendations', icon: Sparkles, highlight: true },
    { name: 'Buyers', href: '/buyers', icon: Users },
    { name: 'My Lots', href: '/lots', icon: Boxes, badge: activeLots > 0 ? activeLots : null },
    { name: 'Profile', href: '/profile', icon: UserCheck2 },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition relative ${
                isActive
                  ? 'text-brand-600 font-bold'
                  : item.highlight
                  ? 'text-amber-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-brand-600' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
