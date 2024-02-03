'use client';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { generateHTML } from '@tiptap/html';
import { JSONContent } from '@tiptap/react';

export const editorProps = {
  attributes: {
    class:
      'min-h-[300px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto',
  },
};

export const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal pl-4',
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc pl-4',
      },
    },
  }),

  Color,
  TextStyle,
  Highlight.configure({
    HTMLAttributes: {
      class: 'bg-[#1d283a] text-[#f8fafc] ',
    },
  }),
  Underline,
  Image,
  Link.configure({
    autolink: true,
    openOnClick: true,
    HTMLAttributes: {
      class: 'text-primary underline hover:no-underline cursor-pointer',
    },
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'w-full',
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class:
        'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium border-l border-r border-input',
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: '[&_tr]:border-b bg-muted/50 text-muted-foreground font-medium',
    },
  }),
];

export const generateHTMLFromJson = (json: JSONContent) => {
  return generateHTML(json, editorExtensions);
};
