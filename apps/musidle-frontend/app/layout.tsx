import '../styles/global.css';
import React from 'react';
import { Toaster } from '../components/ui/toaster';
import NextAuthProvider from '../components/auth/NextAuthProvider';
import { TriggerCookieSheet } from '../components/CookiesSheet';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { auth } from '@/auth';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Musidle',
  description:
    'Welcome to Musidle, your one-stop destination for all things music. Here you can play music daily games and quizzes with friends, read articles, explore artist wikis and more.',
  keywords:
    'music, games, quizzes, articles, artist wikis, wordle, music quizzes, music games, music articles, music wiki',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" className="w-full h-full xl:min-h-0 min-h-screen">
      <head />
      <body
        className={cn(
          'dark h-full w-full flex min-h-screen flex-col bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <NextAuthProvider session={session}>
          <Toaster />
          <TriggerCookieSheet />
          <div className="flex flex-col w-full h-full xl:min-h-0 min-h-screen">
            <header>
              <Navbar session={session} />
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
