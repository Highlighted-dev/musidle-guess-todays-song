'use client';
import { Metadata } from 'next/types';
import '../styles/global.css';
import React from 'react';
import AuthProvider from '@/components/contexts/AuthContext';
import LoginAndRegister from '@/components/LoginAndRegister';
import { Toaster } from '@/components/ui/toaster';
import GameProvider from '@/components/contexts/GameContext';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: "Musidle - Guess Today's Top Hits",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="dark h-full w-full">
        <AuthProvider>
          <GameProvider>
            <Toaster />
            <div className="w-full h-full">
              <div className="w-full h-[60px] p-4 fixed left-0 top-0 z-10">
                <Navbar />
                <div className="fixed right-0 top-0 p-4 z-20">
                  <LoginAndRegister />
                </div>
              </div>
              <div className="fixed left-0 bottom-0 flex justify-center w-full py-4">
                <Label>Made with ❤️ by Highlighted-dev</Label>
              </div>
              <div className="flex justify-center items-center w-full h-full text-white m-0 p-0">
                {children}
              </div>
            </div>
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
