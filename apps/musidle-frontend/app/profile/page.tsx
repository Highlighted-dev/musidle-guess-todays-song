import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'apps/musidle-frontend/components/ui/card';
import { getServerSession } from 'next-auth/next';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import ProfileCard from 'apps/musidle-frontend/components/user/ProfileCard';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container flex justify-center align-center py-12 ">
      <Card className="w-full flex flex-col min-h-[620px]">
        <CardHeader className="text-center">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Everything about you</CardDescription>
        </CardHeader>
        <ProfileCard session={session} />
      </Card>
    </div>
  );
}
