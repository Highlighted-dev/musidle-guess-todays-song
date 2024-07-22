import { auth } from '@/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import React from 'react';
import dotenv from 'dotenv';
import Redirecter from '@/components/Redirecter';
import { IBugReport } from '@/@types/Help';
import BugReport from '@/components/user/BugReport';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
dotenv.config();

const getBugReports = async (role: string, userId: string) => {
  let response;
  if (role === 'admin') {
    response = await fetch(getCurrentUrl() + `/externalApi/help`, {
      cache: 'no-cache',
    }).then(res => res.json());
  } else {
    response = await fetch(getCurrentUrl() + `/externalApi/help/user/${userId}`, {
      cache: 'no-cache',
    }).then(res => res.json());
  }
  return response;
};

const formatDate = (date: Date) => {
  // give only the date and hour
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export default async function HelpPage() {
  const session = await auth();
  if (!session) {
    return (
      <Redirecter
        url="/"
        message="You need to be logged in to access this page"
        variant={'destructive'}
      />
    );
  }
  const bugReports =
    ((await getBugReports(session.user.role, session.user.id)) as IBugReport[]) || null;
  return (
    <div className="container flex flex-col justify-center items-center pt-6">
      <Card className="w-full">
        <CardHeader className="flex justify-center items-center">
          <CardTitle className="text-center">Help</CardTitle>
          <CardDescription>See if your bug reports got resolved</CardDescription>
        </CardHeader>
        <CardContent className="sm:min-h-[500px] min-h-[300px]">
          <Table className="relative">
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bugReports && bugReports.length === 0 && session.user.role !== 'admin' && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    You have no help requests. Submit a bug report to get started.
                  </TableCell>
                </TableRow>
              )}
              {bugReports.map((request: IBugReport) => (
                <TableRow key={request._id}>
                  <TableCell>{request._id}</TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell>{formatDate(request.updatedAt)}</TableCell>
                  <TableCell
                    className={
                      request.status === 'Resolved'
                        ? 'text-green-500'
                        : request.status === 'Pending'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }
                  >
                    {session.user.role === 'admin' ? (
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={request.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      request.status
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="relative flex items-center justify-center sm:flex-row flex-col">
          <CardDescription className="text-center">
            A list of your recent bug reports and their status.
          </CardDescription>
          <div className="sm:absolute sm:mt-0 mt-2 right-2">
            <BugReport session={session} menuItem={false} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
