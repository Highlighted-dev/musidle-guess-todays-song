'use client';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';

export default function EditorFooter({ isSaving }: { isSaving: boolean }) {
  return (
    <div className="flex w-full items-center justify-between relative">
      <div className="flex items-center space-x-10">
        <Button variant={'ghost'}>
          <Link href="/">
            <div className="flex items-center">
              <FaChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </div>
          </Link>
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Check{' '}
        <kbd className="rounded-md border bg-muted px-1 text-xs">
          <Link href={'https://tiptap.dev/docs/editor/introduction'}>TipTap docs</Link>
        </kbd>{' '}
        for useful hotkeys
      </p>
      <Button type="submit">
        {isSaving && <ImSpinner2 className="mr-2 h-4 w-4 animate-spin" />}
        <span>Save</span>
      </Button>
    </div>
  );
}
