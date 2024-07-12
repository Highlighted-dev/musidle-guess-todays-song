import { signOut } from '@/auth';
import { Button } from '../ui/button';

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
      className="flex justify-center items-center w-full"
    >
      <Button type={`submit`}>Sign Out</Button>
    </form>
  );
}
