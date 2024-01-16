'use client';
import { useSocketStore } from '@/stores/SocketStore';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRoomStore } from '@/stores/RoomStore';
import { useSession } from 'next-auth/react';
import { Label } from '../ui/label';
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

  const sendMessage = () => {
    if (message == '')
      return toast({ title: 'Message cannot be empty', duration: 5000, variant: 'destructive' });
    else if (message.length > 60)
      return toast({
        title: 'Message too long',
        description: 'Please keep your messages under 60 characters.',
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
    <div className="xl:w-[16%] w-full xl:h-full h-[20%] flex flex-col justify-center items-center min-w-[180px]  xl:p-0 py-6 flex-grow-0">
      <Card className="h-full w-full">
        <CardHeader className="text-center h-[10%]">
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[90%]">
          <Card className="h-[50%] xl:h-[90%] m-1 flex flex-col overflow-y-auto overflow-x-hidden">
            {messages.map((message, index) => (
              <div key={index} className="flex justify-start w-full">
                <Label key={index} className="p-[2px]">
                  {message}
                </Label>
              </div>
            ))}
          </Card>
          <div className="flex justify-between xl:h-[10%] h-auto w-full">
            <Input value={message} onChange={e => setMessage(e.target.value)} className="w-[65%]" />
            <Button className="w-[30%]" onClick={sendMessage}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
