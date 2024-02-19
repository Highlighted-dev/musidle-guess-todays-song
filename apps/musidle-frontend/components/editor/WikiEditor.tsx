'use client';
import { useEditor } from '@tiptap/react';
import '../../styles/editor.css';
import { toast } from '../ui/use-toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { editorExtensions, editorProps } from './editorConfig';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import Image from 'next/image';
import { Input } from '../ui/input';
import EditorBase, { IFormData } from './EditorBase';
import { IWiki } from '@/@types/Wiki';
import EditorFooter from './EditorFooter';

export function WikiEditor({ wiki }: { wiki: IWiki }) {
  const { register, handleSubmit } = useForm<IFormData>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const onSubmit = async (data: { name: string; content: string }) => {
    setIsSaving(true);
    const content = editor?.getHTML();

    const response = await fetch(getCurrentUrl() + `/externalApi/wikis/${wiki._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        content: content,
      }),
    });

    if (!response.ok)
      return toast({ title: 'Error', description: 'Failed to save post', variant: 'destructive' });

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
    content: wiki.description || '',
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
        <EditorBase editor={editor} name={wiki.name} register={register} />
        <div className="flex justify-center my-8 h-full  w-full">
          <Table>
            <TableCaption>Notable albums of an artist</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="text-right">Image url</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wiki.notableAlbums.slice(0, 4).map(album => (
                <TableRow key={album.name}>
                  <TableCell>
                    <Input defaultValue={album.name} />
                  </TableCell>
                  <TableCell>
                    <Image src={album.image[3]['#text']} width={64} height={64} alt="album image" />
                  </TableCell>
                  <TableCell>
                    <Input defaultValue={album.image[3]['#text']} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center my-8 h-full  w-full">
          <Table>
            <TableCaption>Popular songs albums of an artist</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Youtube Url</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wiki.popularSongs.slice(0, 8).map(song => (
                <TableRow key={song.name}>
                  <TableCell>
                    <Input defaultValue={song.name} />
                  </TableCell>
                  <TableCell>
                    <Input defaultValue={song.youtubeUrl} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center my-8 h-full  w-full">
          <Table>
            <TableCaption>Related artist</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Url</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wiki.relatedArtists.map(artist => (
                <TableRow key={artist.name}>
                  <TableCell>
                    <Input defaultValue={artist.name} />
                  </TableCell>
                  <TableCell>
                    <Input defaultValue={artist.url} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <EditorFooter isSaving={isSaving} />
      </div>
    </form>
  );
}
