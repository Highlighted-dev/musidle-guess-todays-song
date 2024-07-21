import { IUser } from '@/@types/next-auth';
import { auth } from '@/auth';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileCard from '@/components/user/ProfileCard';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import React from 'react';

async function getUser(userId: string) {
  try {
    const response = await fetch(getCurrentUrl() + `/externalApi/user/${userId}`, {
      cache: 'no-cache',
    });
    if (response.status !== 200) {
      return null;
    }
    let result = await response.json();
    result.id = result._id;
    return (result as IUser) || null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const session = await auth();
  const user = await getUser(params.userId);
  return (
    <div className="container flex justify-center align-center py-12 ">
      <Card className="w-full flex flex-col sm:min-h-[620px]">
        <CardHeader className="text-center">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Everything about you</CardDescription>
        </CardHeader>
        <ProfileCard session={session} user={user} />
      </Card>
    </div>
  );
}
