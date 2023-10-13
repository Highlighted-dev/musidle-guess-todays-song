'use client';

import '../styles/global.css';
import React from 'react';
import AuthProvider from '@/components/contexts/AuthContext';
import LoginAndRegister from '@/components/LoginAndRegister';
import { Toaster } from '@/components/ui/toaster';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="dark h-full w-full flex">
        <AuthProvider>
          <Toaster />
          <div className="flex flex-col w-full h-full">
            <div className="flex w-full h-[50px] p-5 z-10 relative justify-center items-center">
              <Navbar />
              <div className="absolute right-0 p-2 z-20">
                <LoginAndRegister />
              </div>
            </div>
            <div className="flex justify-center items-center w-full h-full text-white m-0 p-0 xl:min-h-[750px] min-h-[1000px]">
              {children}
            </div>
            <div className="h-[50px] flex justify-center w-full py-4">
              <Label>Made with ❤️ by Highlighted-dev</Label>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
