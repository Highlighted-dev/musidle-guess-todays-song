import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { IWiki } from '@/@types/Wiki';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import EnchancedPagination from '@/components/EnchancedPagination';

export const dynamic = 'force-dynamic';
const getWikis = async (searchParams: { search: string; tag: string }) => {
  try {
    if (searchParams.search) {
      const wiki: IWiki[] = await fetch(
        getCurrentUrl() + `/externalApi/wikis/name/${searchParams.search}`,
        {
          cache: 'no-cache',
        },
      ).then(res => res.json());
      return wiki;
    } else if (searchParams.tag) {
      const wiki: IWiki[] = await fetch(
        getCurrentUrl() + `/externalApi/wikis/tag/${searchParams.tag}`,
        {
          cache: 'no-cache',
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
};

export default async function Wiki({
  searchParams,
}: {
  searchParams: { page: string; search: string; tag: string };
}) {
  let wikis = await getWikis(searchParams);
  if (!searchParams.page) searchParams.page = '1';
  wikis =
    wikis?.slice(8 * (parseInt(searchParams.page) - 1), 8 * parseInt(searchParams.page)) || null;

  return (
    <>
      <h1 className="text-3xl font-bold">Featured Artists</h1>
      <div className="grid gap-4 p-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid-rows-2 min-h-screen">
        {wikis?.map(wiki => (
          <Card key={wiki._id}>
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
                , {wiki.coverImage?.copyright.serviceName || 'Commons'}
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
      <EnchancedPagination
        pageNumber={searchParams.page ? parseInt(searchParams.page) : 1}
        url={
          searchParams.search
            ? `/wiki?search=${searchParams.search}&page=`
            : searchParams.tag
            ? `/wiki?tag=${searchParams.tag}&page=`
            : `/wiki?page=`
        }
      />
    </>
  );
}
