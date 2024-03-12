'use client';
import { useSocketStore } from '../../stores/SocketStore';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRoomStore } from '../../stores/RoomStore';
import { useSession } from 'next-auth/react';
import { toast } from '../ui/use-toast';

export default function GameChat() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const { socket } = useSocketStore.getState();
  const { data } = useSession();

  useEffect(() => {
    socket?.on('chat-message', message => {
      setMessages(messages => [...messages, message]);
    });
  }, [socket]);

  useEffect(() => {
    if (messages.length > 40) {
      setMessages(messages => messages.slice(5));
    }
  }, [messages]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message == '')
      return toast({ title: 'Message cannot be empty', duration: 5000, variant: 'destructive' });
    else if (message.length > 150)
      return toast({
        title: 'Message too long',
        description: 'Please keep your messages under 150 characters.',
        duration: 5000,
        variant: 'destructive',
      });
    socket?.emit(
      'send-chat-message',
      data?.user?.username + ': ' + message + '\n',
      useRoomStore.getState().roomCode,
    );
    setMessage('');
  };

  return (
    <Card className="min-w-[220px] lg:w-auto w-full lg:min-h-[700px] min-h-[500px] h-full relative lg:mt-2 mb-2">
      <CardHeader className="border-b p-4 flex items-center h-14">
        <div className="flex-1">
          <CardTitle className="text-center">Chat</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto overflow-x-hidden w-full p-4 break-words relative lg:h-[450px] h-[300px]">
        <div className="space-y-4 w-full">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col items-start space-y-1 w-full">
              <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 w-full">{message}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form className="flex flex-col w-full space-y-2" onSubmit={sendMessage}>
          <Input
            className="flex-1 min-w-0"
            placeholder="Type a message..."
            onChange={e => setMessage(e.target.value)}
            value={message}
          />
          <Button type="submit" variant={'tertiary'}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
