'use client';
import React from 'react';
import { toast } from './ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function UserAvatar() {
  const handleAvatarClick = () => {
    toast({
      title: 'Coming soon!',
      description: 'You will be able to change your avatar soon!',
      duration: 5000,
    });
  };
  return (
    <Avatar onClick={handleAvatarClick}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
