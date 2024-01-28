import React from 'react';

export default async function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-full w-full flex xl:flex-row flex-col flex-grow relative">{children}</div>
    </>
  );
}
