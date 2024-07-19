'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { saveUserSettingsAction } from './saveUserSettingsAction';
import { Session } from 'next-auth';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

export default function UserSettings({ session }: { session: Session | null }) {
  const [loading, setLoading] = React.useState(false);
  const [volume, setVolume] = React.useState([0.25]);
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await saveUserSettingsAction(volume[0], session).then(res => {
      router.refresh();
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
        <DropdownMenuItem onSelect={e => e.preventDefault()}>Settings</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle> Settings </DialogTitle>
            <DialogDescription> Change your preferences here</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>Volume</Label>
            <Slider
              defaultValue={[session?.user?.settings?.volume ?? 0.25]}
              max={1}
              step={0.01}
              onValueChange={volume => setVolume(volume)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
