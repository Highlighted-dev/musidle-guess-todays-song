import React from 'react';
import { IGuild } from 'apps/musidle-frontend/@types/Guild';
import { getCurrentUrl } from 'apps/musidle-frontend/utils/GetCurrentUrl';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'apps/musidle-frontend/components/ui/card';
import Link from 'next/link';
import JoinGuildButton from 'apps/musidle-frontend/components/buttons/JoinGuildButton';
import GuildPagination from 'apps/musidle-frontend/components/EnchancedPagination';

const fetchGuilds = async () => {
  try {
    const response = await fetch(getCurrentUrl() + '/externalApi/guilds', {
      next: {
        revalidate: 60,
      },
    }).then(res => res.json());
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default async function Guilds({ searchParams }: { searchParams: { page: string } }) {
  const guilds: IGuild[] | null = await fetchGuilds();
  const pageNumber = searchParams.page ? parseInt(searchParams.page) : 1;
  const guildsToDisplay = guilds
    ? pageNumber
      ? guilds.slice(4 * (pageNumber - 1), 4 * pageNumber)
      : guilds.slice(0, 4)
    : [];
  return (
    <div className="container">
      <Card className="h-full w-full p-2 flex flex-col">
        <CardHeader className="text-center">
          <CardTitle>Guilds</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto space-y-3 lg:min-h-[500px]">
          {guildsToDisplay.length > 0 ? (
            guildsToDisplay.map(guild => (
              <Card
                key={guild._id}
                className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-center p-6"
              >
                <Link href={`/guilds/${guild.name}`}>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-200">Guild Name</h3>
                    <p className="text-gray-400">{guild.name}</p>
                  </div>
                </Link>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-200">Guild Leader</h3>
                  <p className="text-gray-400">{guild.leader.username}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-200">Guild Level</h3>
                  <p className="text-gray-400">{guild.level}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-200">Members</h3>
                  <p className="text-gray-400">{guild.members.length}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-200">Creation Date</h3>
                  <p className="text-gray-400">
                    {new Date(guild.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="mt-2">
                  <JoinGuildButton name={guild.name} />
                </div>
              </Card>
            ))
          ) : (
            <div className="flex justify-center items-center h-full w-full">
              <p className="text-gray-400">No guilds found</p>
            </div>
          )}
        </CardContent>
        {guilds && guilds.length > 4 && (
          <CardFooter>
            <GuildPagination pageNumber={pageNumber ? pageNumber : 1} url={'/guilds?page='} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
