import React from 'react';

export const metadata = {
  title: 'Musidle Games',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <div className="container py-6">{children}</div>;
}
