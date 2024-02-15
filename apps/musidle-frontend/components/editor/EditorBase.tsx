import React from 'react';
import { EditorToolbar } from './Toolbar';
import { Editor, EditorContent } from '@tiptap/react';
import { EditorBubbleMenu } from './BubbleMenu';
import TextareaAutosize from 'react-textarea-autosize';
import { UseFormRegister } from 'react-hook-form';

export interface IFormData {
  name: string;
  content: string;
}

export default function EditorBase({
  editor,
  name,
  register,
}: {
  editor: Editor;
  name: string;
  register: UseFormRegister<{ name: string; content: string }>;
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
