import '../styles/global.css';
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import NextAuthProvider from '@/components/NextAuthProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { TriggerCookieSheet } from '@/components/CookiesSheet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Musidle',
};

export async function getNextSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getNextSession();
  return (
    <html lang="en" className="w-full h-full xl:min-h-0 min-h-screen">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="dark h-full w-full flex min-h-screen flex-col">
        <NextAuthProvider session={session}>
          <Toaster />
          <TriggerCookieSheet />
          <div className="flex flex-col w-full h-full xl:min-h-0 min-h-screen">
            <header>
              <Navbar sectionClassname="fixed top-0 z-50 w-full bg-background p-1" />
            </header>
            <main className="flex-grow">
              <div className="flex justify-center items-center w-full h-full text-white m-0 p-0">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
