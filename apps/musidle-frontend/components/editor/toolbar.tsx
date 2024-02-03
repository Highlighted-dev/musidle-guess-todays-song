'use client';
import { type Editor } from '@tiptap/react';
import { Toggle } from '../ui/toggle';
import {
  LuHeading,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuBold,
  LuItalic,
  LuList,
  LuStrikethrough,
  LuUnderline,
  LuHighlighter,
  LuImage,
  LuTable,
} from 'react-icons/lu';
import { MdOutlineFormatListNumbered } from 'react-icons/md';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { IoIosArrowDown } from 'react-icons/io';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

export function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="border border-input bg-transparent rounded-br-md rounded-bl-md p-1 flex flex-row items-center gap-1">
      <Input
        type="color"
        onInput={e => editor.chain().focus().setColor(e.currentTarget.value).run()}
        value={editor.getAttributes('textStyle').color}
        data-testid="setColor"
        className="w-10 h-8 rounded-md border border-input bg-transparent p-0.5 cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden"
      />
      <HeaderPopover editor={editor} />
      <Separator orientation="vertical" className="w-[1px] h-8" />
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

      <Separator orientation="vertical" className="w-[1px] h-8" />
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <LuList size={23} />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <MdOutlineFormatListNumbered size={23} />
      </Toggle>
      <Separator orientation="vertical" className="w-[1px] h-8" />
      <Popover>
        <PopoverTrigger className="flex flex-row justify-center items-center p-1">
          <LuImage size={20} />
        </PopoverTrigger>
        <PopoverContent className="flex justify-center items-center">
          <Input
            type="text"
            placeholder="Image URL"
            onInput={e => editor.chain().focus().setImage({ src: e.currentTarget.value }).run()}
            className="w-32 h-8 rounded-md border border-input bg-transparent p-0.5 cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden"
          />
        </PopoverContent>
      </Popover>
      <TablePopover editor={editor} />
    </div>
  );
}

export function HeaderPopover({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger className="flex flex-row justify-center items-center">
        <LuHeading size={20} /> <IoIosArrowDown />
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

export function TablePopover({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger className="flex flex-row justify-center items-center p-1">
        <LuTable size={20} />
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-3 gap-1 min-w-[400px]">
        <Button
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          variant={'secondary'}
        >
          Create Table
        </Button>
        <Button
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.isActive('table')}
          variant={'secondary'}
        >
          Delete Table
        </Button>
        <Button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.isActive('table')}
          variant={'secondary'}
        >
          + Row After
        </Button>
        <Button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={!editor.isActive('table')}
          variant={'secondary'}
        >
          + Row Before
        </Button>
        <Button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.isActive('table')}
          variant={'secondary'}
        >
          + Column After
        </Button>
        <Button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!editor.isActive('table')}
          variant={'secondary'}
        >
          + Column Before
        </Button>
        <Button
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!editor.isActive('table')}
          variant={'secondary'}
        >
          Delete Row
        </Button>
        <Button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.isActive('table')}
          variant={'secondary'}
        >
          Delete Column
        </Button>
      </PopoverContent>
    </Popover>
  );
}
