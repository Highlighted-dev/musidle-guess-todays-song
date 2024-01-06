import React from 'react';

export default async function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-full w-full xl:min-h-0 min-h-[100vh]">{children}</div>
    </>
  );
}
