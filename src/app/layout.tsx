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
  title: 'KrishiSetu AI — Smart Market Linkages & Net Realization',
  description: 'AI-powered market intelligence and transaction enablement platform maximizing net profit for Indian farmers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f8f5] flex flex-col text-gray-900 antialiased">
        <AuthProvider>
          <AppProvider>
            <Navbar />
            <div className="flex-1 flex w-full">
              <Sidebar />
              <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10 overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                  {children}
                </div>
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
