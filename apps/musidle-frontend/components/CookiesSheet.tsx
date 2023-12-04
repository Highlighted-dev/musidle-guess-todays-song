'use client';
import React, { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

export function CookiesSheet() {
  const router = useRouter();
  return (
    <Sheet open>
      <SheetContent side={'bottom'}>
        <SheetHeader>
          <SheetTitle>Mandatory cookie info!</SheetTitle>
          <SheetDescription>
            Do you wish to accept cookies? We only use essential cookies for the website to function
            properly (e.g. to remember your login).
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="p-4">
          <Button
            type={'submit'}
            onClick={() => {
              setCookie('acceptedCookies', 'true', 1000);
              window.location.reload();
            }}
            className="m-1"
          >
            Accept
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => {
              router.push('https://www.google.com');
            }}
            className="m-1"
          >
            Decline
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function TriggerCookieSheet() {
  const [showCookieSheet, setShowCookieSheet] = React.useState(false);
  useEffect(() => {
    if (document.cookie.includes('acceptedCookies')) {
      return;
    }
    setShowCookieSheet(true);
  }, []);
  return showCookieSheet && <CookiesSheet />;
}
