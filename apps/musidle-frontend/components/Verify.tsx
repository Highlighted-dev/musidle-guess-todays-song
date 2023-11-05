'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { use, useEffect, useState } from 'react';
import { toast } from './ui/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';

export default function Verify({ response }: { response: any }) {
  const { update } = useSession();
  const session = useSession();
  const [loading, setLoading] = useState(true);

  const updateSession = async () => {
    await update({ activated: true });
    setLoading(false);
  };

  useEffect(() => {
    if (response.status === 'success') {
      updateSession();
    }
  }, [response]);

  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    setTimeout(() => {
      router.push('/');
    }, 5000);
  }, [response, loading]);

  return (
    <>
      <CardHeader className=" text-center">
        <CardTitle>
          {loading && response.status === 'success'
            ? 'loading...'
            : response.status === 'success' && session.data?.user?.activated
            ? 'Your account has been activated'
            : 'Couldnt activate your account'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center align-center">
          <Label>{loading ? 'Please wait...' : 'Redirecting to home page in 5 seconds'} </Label>
        </div>
      </CardContent>
    </>
  );
}
