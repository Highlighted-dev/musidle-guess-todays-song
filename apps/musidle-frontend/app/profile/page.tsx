import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getServerSession } from 'next-auth/next';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Label } from '@/components/ui/label';
import UserAvatar from '@/components/UserAvatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full">
      <CardHeader className="text-center h-1/6">
        <CardTitle>Profile</CardTitle>
        <CardDescription>Everything about you</CardDescription>
      </CardHeader>
      <CardContent className="h-5/6 mx-8">
        <Card className="h-2/5 w-full p-2 flex flex-col justify-center items-center">
          <CardHeader className="text-center pb-1 text-xs h-1/3 w-full flex justify-center items-center">
            <UserAvatar />
          </CardHeader>
          <CardContent className="flex justify-between text-center text-lg h-1/3 w-full">
            <div className="w-1/3 h-full">
              <Label>{session?.user.username}</Label>
              <p className="text-muted-foreground text-xs">Your username</p>
            </div>
            <div className="w-1/3 h-full">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="h-auto py-0 font-bold">
                    Hover to reveal
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <Label>{session?.user.email}</Label>
                </HoverCardContent>
              </HoverCard>
              <p className="text-muted-foreground text-xs">Your email</p>
            </div>
            <div className="w-1/3 h-full">
              <Label>{session?.user.role}</Label>
              <p className="text-muted-foreground text-xs">Your role</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-center h-1/3 w-full">
            <div className="w-1/2 h-full">
              <Button variant="tertiary">Edit profile</Button>
            </div>
            <div className="w-1/2 h-full">
              <Button variant="tertiary">Invite to Guild</Button>
            </div>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
}
