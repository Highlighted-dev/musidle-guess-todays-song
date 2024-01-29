/* eslint-disable @typescript-eslint/naming-convention */
'use client';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaChevronLeft } from 'react-icons/fa';
import { Button } from '../ui/button';
import TextareaAutosize from 'react-textarea-autosize';
import EditorJS from '@editorjs/editorjs';
import { ImSpinner2 } from 'react-icons/im';
import '../../styles/editor.css';
import { useRouter } from 'next/navigation';
export default function Editor({ post }: { post: { title: string } }) {
  const { register, handleSubmit } = useForm();
  const ref = useRef<EditorJS>();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const onSubmit = (data: any) => {
    setIsSaving(true);
    console.log(data);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const initializeEditor = useCallback(async () => {
    // const body = postPatchSchema.parse(post)
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    //@ts-ignore
    const Embed = (await import('@editorjs/embed')).default;
    //@ts-ignore
    const Table = (await import('@editorjs/table')).default;
    //@ts-ignore
    const List = (await import('@editorjs/list')).default;
    //@ts-ignore
    const LinkTool = (await import('@editorjs/link')).default;
    //@ts-ignore
    const Quote = (await import('@editorjs/quote')).default;
    //@ts-ignore
    const Marker = (await import('@editorjs/marker')).default;
    //@ts-ignore
    const Underline = (await import('@editorjs/underline')).default;
    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor;
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        // data: body.content,
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          table: Table,
          embed: Embed,
          quote: Quote,
          marker: Marker,
          underline: Underline,
        },
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
          event.preventDefault(); // Prevent the default "Tab" key action

          // Trigger the "Add" action
          // Replace this with the actual code to trigger the "Add" action in EditorJS
          editor.blocks.insert();
        }
      });
    }
  }, [post]);

  useEffect(() => {
    if (!ref.current) {
      initializeEditor();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [ref]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className=" mx-auto">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post.title}
            placeholder="Post title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...register('title')}
          />
          <div id="editor" className="min-h-[500px]" />
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
