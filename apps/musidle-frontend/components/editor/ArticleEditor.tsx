'use client';
import { useEditor } from '@tiptap/react';
import '../../styles/editor.css';
import { toast } from '../ui/use-toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ImSpinner2 } from '@react-icons/all-files/im/ImSpinner2';
import { editorExtensions, editorProps } from './editorConfig';
import EditorBase, { IFormData } from './EditorBase';
import EditorFooter from './EditorFooter';

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
        <EditorFooter isSaving={isSaving} />
      </div>
    </form>
  );
}
