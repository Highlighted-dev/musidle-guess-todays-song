'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { IUser } from '@/@types/next-auth';

interface IGuildCreationForm {
  name: string;
  description: string;
  members: IUser[];
  leader: IUser;
}

function GuildCreation() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IGuildCreationForm>();
  const { data, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const onSubmit = async (formData: IGuildCreationForm) => {
    // Send a request to the backend to create the new guild
    // If the request is successful, redirect the user to the new guild page
    if (!data?.user) return;
    formData.members = [data.user];
    formData.leader = data.user;
    await fetch(getCurrentUrl() + '/externalApi/guilds/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(async res => {
        return res.json();
      })
      .then(async responseData => {
        if (responseData._id) {
          await update({
            guild: {
              _id: responseData._id,
              name: responseData.name,
            },
          });

          router.push('/guilds');
          setIsOpen(false);
        }
      });
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
