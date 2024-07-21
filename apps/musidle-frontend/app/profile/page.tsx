import { auth } from '@/auth';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileCard from '@/components/user/ProfileCard';
import React from 'react';

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="container flex justify-center align-center py-12 ">
      <Card className="w-full flex flex-col sm:min-h-[620px]">
        <CardHeader className="text-center">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Everything about you</CardDescription>
        </CardHeader>
        <ProfileCard session={session} />
      </Card>
    </div>
  );
}
