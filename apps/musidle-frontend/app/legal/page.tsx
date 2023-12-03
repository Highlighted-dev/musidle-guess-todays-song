import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import React from 'react';

export default async function Page() {
  return (
    <div className="h-4/5 w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center relative min-h-[450px]">
      <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full">
        <CardHeader className=" text-center">
          <CardTitle className="font-bold">FAQ</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <Label>
            <label className="font-bold">1. How is it legal</label> - The person that is responsible
            for this website residents in Poland. Here, we have a{' '}
            <a href="https://pl.wikipedia.org/wiki/Prawo_cytatu" className=" underline">
              &apos;quotation right&apos;,
            </a>{' '}
            which basically means that we can use a small part of the song (we are using up to 12s,
            which is about 5,5% of the average song) for educational purposes, commentary or
            criticism.
          </Label>
        </CardContent>
      </Card>
    </div>
  );
}
