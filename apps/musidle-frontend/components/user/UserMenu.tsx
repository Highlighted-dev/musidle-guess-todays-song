import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import GuildCreation from '../guilds/GuildCreation';
import { Session } from 'next-auth';
import { SignOut } from '../auth/SignOut';
import BugReport from './BugReport';
import UserSettings from './UserSettings';

export default function UserMenu({ session }: { session: Session | null }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Label className="max-w-[100px] sm:max-w-[140px] text-ellipsis whitespace-nowrap overflow-hidden leading-normal p-1">
            {session?.user.name}
          </Label>
          <IoIosArrowDown className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-inter">
        <DropdownMenuGroup>
          <Link href={`/profile/${session?.user.id}`}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <UserSettings session={session} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/guilds">
            <DropdownMenuItem>Guilds</DropdownMenuItem>
          </Link>
          {session?.user?.guild?._id ? (
            <Link href={`/guilds/${session.user.guild.name}`} key={session.user.guild._id}>
              <DropdownMenuItem>{session?.user?.guild.name}</DropdownMenuItem>
            </Link>
          ) : (
            <GuildCreation session={session} />
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>Help</DropdownMenuItem>
          <BugReport session={session} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
