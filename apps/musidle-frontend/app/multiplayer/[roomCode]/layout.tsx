import { Card } from '@/components/ui/card';
import React from 'react';

export default async function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full">
        {children}
      </Card>
    </>
  );
}
