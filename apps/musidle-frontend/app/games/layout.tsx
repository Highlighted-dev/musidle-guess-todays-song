import React from 'react';
import LoginAndRegister from '@/components/LoginAndRegister';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Musidle',
};

export async function getNextSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center w-full h-full text-white m-0 p-0">
      {children}
    </div>
  );
}
