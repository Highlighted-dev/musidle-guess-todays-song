import { Editor, BubbleMenu } from '@tiptap/react';
import { Button } from '../ui/button';
import { LuBold, LuItalic, LuStrikethrough } from 'react-icons/lu';
export function EditorBubbleMenu({ editor }: { editor: Editor }) {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex justify-center items-center bg-popover border h-8 p-1 rounded-md rounded-br-none rounded-bl-none border-input flex-row gap-1"
    >
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active h-6 p-2 ' : 'h-6 p-2 '}
        variant={'secondary'}
        type={'button'}
      >
        <LuBold size={20} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active h-6 p-2 ' : 'h-6 p-2 '}
        variant={'secondary'}
        type={'button'}
      >
        <LuItalic size={20} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active h-6 p-2' : 'h-6 p-2'}
        variant={'secondary'}
        type={'button'}
      >
        <LuStrikethrough size={20} />
      </Button>
    </BubbleMenu>
  );
}
