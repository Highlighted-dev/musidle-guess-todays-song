import { IBugReport } from '@/@types/Help';
import { auth } from '@/auth';
import Redirecter from '@/components/Redirecter';
import BugRequestStatusSelection from '@/components/help/BugRequestStatusSelection';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import Link from 'next/link';
import React from 'react';

const getBugReport = async (requestId: string) => {
  const response = await fetch(getCurrentUrl() + `/externalApi/help/${requestId}`, {
    cache: 'no-cache',
  });
  if (response.status !== 200) {
    return null;
  }
  const report = await response.json();
  return report as IBugReport;
};

export default async function BugReportDescriptionPage({
  params,
}: {
  params: { requestId: string };
}) {
  const { requestId } = params;
  const session = await auth();
  const report = await getBugReport(requestId);
  if (!report) {
    return <Redirecter url="/help" message="Request not found" variant={'destructive'} />;
  }
  if (session?.user?.role !== 'admin' && session?.user?.id !== report.userId) {
    return (
      <Redirecter
        url="/help"
        message="You are not authorized to view this page"
        variant={'destructive'}
      />
    );
  }
  return (
    <div className="container flex flex-col justify-center items-center pt-6">
      <Card className="w-full flex flex-col justify-center items-center">
        <CardHeader>
          <CardTitle>Request {report._id}</CardTitle>
          <CardDescription className="text-center">by {report.userId}</CardDescription>
        </CardHeader>
        <CardContent className="sm:min-h-[500px] min-h-[300px] prose prose-invert">
          {report.description}
        </CardContent>
        <CardFooter className="flex justify-between w-full">
          <Link href="/help">
            <Button>Back</Button>
          </Link>
          <BugRequestStatusSelection session={session} request={report} />
        </CardFooter>
      </Card>
    </div>
  );
}
