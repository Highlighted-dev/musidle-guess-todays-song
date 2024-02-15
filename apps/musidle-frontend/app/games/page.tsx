import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function Page() {
  return (
    <Card className="w-full flex flex-col justify-center align-center relative">
      <CardHeader className="text-center ">
        <CardTitle>Welcome to Musidle</CardTitle>
        <CardDescription>Guess today&apos;s music and challenge your knowledge!</CardDescription>
      </CardHeader>
      <CardContent className="grid xl:grid-cols-2 grid-cols-1 gap-2">
        <Card className="flex flex-col justify-center items-center min-h-[500px]">
          <CardTitle className="text-sm text-center">
            Challange your music knowledge with new songs every day
          </CardTitle>
          <CardContent className="flex flex-col justify-center items-center">
            <Link href={'/games/daily'}>
              <Button className="w-[250px] m-4" variant={'outline'}>
                Musidle Daily
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center items-center min-h-[500px]">
          <CardTitle className="text-sm text-center">
            Play with your friends to see who is the real music guru
          </CardTitle>
          <CardContent className="flex flex-col justify-center items-center">
            <Link href={'/games/multiplayer'}>
              <Button className="w-[250px] m-4" variant={'outline'}>
                Musidle Multiplayer
              </Button>
            </Link>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
