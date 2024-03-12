import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Label } from './ui/label';
import { Button } from './ui/button';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import { signOut, useSession } from 'next-auth/react';
import { useNextAuthStore } from '../stores/NextAuthStore';
import GuildCreation from './GuildCreation';

export default function UserMenu() {
  const { data } = useSession();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Label className="flex flex-row">
            {data?.user.username}
            <IoIosArrowDown className="ml-2" />
          </Label>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-inter">
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href="/profile/settings">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/guilds">
            <DropdownMenuItem>Guilds</DropdownMenuItem>
          </Link>
          {data?.user?.guild?._id ? (
            <Link href={`/guilds/${data.user.guild.name}`} key={data.user.guild._id}>
              <DropdownMenuItem>{data?.user?.guild.name}</DropdownMenuItem>
            </Link>
          ) : (
            <GuildCreation />
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>Help</DropdownMenuItem>
          <DropdownMenuItem disabled>Report a problem</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            useNextAuthStore.setState({
              session: null,
            });
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
