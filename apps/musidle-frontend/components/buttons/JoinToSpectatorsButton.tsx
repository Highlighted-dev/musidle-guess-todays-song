import React from 'react';
import { Button } from '../ui/button';
import { joinToSpectatorsAction } from '../actions/joinToSpectatorsAction';
import { Session } from 'next-auth';
import { toast } from '../ui/use-toast';

export default function JoinToSpectatorsButton({
  roomCode,
  session,
}: {
  roomCode: string;
  session: Session | null;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await joinToSpectatorsAction(roomCode, session).then(res => {
      toast({
        title: res.status,
        description: res.message,
      });
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Button variant={'secondary'} className="my-2">
        Join
      </Button>
    </form>
  );
}
