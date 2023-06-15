import { Metadata } from 'next/types';
import '../styles/global.css';

export const metadata: Metadata = {
  title: "Musidle - Guess Today's Top Hits",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className=" h-full">
      <body className="dark grid place-items-center h-screen text-white">{children}</body>
    </html>
  );
}
