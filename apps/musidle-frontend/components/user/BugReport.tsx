'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { FieldValues, useForm } from 'react-hook-form';
import { Session } from 'next-auth';
import { bugReportAction } from './bugReportAction';
import { toast } from '../ui/use-toast';

export interface IReportProblemForm {
  description: string;
}
export default function BugReport({
  session,
  menuItem = false,
}: {
  session: Session | null;
  menuItem?: boolean;
}) {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (formData: FieldValues) => {
    setLoading(true);
    const description = formData.description;
    await bugReportAction(description, session).then(res => {
      reset();
      toast({
        title: res.status,
        description: res.message,
      });
      setLoading(false);
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        {menuItem ? (
          <DropdownMenuItem onSelect={e => e.preventDefault()}>Report a bug</DropdownMenuItem>
        ) : (
          <Button>Report a bug</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Report a bug</DialogTitle>
            <DialogDescription>Found any bugs? Let us know so we can fix them!</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Describe the problem you're facing"
              {...register('description')}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
