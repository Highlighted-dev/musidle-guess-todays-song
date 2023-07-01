import { Label } from '@/components/ui/label';
import React from 'react';

const legal = () => {
  return (
    <div className="rounded-md overflow-hidden w-4/6 h-4/6 min-h-[600px]">
      <h1 className="text-center text-2xl font-bold pb-4">FAQ</h1>
      <Label>
        How is it legal - The company that is responsible for the websites residents in Poland.
        Here, we have a{' '}
        <a
          href="http://www.prawoautorskie.pl/art-29-prawo-cytatu#:~:text=Wolno%20przytacza%C4%87%20w%20utworach%20stanowi%C4%85cych,naukowa%2C%20nauczanie%20lub%20prawami%20gatunku"
          className=" underline"
        >
          &apos;quotation right&apos;,
        </a>{' '}
        which basically means that we can use a small part of the song (we are using up to 12s) for
        educational purposes, commentary or criticism.
      </Label>
    </div>
  );
};

export default legal;
