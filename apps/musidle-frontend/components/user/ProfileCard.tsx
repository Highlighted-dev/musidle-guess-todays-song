'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import React from 'react';
import { Label } from '../ui/label';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Button } from '../ui/button';
import { Session } from 'next-auth';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { useForm } from 'react-hook-form';
import { editProfileAction } from './EditProfileAction';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { IUser } from '@/@types/next-auth';

export interface IUserEditForm {
  name: string;
}

export default function ProfileCard({
  session,
  user,
}: {
  session: Session | null;
  user: IUser | null;
}) {
  const [editMode, setEditMode] = React.useState(false);
  const { register, handleSubmit, reset } = useForm<IUserEditForm>();
  const router = useRouter();
  const onSubmit = async (formData: IUserEditForm) => {
    await editProfileAction(formData, session).then(result => {
      toast({
        title: result?.status,
        description: result?.message,
      });
      setEditMode(false);
      if (result?.status === 'Success') {
        router.refresh();
        reset();
      }
    });
  };

  return (
    <CardContent className="min-h-[300px]">
      <Card className="w-full p-2 flex flex-col justify-center items-center">
        <CardHeader className="text-center pb-2 w-full flex justify-center items-center">
          <Avatar>
            <AvatarImage src={user?.image} alt="avatar" />
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
          </Avatar>
        </CardHeader>
        {editMode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <CardContent className="grid sm:grid-cols-3 grid-cols-1 gap-2 text-lg">
              <div className="flex flex-col items-center justify-center gap-1">
                <Input
                  type="text"
                  className="w-4/5 p-2"
                  placeholder={session?.user.name}
                  {...register('name')}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link" className="h-auto py-0 font-bold">
                      Hover to reveal
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex items-center justify-center">
                    <Label>{session?.user.email}</Label>
                  </HoverCardContent>
                </HoverCard>
                <p className="text-muted-foreground text-xs">Your email</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <Label>{session?.user.role}</Label>
                <p className="text-muted-foreground text-xs">Your role</p>
              </div>
            </CardContent>
            <CardFooter className="flex lg:justify-between justify-center items-center text-center w-full lg:flex-row flex-col">
              <div className="lg:w-1/2 h-full">
                <Button type="submit">Save</Button>
              </div>
              <div className="lg:w-1/2 h-full">
                <Button type="button">Message</Button>
              </div>
            </CardFooter>
          </form>
        ) : (
          <div className="w-full">
            <CardContent className="grid sm:grid-cols-3 grid-cols-1 gap-2 text-lg">
              <div className="flex flex-col items-center justify-center gap-1">
                <Label>{user?.name}</Label>
                <p className="text-muted-foreground text-xs">Your username</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link" className="h-auto py-0 font-bold">
                      Hover to reveal
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex items-center justify-center">
                    <Label>
                      {session?.user.email === user?.email ? session?.user.email : 'Private'}
                    </Label>
                  </HoverCardContent>
                </HoverCard>
                <p className="text-muted-foreground text-xs">Your email</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <Label>{user?.role}</Label>
                <p className="text-muted-foreground text-xs">Your role</p>
              </div>
            </CardContent>
            <CardFooter className="grid sm:grid-cols-2 grid-cols-1 gap-2">
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  onClick={() => {
                    if (session?.user.id === user?.id) {
                      setEditMode(true);
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Button type="button" disabled>
                  Message
                </Button>
              </div>
            </CardFooter>
          </div>
        )}
      </Card>
      <Card className="w-full p-2 flex flex-col justify-center items-center mt-2">
        <CardHeader className="text-center">
          <CardTitle>Stats</CardTitle>
          <CardDescription>Memories of your journey</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-5 grid-cols-1 gap-8 text-lg">
          <div className="flex flex-col items-center justify-center gap-1">
            <Label className="text-primary">{user?.stats.correctAnswers}</Label>
            <p className="text-muted-foreground text-xs">Correct Answers</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Label className="text-primary">{user?.stats.wrongAnswers}</Label>
            <p className="text-muted-foreground text-xs">Wrong Answers</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Label className="text-primary">{user?.stats.totalAnswers}</Label>
            <p className="text-muted-foreground text-xs">Total Answers</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Label className="text-primary">{user?.stats.totalPoints}</Label>
            <p className="text-muted-foreground text-xs">Total points</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Label className="text-primary">{user?.stats.totalGames}</Label>
            <p className="text-muted-foreground text-xs">Games played</p>
          </div>
        </CardContent>
      </Card>
    </CardContent>
  );
}
