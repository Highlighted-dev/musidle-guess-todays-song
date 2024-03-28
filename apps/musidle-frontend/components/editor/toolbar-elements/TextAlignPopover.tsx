'use client';
import { type Editor } from '@tiptap/react';
import { LuAlignJustify } from '@react-icons/all-files/lu/LuAlignJustify';
import { LuAlignLeft } from '@react-icons/all-files/lu/LuAlignLeft';
import { LuAlignCenter } from '@react-icons/all-files/lu/LuAlignCenter';
import { LuAlignRight } from '@react-icons/all-files/lu/LuAlignRight';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Button } from '../../ui/button';
export function TextAlignPopover({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger className="flex flex-row justify-center items-center p-1">
        <LuAlignJustify size={20} />
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-3 gap-1 ">
        <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          variant={'secondary'}
        >
          <LuAlignLeft size={20} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          variant={'secondary'}
        >
          <LuAlignCenter size={20} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          variant={'secondary'}
        >
          <LuAlignRight size={20} />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
