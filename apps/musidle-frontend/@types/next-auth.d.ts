import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
      emailVerified: Date | null;
      createdAt: Date;
      guild: {
        _id: string | null;
        name: string | null;
      };
    };
  }
  interface User extends IUser {}
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
  guild: {
    _id: string | null;
    name: string | null;
  };
}
