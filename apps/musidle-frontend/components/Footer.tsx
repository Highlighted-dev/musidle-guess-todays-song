import React from 'react';
import { Label } from './ui/label';

export default async function Footer() {
  return (
    <footer>
      <div className="h-[50px] flex justify-center w-full py-4 relative bottom-0">
        <div className="flex justify-between ">
          <Label>Made with ❤️ by Highlighted-dev</Label>
        </div>
      </div>
    </footer>
  );
}
