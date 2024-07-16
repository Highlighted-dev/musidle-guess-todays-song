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
    <div className="px-4 md:px-6 lg:px-8">
      <NavigationMenu className="border-b justify-start">
        <NavigationMenuList className="flex flex-wrap">
          <NavigationMenuItem
            className={`${
              isActive(`/wiki/${id}`) ? 'border-b border-tertiary' : ''
            } flex-shrink-0 px-2`}
          >
            <Link href={`/wiki/${id}`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Overview
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${
              isActive(`/wiki/${id}/albums`) ? 'border-b border-tertiary' : ''
            } flex-shrink-0 px-2`}
          >
            <Link href={`/wiki/${id}/albums`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Albums
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${
              isActive(`/wiki/${id}/songs`) ? 'border-b border-tertiary' : ''
            } flex-shrink-0 px-2`}
          >
            <Link href={`/wiki/${id}/songs`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Songs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${
              isActive(`/wiki/${id}/quiz`) ? 'border-b border-tertiary' : ''
            } flex-shrink-0 px-2`}
          >
            <Link href={`/wiki/${id}/quiz`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Quiz</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex-shrink-0 px-2">
            <Link href={`/wiki/${id}`} legacyBehavior passHref aria-disabled>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} pointer-events-none opacity-50`}
              >
                News
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
