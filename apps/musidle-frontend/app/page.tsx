import Link from 'next/link';
import { CardHeader, CardContent, Card } from '../components/ui/card';
import Image from 'next/image';
import { EmptyPlaceholder } from '../components/ui/empty-placeholder';
import { AspectRatio } from '../components/ui/aspect-ratio';
import { Button } from '../components/ui/button';
import { getCurrentUrl } from '../utils/GetCurrentUrl';
import { IWiki } from '../@types/Wiki';

async function getWikis() {
  try {
    const wiki: IWiki[] = await fetch(getCurrentUrl() + `/externalApi/wikis/`, {
      cache: 'no-cache',
    }).then(res => res.json());
    return wiki;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function Page() {
  const wikis = await getWikis();
  return (
    <div>
      <section className="flex justify-center items-center w-full h-full min-h-screen">
        <div className="container space-y-10 xl:space-y-16">
          <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Welcome to Musidle
              </h1>
              <p className="mt-4 text-lg">Your one-stop destination for all things music.</p>
            </div>
            <Image
              src="https://musidle.live/externalApi/images/concert.jpg"
              alt="Concert photo by Drew Beamer"
              fill
              className="rounded-md object-cover opacity-10 bg-inherit"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold">Featured Article</h2>
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] mt-6">
            <AspectRatio ratio={16 / 9}>
              <Image
                src="https://musidle.live/externalApi/images/indie-music.jpg"
                alt="Indie music"
                layout="fill"
                className="object-cover rounded-md"
              />
            </AspectRatio>
            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-2xl font-bold">The Rise of Indie Music</h3>
              <p className="max-w-[600px] md:text-xl">
                Discover the rise of indie music in the modern music scene. Explore its roots, its
                growing popularity, and its future.
              </p>
              <Link className="inline-flex w-full" href="/articles/65be98854c2ef87123c1f37e">
                <Button className="w-full">Read More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold">Popular Band & Artists Wikis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {wikis?.slice(0, 3).map(wiki => (
              <Card key={wiki._id}>
                <CardHeader>
                  <Link href={`/wiki/${wiki._id}`}>
                    <AspectRatio ratio={4 / 3}>
                      <Image
                        src={wiki.coverImage?.url || '/images/placeholder.svg'}
                        alt={wiki.name}
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
          <div className="flex justify-end mt-6">
            <Link href="/wiki" className="lg:w-[10%] md:w-[20%] w-[30%]">
              <Button className="w-full">View more</Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold">Tutorials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card className="flex flex-col">
              <CardHeader>
                <EmptyPlaceholder>
                  <h2 className="mt-6 text-xl font-semibold" />
                  <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
                    Tutorial image or something not sure yet
                  </p>
                </EmptyPlaceholder>
              </CardHeader>
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">Guitar Basics</h3>
                <p className="mt-2">
                  Learn the basics of playing the guitar in this comprehensive guide.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <EmptyPlaceholder>
                  <h2 className="mt-6 text-xl font-semibold" />
                  <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
                    Tutorial image or something not sure yet
                  </p>
                </EmptyPlaceholder>
              </CardHeader>
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">Music Theory 101</h3>
                <p className="mt-2">
                  Understand the fundamentals of music theory with this tutorial.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <EmptyPlaceholder>
                  <h2 className="mt-6 text-xl font-semibold" />
                  <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
                    Tutorial image or something not sure yet
                  </p>
                </EmptyPlaceholder>
              </CardHeader>
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">Songwriting for Beginners</h3>
                <p className="mt-2">
                  Get started with songwriting with this beginner-friendly guide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
