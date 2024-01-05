import React from 'react';
import { IGuild } from '@/@types/Guild';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const fetchGuilds = async () => {
  const response = await fetch(getCurrentUrl() + '/externalApi/guilds', {
    cache: 'no-store',
  }).then(res => res.json());
  return response;
};

export default async function Guilds() {
  const guilds: IGuild[] | null = await fetchGuilds();
  return (
    <div className="h-full w-full p-2 flex justify-center items-center">
      <Card className="h-full w-3/5">
        <CardHeader className="text-center">
          <CardTitle>Guilds</CardTitle>
        </CardHeader>
        <CardContent>
          {guilds?.map(guild => (
            <Card
              key={guild._id}
              className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-center p-6"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-200">Guild Name</h3>
                <p className="text-gray-400">{guild.name}</p>
              </div>
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
                <Button className="md:block w-full" variant="outline">
                  Join
                </Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
