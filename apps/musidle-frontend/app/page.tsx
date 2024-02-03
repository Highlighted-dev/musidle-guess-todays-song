import Link from 'next/link';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import Image from 'next/image';
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default async function Page() {
  return (
    <div>
      <section className="flex justify-center items-center w-full h-full pt-24 min-h-screen">
        <div className="container space-y-10 xl:space-y-16">
          <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tighter sm:text-5xl md:text-6xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Welcome to Musidle
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                Your one-stop destination for all things music.
              </p>
            </div>
            <Image
              src="/images/concert.jpg"
              alt="Photo by Drew Beamer"
              fill
              className="rounded-md object-cover opacity-10 bg-inherit"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-white">Featured Article</h2>
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] mt-6">
            <AspectRatio ratio={16 / 9}>
              <Image
                src="/images/indie-music.jpg"
                alt="Indie music"
                layout="fill"
                className="object-cover rounded-md"
              />
            </AspectRatio>
            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-2xl font-bold text-white">The Rise of Indie Music</h3>
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                Discover the rise of indie music in the modern music scene. Explore its roots, its
                growing popularity, and its future.
              </p>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-300 px-8 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-gray-300/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 disabled:pointer-events-none disabled:opacity-50"
                href="/articles/65be98854c2ef87123c1f37e"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-white">Popular Band & Artists Wikis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src="/images/bring-me-the-horizon.jpg"
                    alt="Bring me the Horizon"
                    layout="fill"
                    className="object-cover rounded-md"
                  />
                </AspectRatio>
                <p className="mb-8 mt-2 text-center text-xs font-normal leading-6 text-muted-foreground">
                  By&nbsp;
                  <Link href="commons.wikimedia.org/w/index.php?title=User:MCK-photography&amp;action=edit&amp;redlink=1">
                    MCK-photography |
                  </Link>
                  <Link href="https://commons.wikimedia.org/w/index.php?curid=12738485">
                    &nbsp;Wikimedia Commons
                  </Link>
                </p>
              </CardHeader>
              <CardContent>
                <h3 className="mt-4 text-xl font-bold text-white">Bring me the horizon</h3>
                <p className="mt-2 text-gray-300">
                  Bring Me The Horizon, a boundary-pushing rock band, seamlessly blends elements of
                  metalcore, electronica, and pop to create a dynamic and genre-defying sound.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src="/images/taylor-swift.png"
                    alt="Taylor swift"
                    layout="fill"
                    className="object-cover rounded-md"
                  />
                </AspectRatio>
                <p className="mb-8 mt-2 text-center text-xs font-normal leading-6 text-muted-foreground">
                  By iHeartRadioCA |
                  <Link href="https://commons.wikimedia.org/w/index.php?curid=137551448">
                    &nbsp;Wikimedia Commons
                  </Link>
                </p>
              </CardHeader>
              <CardContent>
                <h3 className="mt-4 text-xl font-bold text-white">Taylor Swift</h3>
                <p className="mt-2 text-gray-300">
                  Multi-talented singer-songwriter, captivates audiences with her heartfelt lyrics
                  and infectious melodies.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src="/images/juice-wrld.jpg"
                    alt="Juice WRLD"
                    layout="fill"
                    className="object-cover rounded-md"
                  />
                </AspectRatio>
                <p className="mb-8 mt-2 text-center text-xs font-normal leading-6 text-muted-foreground">
                  By <Link href='"https://www.flickr.com/photos/lexwescudi/'>Lexiou WesCudi</Link>
                  &nbsp;|
                  <Link href="https://commons.wikimedia.org/w/index.php?curid=112727082">
                    &nbsp;Wikimedia Commons
                  </Link>
                </p>
              </CardHeader>
              <CardContent>
                <h3 className="mt-4 text-xl font-bold text-white">Juice WRLD</h3>
                <p className="mt-2 text-gray-300">
                  Influential rapper and lyricist, showcased raw emotion and introspective
                  storytelling through his music, leaving a lasting impact on the hip-hop industry.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-white">Tutorials</h2>
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
                <h3 className="mt-4 text-xl font-bold text-white">Guitar Basics</h3>
                <p className="mt-2 text-gray-300">
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
                <h3 className="mt-4 text-xl font-bold text-white">Music Theory 101</h3>
                <p className="mt-2 text-gray-300">
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
                <h3 className="mt-4 text-xl font-bold text-white">Songwriting for Beginners</h3>
                <p className="mt-2 text-gray-300">
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
