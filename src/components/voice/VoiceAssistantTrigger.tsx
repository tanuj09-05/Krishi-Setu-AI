'use client';

import React, { useState } from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VoiceAssistantModal } from './VoiceAssistantModal';

export const VoiceAssistantTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useApp();

  const label = language.toLowerCase().includes('marathi')
    ? 'बोलून विचारा'
    : language.toLowerCase().includes('hindi')
    ? 'बोलकर पूछें'
    : 'Ask Voice AI';

  return (
    <>
      {/* Floating Action Button (Bottom-Right) */}
      <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-brand-600 via-emerald-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white rounded-full shadow-2xl hover:shadow-brand-600/50 hover:scale-105 transition-all duration-200 border-2 border-emerald-300/40 group"
          aria-label="Open Voice Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/30 group-hover:rotate-12 transition-transform">
            <Mic className="w-4 h-4 fill-slate-950" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-tight">{label}</span>
            <span className="text-[9px] text-emerald-100 font-medium">Django Market AI</span>
          </div>
        </button>
      </div>

      {/* Voice Assistant Dialog Modal */}
      <VoiceAssistantModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
