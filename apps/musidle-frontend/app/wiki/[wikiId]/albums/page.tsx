import { IWiki } from '@/@types/Wiki';
import { Card } from '@/components/ui/card';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import Image from 'next/image';
import React from 'react';
import Redirecter from '@/components/Redirecter';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import EditButton from '@/components/buttons/EditButton';
import WikiNavbar from '@/components/wiki/WikiNavbar';
import { auth } from '@/auth';

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

export default async function Albums({ params }: { params: { wikiId: string } }) {
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
          {wiki.name + `'s Albums` || 'This wiki does not exist yet'}
        </h1>
        {session?.user.role == 'admin' ? (
          <EditButton url={`/admin/editor/wiki/${wiki._id}`} size={25} />
        ) : null}
      </div>
      <WikiNavbar id={wiki._id} />
      <div className="flex-1 py-10 px-4 md:px-6 lg:px-8">
        {wiki.notableAlbums ? (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
            {wiki.notableAlbums.map(album => (
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
          <p>No albums found</p>
        )}
      </div>
    </div>
  );
}
