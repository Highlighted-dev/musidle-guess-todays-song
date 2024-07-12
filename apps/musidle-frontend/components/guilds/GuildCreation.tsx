'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { getCurrentUrl } from '../../utils/GetCurrentUrl';
import { useState } from 'react';
import { IUser } from '../../@types/next-auth';
import { Session } from 'next-auth';
import { createGuildAction } from './CreateGuildAction';
import { toast } from '../ui/use-toast';

export interface IGuildCreationForm {
  name: string;
  description: string;
  user: IUser;
}

function GuildCreation({ session }: { session: Session | null }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IGuildCreationForm>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (formData: IGuildCreationForm) => {
    setLoading(true);
    let result;
    try {
      result = await createGuildAction(formData, session);
    } catch (error) {
      console.error('Failed to create guild', error);
    } finally {
      setLoading(false);
      toast({
        title: result?.status,
        description: result?.message,
      });
      setIsOpen(false);
      router.push(`/guilds/${formData.name}`);
      router.refresh();
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogTrigger className="w-full" asChild>
        <DropdownMenuItem
          onSelect={e => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          Create Guild
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-center">Create Guild</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid w-full grid-cols-2 p-2 gap-2">
          <div>
            <Input {...register('name', { required: true })} placeholder="Guild Name" />
            {errors.name && <span>This field is required</span>}
          </div>
          <Input
            {...register('description', { required: true })}
            type="name"
            placeholder="Description"
          />
          {errors.description && <span>This field is required</span>}

          <Button type="submit" className="col-span-2">
            Create Guild
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GuildCreation;
