import { type Editor, BubbleMenu } from '@tiptap/react';
import { Button } from '../ui/button';
import { LuBold, LuItalic, LuStrikethrough } from 'react-icons/lu';

export function EditorBubbleMenu({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="inline-flex h-10 flex-row items-center justify-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 leading-none shadow-sm dark:border-neutral-800 dark:bg-black"
    >
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 p-2 ${
          editor.isActive('bold')
            ? 'bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700'
            : ''
        }`}
        type={'button'}
        variant={'ghost'}
      >
        <LuBold size={20} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 p-2 ${
          editor.isActive('italic')
            ? 'bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700'
            : ''
        }`}
        type={'button'}
        variant={'ghost'}
      >
        <LuItalic size={20} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`h-8 p-2 ${
          editor.isActive('strike')
            ? 'bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700'
            : ''
        }`}
        type={'button'}
        variant={'ghost'}
      >
        <LuStrikethrough size={20} />
      </Button>
    </BubbleMenu>
  );
}
