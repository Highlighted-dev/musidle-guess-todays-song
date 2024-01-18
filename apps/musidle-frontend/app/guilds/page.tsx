import React from 'react';
import { IGuild } from '@/@types/Guild';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import JoinGuildButton from '@/components/buttons/JoinGuildButton';

const fetchGuilds = async () => {
  try {
    const response = await fetch(getCurrentUrl() + '/externalApi/guilds', {
      cache: 'no-store',
    }).then(res => res.json());
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default async function Guilds() {
  const guilds: IGuild[] | null = await fetchGuilds();
  return (
    <div className="h-full w-[90%] p-2 flex justify-center items-center">
      <Card className="h-full md:w-4/5 w-full">
        <CardHeader className="text-center">
          <CardTitle>Guilds</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          {guilds ? (
            guilds?.map(guild => (
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
      </Card>
    </div>
  );
}
