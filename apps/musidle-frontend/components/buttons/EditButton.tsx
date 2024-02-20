'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaPen } from 'react-icons/fa';

export default function EditButton({ size, url }: { size?: number; url: string }) {
  const router = useRouter();
  return (
    <FaPen
      size={size ? size : 50}
      className=" min-h-[20px] min-w-[20px] cursor-pointer text-[hsl(var(--tertiary))] ml-2"
      onClick={() => router.push(url)}
    />
  );
}
