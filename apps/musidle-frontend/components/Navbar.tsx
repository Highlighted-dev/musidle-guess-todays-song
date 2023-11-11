'use client';
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/naming-convention
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
function Navbar() {
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
    {
      title: 'Musidle Wiki (COMING SOON)',
      href: '/',
      description: 'Learn more about music and how to play it.',
    },
    {
      title: '???',
      href: '/',
      description: 'Coming soon!',
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[750px]">
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
  );
}

export default Navbar;
