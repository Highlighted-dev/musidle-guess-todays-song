import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Strike from '@tiptap/extension-strike';
import Italic from '@tiptap/extension-italic';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Bold } from '@tiptap/extension-bold';
import { Heading } from '@tiptap/extension-heading';
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
  Document,
  Paragraph,
  Bold,
  Heading,
  ListItem,
  OrderedList,
  Strike,
  Italic,
  Color,
  TextStyle,
];

export const generateHTMLFromJson = (json: JSONContent) => {
  return generateHTML(json, [
    Document,
    Paragraph,
    Text,
    Bold,
    Heading,
    ListItem,
    OrderedList,
    Strike,
    Italic,
    Color,
    TextStyle,
  ]);
};
