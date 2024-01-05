/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      activated: boolean;
      role: string;
      _id: string;
      username: string;
      email: string;
      guild: {
        _id: string | null;
        name: string | null;
      };
    };
  }
  interface User extends IUser {}
}

export interface IUser {
  activated: boolean;
  role: string;
  _id: string;
  username: string;
  email: string;
  guild: {
    _id: string | null;
    name: string | null;
  };
}
