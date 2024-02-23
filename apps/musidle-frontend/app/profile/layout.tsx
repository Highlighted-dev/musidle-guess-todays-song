import React from 'react';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <div className="container flex justify-center align-center py-12 ">{children}</div>;
}
