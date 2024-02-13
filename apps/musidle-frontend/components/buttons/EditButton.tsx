'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaPen } from 'react-icons/fa';

export default function EditButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <FaPen
      size={50}
      className=" min-h-[20px] min-w-[20px] cursor-pointer text-[hsl(var(--tertiary))] "
      onClick={() => router.push(`/admin/editor/${id}`)}
    />
  );
}
