import { IWiki } from '@/@types/Wiki';
import Redirecter from '@/components/Redirecter';
import EditButton from '@/components/EditButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WikiNavbar from '@/components/wiki/WikiNavbar';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import React from 'react';
import { RxCross1 } from 'react-icons/rx';
import PlaySong from '@/components/wiki/PlayEmbed';
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
      title: 'Musidle Wiki - Songs',
    };
  }
  return {
    title: wiki.name + ' - Songs',
    openGraph: {
      title: wiki.name + ' - Songs',
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
      next: {
        revalidate: 60,
      },
    }).then(res => res.json());
    return wiki;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function PopularSongsPage({ params }: { params: { wikiId: string } }) {
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

  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <div className="flex items-center justify-start h-20 py-10 px-4 md:px-6 lg:px-8 ">
        <h1 className="text-3xl font-bold">
          {wiki.name + `'s Songs` || 'This wiki does not exist yet'}
        </h1>
        {session?.user.role == 'admin' ? (
          <EditButton url={`/admin/editor/wiki/${wiki._id}`} size={25} />
        ) : null}
      </div>
      <WikiNavbar id={wiki._id} />
      <div className="space-y-4 py-10 px-4 md:px-6 lg:px-8">
        {wiki.popularSongs ? (
          wiki.popularSongs.map(song => (
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
  );
}
