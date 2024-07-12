'use client';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
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

export interface IUserEditForm {
  name: string;
}

export default function ProfileCard({ session }: { session: Session | null }) {
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
    <CardContent className="min-h-[300px] mx-8">
      <Card className="w-full p-2 flex flex-col justify-center items-center">
        <CardHeader className="text-center pb-1 text-xs h-1/3 w-full flex justify-center items-center">
          <Avatar>
            <AvatarImage src={session?.user.image} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </CardHeader>
        {editMode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <CardContent className="flex lg:justify-between justify-center items-center text-center text-lg w-full lg:flex-row flex-col">
              <div className="lg:w-1/3 h-full flex justify-center items-center">
                <Input
                  type="text"
                  className="w-4/5 p-2"
                  placeholder={session?.user.name}
                  {...register('name')}
                />
              </div>
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
                <Button type="submit">Save</Button>
              </div>
              <div className="lg:w-1/2 h-full">
                <Button type="button">Message</Button>
              </div>
            </CardFooter>
          </form>
        ) : (
          <div className="w-full">
            <CardContent className="flex lg:justify-between justify-center items-center text-center text-lg w-full lg:flex-row flex-col">
              <div className="lg:w-1/3 h-full">
                <Label>{session?.user.name}</Label>
                <p className="text-muted-foreground text-xs">Your username</p>
              </div>
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
                <Button type="button" onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
              </div>
              <div className="lg:w-1/2 h-full">
                <Button type="button">Message</Button>
              </div>
            </CardFooter>
          </div>
        )}
      </Card>
    </CardContent>
  );
}
