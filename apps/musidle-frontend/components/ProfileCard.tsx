'use client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import React from 'react';
import { Label } from '@/components/ui/label';
import UserAvatar from '@/components/UserAvatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Session } from 'next-auth';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';

export default function ProfileCard({ session }: { session: Session | null }) {
  const [editMode, setEditMode] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const handleProfileEdit = () => {
    setEditMode(!editMode);
    if (!editMode) return;
    if (!username) {
      toast({
        title: 'Username cannot be empty',
        description: 'Please enter a username',
        variant: 'destructive',
      });
    } else if (username && username.length < 3) {
      toast({
        title: 'Username too short',
        description: 'Username must be at least 4 characters long',
        variant: 'destructive',
      });
    } else if (username && username.length > 20) {
      toast({
        title: 'Username too long',
        description: 'Username must be at most 20 characters long',
        variant: 'destructive',
      });
    } else if (username) {
      toast({
        title: 'Username updated',
        description: 'Your username has been updated (not implemented yet, nothing changed)',
      });
    }
  };
  return (
    <CardContent className="min-h-[300px] mx-8">
      <Card className="w-full p-2 flex flex-col justify-center items-center">
        <CardHeader className="text-center pb-1 text-xs h-1/3 w-full flex justify-center items-center">
          <UserAvatar />
        </CardHeader>
        <CardContent className="flex lg:justify-between justify-center items-center text-center text-lg w-full lg:flex-row flex-col">
          {editMode ? (
            <div className="lg:w-1/3 h-full flex justify-center items-center">
              <Input
                type="text"
                className="w-4/5 p-2"
                placeholder={session?.user.username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          ) : (
            <div className="lg:w-1/3 h-full">
              <Label>{session?.user.username}</Label>
              <p className="text-muted-foreground text-xs">Your username</p>
            </div>
          )}
          <div className="lg:w-1/3 h-full">
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
          <div className="lg:w-1/3 h-full">
            <Label>{session?.user.role}</Label>
            <p className="text-muted-foreground text-xs">Your role</p>
          </div>
        </CardContent>
        <CardFooter className="flex lg:justify-between justify-center items-center text-center w-full lg:flex-row flex-col">
          <div className="lg:w-1/2 h-full">
            <Button variant="tertiary" onClick={handleProfileEdit}>
              {editMode ? 'Save' : 'Edit profile'}
            </Button>
          </div>
          <div className="lg:w-1/2 h-full">
            <Button variant="tertiary">Message</Button>
          </div>
        </CardFooter>
      </Card>
    </CardContent>
  );
}
