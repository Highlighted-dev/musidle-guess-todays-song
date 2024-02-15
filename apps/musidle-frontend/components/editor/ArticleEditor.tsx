'use client';
import { useEditor } from '@tiptap/react';
import '../../styles/editor.css';
import { toast } from '../ui/use-toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ImSpinner2 } from 'react-icons/im';
import { editorExtensions, editorProps } from './editorConfig';
import EditorBase, { IFormData } from './EditorBase';

export function ArticleEditor({
  url,
  name,
  content,
}: {
  name: string;
  content: string;
  url: string;
}) {
  const { register, handleSubmit } = useForm<IFormData>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const onSubmit = async (data: { name: string; content: string }) => {
    setIsSaving(true);
    const content = editor?.getHTML();

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.name,
        content: content,
      }),
    });

    setIsSaving(false);
    if (!response.ok)
      return toast({ title: 'Error', description: 'Failed to save post', variant: 'destructive' });

    return toast({
      title: 'Post saved',
      description: 'Your post has been saved',
    });
  };

  const editor = useEditor({
    editorProps: editorProps,
    extensions: editorExtensions,
    content: content || '',
  });

  if (!editor) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <ImSpinner2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full">
        <EditorBase editor={editor} name={name} register={register} />
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Button variant={'ghost'}>
              <Link href="/">
                <div className="flex items-center">
                  <FaChevronLeft className="mr-2 h-4 w-4" />
                  Go Back
                </div>
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Check{' '}
            <kbd className="rounded-md border bg-muted px-1 text-xs">
              <Link href={'https://tiptap.dev/docs/editor/introduction'}>TipTap docs</Link>
            </kbd>{' '}
            for useful hotkeys
          </p>
          <Button type="submit">
            {isSaving && <ImSpinner2 className="mr-2 h-4 w-4 animate-spin" />}
            <span>Save</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
