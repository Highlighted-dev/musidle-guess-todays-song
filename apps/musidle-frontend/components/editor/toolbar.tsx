'use client';
import { type Editor } from '@tiptap/react';
import { Toggle } from '../ui/toggle';
import {
  LuBold,
  LuItalic,
  LuList,
  LuStrikethrough,
  LuUnderline,
  LuHighlighter,
  LuImage,
} from 'react-icons/lu';
import { MdOutlineFormatListNumbered } from 'react-icons/md';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { HeaderPopover } from './toolbar-elements/HeaderPopover';
import { TablePopover } from './toolbar-elements/TablePopover';
import { TextAlignPopover } from './toolbar-elements/TextAlignPopover';
import { GroupedBasicFormatters } from './toolbar-elements/GroupedBasicFormatters';

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
      <GroupedBasicFormatters editor={editor} />
      <div className="hidden min-[568px]:flex">
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
      </div>

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
      <TextAlignPopover editor={editor} />
    </div>
  );
}
