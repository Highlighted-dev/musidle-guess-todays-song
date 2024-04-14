import { Button } from 'apps/musidle-frontend/components/ui/button';
import React from 'react';
import { IoIosSearch } from '@react-icons/all-files/io/IoIosSearch';
import { Label } from 'apps/musidle-frontend/components/ui/label';
import { Input } from 'apps/musidle-frontend/components/ui/input';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from 'apps/musidle-frontend/components/ui/card';
import { getCurrentUrl } from 'apps/musidle-frontend/utils/GetCurrentUrl';
import { IWiki } from 'apps/musidle-frontend/@types/Wiki';
import { AspectRatio } from 'apps/musidle-frontend/components/ui/aspect-ratio';
import Image from 'next/image';

async function getWikis(searchParams: { search: string; tag: string }) {
  try {
    if (searchParams.search) {
      const wiki: IWiki[] = await fetch(
        getCurrentUrl() + `/externalApi/wikis/name/${searchParams.search}`,
        {
          cache: 'no-store',
        },
      ).then(res => res.json());
      return wiki;
    } else if (searchParams.tag) {
      const wiki: IWiki[] = await fetch(
        getCurrentUrl() + `/externalApi/wikis/tag/${searchParams.tag}`,
        {
          cache: 'no-store',
        },
      ).then(res => res.json());
      return wiki;
    }
    const wiki: IWiki[] = await fetch(getCurrentUrl() + `/externalApi/wikis/`, {
      next: {
        revalidate: 120,
      },
    }).then(res => res.json());
    return wiki;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function Wiki({
  searchParams,
}: {
  searchParams: { search: string; tag: string };
}) {
  const wikis = await getWikis(searchParams);

  return (
    <>
      <h1 className="text-3xl font-bold">Featured Artists</h1>
      <div className="grid gap-4 p-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {wikis?.map(wiki => (
          <Card>
            <CardHeader>
              <Link href={`/wiki/${wiki._id}`}>
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src={wiki.coverImage?.url || '/images/placeholder.svg'}
                    alt="Bring me the Horizon"
                    layout="fill"
                    className="object-cover rounded-md"
                  />
                </AspectRatio>
              </Link>
              <p className="mb-8 mt-2 text-center text-xs font-normal leading-6 text-muted-foreground">
                <Link
                  href={
                    wiki.coverImage?.copyright.creatorUrl ||
                    'https://commons.wikimedia.org/wiki/Main_Page'
                  }
                >
                  {wiki.coverImage?.copyright.creatorName}
                </Link>
                ,{' '}
                <Link
                  href={
                    wiki.coverImage?.copyright.licenseUrl ||
                    'https://creativecommons.org/licenses/by-sa/2.0'
                  }
                >
                  {wiki.coverImage?.copyright.licenseName}
                </Link>
                , Wikimedia Commons
              </p>
            </CardHeader>
            <Link href={`/wiki/${wiki._id}`}>
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">{wiki.name}</h3>
                <p className="mt-2">{wiki.shortDescription}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}
