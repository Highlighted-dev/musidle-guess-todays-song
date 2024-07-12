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
      <CardContent className="grid lg:grid-cols-2 grid-cols-1 gap-2">
        <Card className="flex flex-col justify-center items-center lg:min-h-[500px] min-h-[250px]">
          <CardTitle className="text-sm text-center">
            Challange your music knowledge with new songs every day
          </CardTitle>
          <div className="flex flex-col justify-center items-center">
            <Link href={'/games/daily'}>
              <Button className="sm:w-[250px] w-[170px] m-4">Musidle Daily</Button>
            </Link>
          </div>
        </Card>
        <Card className="flex flex-col justify-center items-center lg:min-h-[500px] min-h-[250px]">
          <CardTitle className="text-sm text-center">
            Play with your friends to see who is the real music guru
          </CardTitle>
          <div className="flex flex-col justify-center items-center">
            <Link href={'/games/multiplayer'}>
              <Button className="sm:w-[250px] w-[170px] m-4">Musidle Multiplayer</Button>
            </Link>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
}
