'use client';
import { type Editor } from '@tiptap/react';
import { Toggle } from '../../ui/toggle';
import {
  LuBold,
  LuHighlighter,
  LuItalic,
  LuStrikethrough,
  LuType,
  LuUnderline,
} from 'react-icons/lu';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';

export function GroupedBasicFormatters({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger className="flex flex-row justify-center items-center p-1 min-[568px]:hidden">
        <LuType size={20} />
      </PopoverTrigger>
      <PopoverContent className="flex justify-center items-center">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <LuBold size={20} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <LuItalic size={18} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <LuStrikethrough size={18} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <LuUnderline size={18} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('highlight')}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        >
          <LuHighlighter size={18} />
        </Toggle>
      </PopoverContent>
    </Popover>
  );
}
