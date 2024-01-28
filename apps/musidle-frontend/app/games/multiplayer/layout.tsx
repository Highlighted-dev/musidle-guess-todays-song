import React from 'react';

export default async function MultiplayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="xl:h-4/5 h-full w-[90%] flex xl:flex-row flex-col justify-center align-center relative">
      {children}
    </div>
  );
}
