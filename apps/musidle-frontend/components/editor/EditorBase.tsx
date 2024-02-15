import React from 'react';
import { EditorToolbar } from './Toolbar';
import { EditorContent } from '@tiptap/react';
import { EditorBubbleMenu } from './BubbleMenu';
import TextareaAutosize from 'react-textarea-autosize';
export default function EditorBase({
  editor,
  name,
  register,
}: {
  editor: any;
  name: string;
  register: any;
}) {
  return (
    <div className="mx-auto">
      <TextareaAutosize
        autoFocus
        id="name"
        defaultValue={name}
        placeholder="Post title"
        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none p-2"
        {...register('name')}
      />
      {editor ? <EditorToolbar editor={editor} /> : null}
      <EditorContent editor={editor} className=" max-w-[800px] min-h-[400px]" id={'editor'} />
      <EditorBubbleMenu editor={editor} />
    </div>
  );
}
