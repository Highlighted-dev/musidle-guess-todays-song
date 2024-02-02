'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from './toolbar';
import '../../styles/editor.css';
import { toast } from '../ui/use-toast';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { Button } from '../ui/button';
import TextareaAutosize from 'react-textarea-autosize';
import Link from 'next/link';
import { ImSpinner2 } from 'react-icons/im';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { editorExtensions, editorProps, generateHTMLFromJson } from './editorConfig';
import { EditorBubbleMenu } from './bubble-menu';

interface IFormData {
  title: string;
  content: any;
}

function Editor({
  post,
}: {
  post: { _id: string; title: string; content: any; author: { _id: string; username: string } };
}) {
  const { register, handleSubmit } = useForm<IFormData>();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const onSubmit = async (data: { title: string; content: any }) => {
    setIsSaving(true);
    const content = editor?.getJSON();

    const response = await fetch(getCurrentUrl() + `/externalApi/articles/${post._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        content: content,
      }),
    });

    setIsSaving(false);

    return toast({
      title: 'Post saved',
      description: 'Your post has been saved',
      duration: 5000,
    });
  };

  const editor = useEditor({
    editorProps: editorProps,
    extensions: editorExtensions,
    content: generateHTMLFromJson(post.content) || '',
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
        <div className="mx-auto">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post.title}
            placeholder="Post title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none p-2"
            {...register('title')}
          />
          {editor ? <EditorToolbar editor={editor} /> : null}
          <EditorContent editor={editor} className=" max-w-[800px] min-h-[600px]" id={'editor'} />
          <EditorBubbleMenu editor={editor} />
        </div>
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
            Use <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">/</kbd> to open
            the command menu and{' '}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">CTRL + /</kbd> to
            open tune menu.
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

export default Editor;
