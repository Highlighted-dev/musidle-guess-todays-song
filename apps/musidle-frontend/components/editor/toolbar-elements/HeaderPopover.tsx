'use client';
import { type Editor } from '@tiptap/react';
import { Toggle } from '../../ui/toggle';
import {
  LuHeading,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from 'react-icons/lu';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';

export function HeaderPopover({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger className="flex flex-row justify-center items-center">
        <LuHeading size={20} />
      </PopoverTrigger>
      <PopoverContent className="flex justify-center items-center">
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <LuHeading1 size={20} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <LuHeading2 size={20} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <LuHeading3 size={20} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 4 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          <LuHeading4 size={20} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 5 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        >
          <LuHeading5 size={20} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 6 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        >
          <LuHeading6 size={20} />
        </Toggle>
      </PopoverContent>
    </Popover>
  );
}
