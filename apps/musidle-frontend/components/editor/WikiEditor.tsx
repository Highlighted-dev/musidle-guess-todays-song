'use client';
import { useEditor } from '@tiptap/react';
import '../../styles/editor.css';
import { toast } from '../ui/use-toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ImSpinner2 } from '@react-icons/all-files/im/ImSpinner2';
import { getCurrentUrl } from '../../utils/GetCurrentUrl';
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
import { IWiki } from '../../@types/Wiki';
import EditorFooter from './EditorFooter';

export function WikiEditor({ wiki }: { wiki: IWiki }) {
  const { register, handleSubmit } = useForm<IFormData>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [popularSongs, setPopularSongs] = useState(wiki.popularSongs);
  const [relatedArtists, setRelatedArtists] = useState(wiki.relatedArtists);
  const [notableAlbums, setNotableAlbums] = useState(wiki.notableAlbums);

  const onSubmit = async (data: { name: string; content: string }) => {
    setIsSaving(true);
    const content = editor?.getHTML();

    // map over popular songs urls and change "watch?v=" to "embed/" if it exists
    popularSongs.forEach(song => {
      if (song.youtubeUrl.includes('watch?v=')) {
        const url = song.youtubeUrl.replace('watch?v=', 'embed/');
        song.youtubeUrl = url;
      }
    });

    const updatedData = {
      name: data.name,
      description: content,
      notableAlbums: notableAlbums,
      popularSongs: popularSongs,
      relatedArtists: relatedArtists,
      tags: wiki.tags,
    };

    const response = await fetch(getCurrentUrl() + `/externalApi/wikis/${wiki._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    setIsSaving(false);
    if (!response.ok)
      return toast({ title: 'Error', description: 'Failed to save wiki', variant: 'destructive' });

    return toast({
      title: 'Wiki saved',
      description: 'Your wiki has been saved',
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
              {notableAlbums.slice(0, 4).map((album, index) => (
                <TableRow key={album.name}>
                  <TableCell>
                    <Input
                      defaultValue={album.name}
                      onChange={e => {
                        const newAlbums = [...notableAlbums];
                        newAlbums[index].name = e.target.value;
                        setNotableAlbums(newAlbums);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Image src={album.image[3]['#text']} width={64} height={64} alt="album image" />
                  </TableCell>
                  <TableCell>
                    <Input
                      defaultValue={album.image[3]['#text']}
                      onChange={e => {
                        const newAlbums = [...notableAlbums];
                        newAlbums[index].image[3]['#text'] = e.target.value;
                        setNotableAlbums(newAlbums);
                      }}
                    />
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
              {popularSongs.slice(0, 8).map((song, index) => (
                <TableRow key={song.name}>
                  <TableCell>
                    <Input
                      value={song.name}
                      onChange={e => {
                        const newSongs = [...popularSongs];
                        newSongs[index].name = e.target.value;
                        setPopularSongs(newSongs);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={song.youtubeUrl}
                      onChange={e => {
                        const newSongs = [...popularSongs];
                        newSongs[index].youtubeUrl = e.target.value;
                        setPopularSongs(newSongs);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center my-8 h-full w-full">
          <Table>
            <TableCaption>Related artist</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Url</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatedArtists.map((artist, index) => (
                <TableRow key={artist.name}>
                  <TableCell>
                    <Input
                      defaultValue={artist.name}
                      onChange={e => {
                        const newArtists = [...relatedArtists];
                        newArtists[index].name = e.target.value;
                        setRelatedArtists(newArtists);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      defaultValue={artist.url}
                      onChange={e => {
                        const newArtists = [...relatedArtists];
                        newArtists[index].url = e.target.value;
                        setRelatedArtists(newArtists);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <EditorFooter isSaving={isSaving} />
    </form>
  );
}
