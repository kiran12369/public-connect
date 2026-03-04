import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageGate from '@/components/LanguageGate';
import Navbar from '@/components/Navbar';
import BackButton from '@/components/BackButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Public Connect (Praja Palana)',
  description: 'Apply for government services easily.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <BackButton />
              <LanguageGate>
                {children}
              </LanguageGate>
            </main>
            <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Public Connect. Government of Telangana.</p>
            </footer>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
