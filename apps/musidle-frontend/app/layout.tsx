'use client';
import { Metadata } from 'next/types';
import '../styles/global.css';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';
import AuthProvider from '@/components/contexts/AuthContext';

import LoginAndRegister from '@/components/LoginAndRegister';

export const metadata: Metadata = {
  title: "Musidle - Guess Today's Top Hits",
};

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);

ListItem.displayName = 'ListItem';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const components: { title: string; href: string; description: string }[] = [
    {
      title: 'Musidle',
      href: '/',
      description:
        'Wordle-like game, but about guessing top music hits. You can only play once a day!',
    },
    {
      title: 'Musidle Multiplayer',
      href: '/multiplayer',
      description:
        'Ever wanted to play "Guess the song" type of game with your friends? Join a room and try it out!',
    },
  ];

  return (
    <html lang="en" className="w-full h-full">
      <body className="dark h-full w-full">
        <AuthProvider>
          <div className="w-full h-full">
            <div className="w-full h-[60px] p-4 fixed left-0 top-0 z-10">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Gamemodes</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[700px]">
                        {components.map(component => (
                          <Link key={component.title} href={component.href} legacyBehavior passHref>
                            <ListItem title={component.title}>{component.description}</ListItem>
                          </Link>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <div className="fixed right-0 top-0 p-4 z-20">
                <LoginAndRegister />
              </div>
            </div>
            <div className="flex justify-center items-center w-full h-full text-white m-0 p-0">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
