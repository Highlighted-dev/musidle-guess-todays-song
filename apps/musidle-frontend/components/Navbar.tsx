import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { cn } from '../lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { SignIn } from './auth/SignIn';
import { Session } from 'next-auth';
import UserMenu from './user/UserMenu';

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
function Navbar({ session }: { session: Session | null }) {
  const components: { title: string; href: string; description: string }[] = [
    {
      title: 'Musidle',
      href: '/',
      description:
        'Read about whats happening in music industry, learn about your favourite artists & how to play their songs.',
    },
    {
      title: 'Musidle Games',
      href: '/games',
      description:
        'Play music games, challenge your friends and see who is the real music guru or play daily challanges by yourself.',
    },
  ];

  return (
    <>
      <div className="flex w-full h-[50px] p-[29px] z-10 relative justify-center items-center" />
      <section className={'fixed top-0 z-50 w-full bg-background p-1 border-b'}>
        <div className="absolute left-0 z-20 py-1 px-2">
          <div className="flex w-full h-full justify-center items-center">
            <Link href="/" className="text-accent-foreground p-1">
              <Image src="/favicon.ico" alt="Musidle Logo" width={35} height={35} />
            </Link>
          </div>
        </div>
        <div className="flex w-full h-[50px] p-5 z-10 relative justify-center items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[850px]">
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
          <div className="absolute right-0 p-2 z-20">
            {session ? <UserMenu session={session} /> : <SignIn />}
          </div>
        </div>
      </section>
    </>
  );
}

export default Navbar;
