'use client';
import { MdBedroomChild } from '@react-icons/all-files/md/MdBedroomChild';
import React from 'react';
import { EmptyPlaceholder } from './ui/empty-placeholder';
import JoinRoomButton from './buttons/CreateRoomButton';

export default async function NoRooms() {
  return (
    <EmptyPlaceholder>
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center min-h-[450px]">
        <EmptyPlaceholder.Icon Icon={MdBedroomChild} />
        <EmptyPlaceholder.Title>No rooms found</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Create a room to play with your friends
        </EmptyPlaceholder.Description>
        <JoinRoomButton />
      </div>
    </EmptyPlaceholder>
  );
}
