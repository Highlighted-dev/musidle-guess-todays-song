'use client';
import { useSocketStore } from '@/stores/SocketStore';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRoomStore } from '@/stores/RoomStore';
import { useSession } from 'next-auth/react';

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

  const sendMessage = () => {
    socket?.emit(
      'send-chat-message',
      data?.user?.username + ': ' + message,
      useRoomStore.getState().roomCode,
    );
    setMessage('');
  };

  return (
    <div className="xl:w-[16%] w-full xl:h-full h-[70%] flex flex-col justify-center items-center min-w-[180px] xl:absolute top-0 left-0 xl:p-0 py-6">
      <div className=" h-full w-full ">
        <Card className="h-full w-full">
          <CardHeader className="text-center h-[10%]">
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[90%]">
            <div className="xl:h-[90%] h-[90%] overflow-auto m-1">
              {messages.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div>
            <div className="flex justify-between h-[10%] w-full">
              <Input
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-[65%]"
              />
              <Button className="w-[30%]" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
