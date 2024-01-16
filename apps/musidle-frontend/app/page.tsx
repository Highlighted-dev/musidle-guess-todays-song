import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function Page() {
  return (
    <div className="xl:h-4/5 h-full w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center relative xl:min-h-0 min-h-screen">
      <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full xl:min-h-0 min-h-screen relative">
        <div className="h-full xl:min-h-0 min-h-screen ">
          <CardHeader className="text-center h-1/6">
            <CardTitle>Welcome to Musidle</CardTitle>
            <CardDescription>
              Guess today&apos;s music and challenge your knowledge!
            </CardDescription>
          </CardHeader>
          <CardContent className="grid xl:grid-cols-2 grid-cols-1 gap-2 h-5/6">
            <Card className="flex flex-col justify-center items-center h-full">
              <CardTitle className="text-sm text-center">
                Challange your music knowledge with new songs every day
              </CardTitle>
              <CardContent className="flex flex-col justify-center items-center">
                <Link href={'/daily'}>
                  <Button className="w-[250px] m-4" variant={'outline'}>
                    Musidle Daily
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="flex flex-col justify-center items-center h-full ">
              <CardTitle className="text-sm text-center">
                Play with your friends to see who is the real music guru
              </CardTitle>
              <CardContent className="flex flex-col justify-center items-center">
                <Link href={'/multiplayer'}>
                  <Button className="w-[250px] m-4" variant={'outline'}>
                    Musidle Multiplayer
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
