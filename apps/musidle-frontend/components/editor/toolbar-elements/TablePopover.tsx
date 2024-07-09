'use client';
import { type Editor } from '@tiptap/react';
import { LuTable } from 'react-icons/lu';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Button } from '../../ui/button';
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
