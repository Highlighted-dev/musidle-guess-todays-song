import { IWiki } from '@/@types/Wiki';
import Redirecter from '@/components/Redirecter';
import EditButton from '@/components/EditButton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PlaySong from '@/components/wiki/PlayEmbed';
import WikiNavbar from '@/components/wiki/WikiNavbar';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import DOMPurify from 'isomorphic-dompurify';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import '../../../styles/editor.css';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RxCross1 } from 'react-icons/rx';
import { FaSpotify } from 'react-icons/fa';
import { LuInstagram, LuTwitter } from 'react-icons/lu';
import { auth } from '@/auth';
import { Metadata } from 'next';

type Props = {
  params: { wikiId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.wikiId;
  const wiki = await getWiki(id);
  if (!wiki) {
    return {
      title: 'Musidle Wiki',
    };
  }
  return {
    title: wiki.name + ' - Wiki',
    openGraph: {
      title: wiki.name + ' - Wiki',
      siteName: 'Musidle',
      images: [
        {
          url: wiki.coverImage.url,
          width: 800,
          height: 600,
          alt: wiki.name + ' Image',
        },
      ],
    },
  };
}

async function getWiki(wikiId: string) {
  try {
    const wiki: IWiki = await fetch(getCurrentUrl() + `/externalApi/wikis/${wikiId}`, {
      cache: 'no-cache',
    }).then(res => res.json());
    return wiki;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function Wiki({ params }: { params: { wikiId: string } }) {
  const wiki = await getWiki(params.wikiId);
  const session = await auth();
  if (!wiki) {
    return (
      <Redirecter
        url={`/`}
        message={`The wiki you tried to open does not exist.`}
        variant={'default'}
      />
    );
  }
  const sanitizedHTML = () => {
    return { __html: DOMPurify.sanitize(wiki.description) };
  };

  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <div className="flex items-center justify-start h-20 py-10 px-4 md:px-6 lg:px-8 ">
        <h1 className="text-3xl font-bold">{wiki.name || 'This wiki does not exist yet'}</h1>
        {session?.user.role == 'admin' ? (
          <EditButton url={`/admin/editor/wiki/${wiki._id}`} size={25} />
        ) : null}
      </div>
      <WikiNavbar id={wiki._id} />
      <div className="flex-1 py-10 px-4 md:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-4 prose prose-invert max-w-none">{wiki.shortDescription}</p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className=" text-2xl font-bold py-3">Bio</AccordionTrigger>
              <AccordionContent>
                <div
                  dangerouslySetInnerHTML={sanitizedHTML()}
                  id="editor"
                  className="prose prose-invert max-w-none"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Notable Albums</h2>
          {wiki.notableAlbums ? (
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
              {wiki.notableAlbums.slice(0, 4).map(album => (
                <Card key={album.name}>
                  <AspectRatio ratio={1}>
                    <Image
                      alt="Album Cover"
                      className="object-cover rounded-t-lg"
                      src={album.image[3]['#text']}
                      style={{
                        objectFit: 'cover',
                      }}
                      layout="fill"
                    />
                  </AspectRatio>
                  <div className="p-4">
                    <h3 className="font-bold">{album.name}</h3>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-96">
              <p>No albums found</p>
            </div>
          )}
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Popular Songs</h2>
          <div className="space-y-4">
            {wiki.popularSongs ? (
              wiki.popularSongs.slice(0, 5).map(song => (
                <Card
                  key={song.name}
                  className="flex items-center justify-between p-4 rounded-lg shadow"
                >
                  <h3 className="font-bold">{song.name}</h3>
                  {song.youtubeUrl ? (
                    <PlaySong url={song.youtubeUrl} />
                  ) : (
                    <Button size="icon" variant="ghost">
                      <RxCross1 className="h-6 w-6 text-destructive" />
                    </Button>
                  )}
                </Card>
              ))
            ) : (
              <div className="flex justify-center items-center h-96">
                <p>No popular songs found</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Related Artists</h2>
          {wiki.relatedArtists ? (
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
              {wiki.relatedArtists.slice(0, 4).map(artist => (
                <Link key={artist.name} href={`/wiki/${artist.name}`}>
                  <Card className="rounded-lg shadow group">
                    <AspectRatio ratio={1}>
                      <Image
                        alt="Artist Image"
                        className="object-cover rounded-t-lg"
                        src={'/images/artist-placeholder.jpg'}
                        style={{
                          objectFit: 'cover',
                        }}
                        layout="fill"
                      />
                    </AspectRatio>
                    <div className="p-4">
                      <h3 className="font-bold group-hover:underline">{artist.name}</h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-96">
              <p>No related artists found</p>
            </div>
          )}
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Tags</h2>
          <div className="grid grid-cols-2 min-[480px]:grid-cols-3 lg:grid-cols-6 gap-4">
            {wiki.tags ? (
              wiki.tags.map((tag: string) => (
                <Link key={tag} href={`/wiki?tag=${tag}`} className="w-full">
                  <Button key={tag} className="px-2 py-1 text-sm font-bold w-full">
                    {tag}
                  </Button>
                </Link>
              ))
            ) : (
              <p>No tags found</p>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-10">
          <Button size="lg">View Upcoming Tours</Button>
          <div className="flex space-x-4 p-2">
            <Button size="icon" variant="ghost">
              <FaSpotify size={24} />
            </Button>
            <Button size="icon" variant="ghost">
              <LuTwitter size={24} />
            </Button>
            <Button size="icon" variant="ghost">
              <LuInstagram size={24} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
