import { IGuild } from '@/@types/Guild';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import React from 'react';

async function fetchGuild(name: string) {
  const response = await fetch(getCurrentUrl() + `/externalApi/guilds/${name}`, {
    cache: 'no-store',
  }).then(res => res.json());
  return response;
}

export default async function GuildOverview({ params }: { params: { name: string } }) {
  const guild: IGuild = await fetchGuild(params.name);

  return (
    <div className=" flex-row  overflow-y-auto p-6 h-full w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Guild Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-200">Guild Name</h3>
            <p>{guild.name}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-200">Guild Leader</h3>
            <p>{guild.leader.username}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-200">Guild Level</h3>
            <p>{guild.level}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-200">Members</h3>
            <p>{guild.members.length}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-200">Guild Creation Date</h3>
            <p>
              {new Date(guild.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-200">Guild Description</h3>
            <p>{guild.description}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-center">Guild Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guild.members.map(member => (
                <TableRow key={member._id}>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{member.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
