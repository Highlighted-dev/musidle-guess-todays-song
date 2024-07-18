import '../styles/global.css';
import React from 'react';
import { Toaster } from '../components/ui/toaster';
import NextAuthProvider from '../components/auth/NextAuthProvider';
import { TriggerCookieSheet } from '../components/CookiesSheet';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { auth } from '@/auth';

export const metadata = {
  title: 'Musidle',
  description:
    'Welcome to Musidle, your one-stop destination for all things music. Here you can play music daily games and quizzes with friends, read articles, explore artist wikis and more.',
  keywords:
    'music, games, quizzes, articles, artist wikis, wordle, music quizzes, music games, music articles, music wiki',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
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
