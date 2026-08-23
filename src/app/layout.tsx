import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { ToastContainer } from '../components/ui/ToastContainer';
import { VoiceAssistantTrigger } from '../components/voice/VoiceAssistantTrigger';

export const metadata: Metadata = {
  title: 'KrishiSetu AI - Smart Market Linkages & Net Realization Optimization',
  description: 'AI-powered market intelligence and transaction enablement platform maximizing net profit for Indian farmers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <AppProvider>
            <Navbar />
            <div className="flex-1 flex w-full">
              <Sidebar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 overflow-x-hidden">
                {children}
              </main>
            </div>
            <MobileBottomNav />
            <VoiceAssistantTrigger />
            <ToastContainer />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
