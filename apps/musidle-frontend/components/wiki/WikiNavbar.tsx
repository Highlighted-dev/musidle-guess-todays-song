'use client';
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function WikiNavbar({ id }: { id: string }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 ">
      <NavigationMenu className="border-b justify-start">
        <NavigationMenuList>
          <NavigationMenuItem
            className={`${isActive(`/wiki/${id}`) ? 'border-b border-tertiary' : ''}`}
          >
            <Link href={`/wiki/${id}`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Overview
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${isActive(`/wiki/${id}/albums`) ? 'border-b border-tertiary' : ''}`}
          >
            <Link href={`/wiki/${id}/albums`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Albums
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${isActive(`/wiki/${id}/songs`) ? 'border-b border-tertiary' : ''}`}
          >
            <Link href={`/wiki/${id}/songs`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Songs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${isActive(`/wiki/${id}/news`) ? 'border-b border-tertiary' : ''}`}
          >
            <Link href={`/wiki/${id}/news`} legacyBehavior passHref aria-disabled>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle() + 'pointer-events-none opacity-50'}`}
              >
                News (Coming soon)
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
