'use client';

import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import Sidebar from './_components/Sidebar';
import "../globals.css";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Toaster position="top-right" />
        {!isMounted ? (
          <div className="flex min-h-screen bg-gray-50">
            {/* Loading Skeleton */}
            <div className="hidden lg:block w-64 "></div>
            <main className="flex-1 p-4 lg:p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="mt-6 h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </main>
          </div>
        ) : (
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 w-full lg:w-auto min-w-0">
              {/* Top spacing for mobile menu button */}
              <div className="lg:hidden h-16"></div>
              <div className="p-4 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        )}
      </body>
    </html>
  );
}