import { Card } from 'apps/musidle-frontend/components/ui/card';
import React from 'react';

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-4/5 w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center">
      <Card className=" float-left xl:w-4/6 flex flex-col justify-center align-center min-h-[450px]">
        {children}
      </Card>
    </div>
  );
}
