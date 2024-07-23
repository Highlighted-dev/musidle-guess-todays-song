'use client';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { IBugReport } from '@/@types/Help';
import { changeStatusAction } from './changeStatusAction';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { Label } from '../ui/label';

export default function BugRequestStatusSelection({
  session,
  request,
}: {
  session: Session | null;
  request: IBugReport;
}) {
  if (session?.user?.role !== 'admin')
    return (
      <Label
        className={
          request.status === 'Resolved'
            ? 'text-green-500'
            : request.status === 'Pending'
            ? 'text-yellow-500'
            : 'text-red-500'
        }
      >
        {request.status}
      </Label>
    );
  const handleStatusChange = async (status: string) => {
    const response = await changeStatusAction(status, request._id);
    if (response.status === 'Error') {
      toast({
        title: 'Error',
        description: response.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: response.message,
      });
    }
  };
  return (
    <Select onValueChange={e => handleStatusChange(e)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={request.status} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Resolved" className="text-green-500">
          Resolved
        </SelectItem>
        <SelectItem value="Pending" className="text-yellow-500">
          Pending
        </SelectItem>
        <SelectItem value="Rejected" className="text-red-500">
          Rejected
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
