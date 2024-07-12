import NextAuth, { User } from 'next-auth';
import authConfig from './auth.config';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './lib/mongodb';
import { IUser } from './@types/next-auth';
import { ObjectId } from 'mongodb';

const adapter = MongoDBAdapter(clientPromise);

async function addAdditionalFields(user: User) {
  try {
    const db = (await clientPromise).db();
    const hex = user.id!.replace(/-/g, '');
    const buffer = Buffer.from(hex, 'hex');

    // Convert the buffer to an ObjectId
    const objectId = new ObjectId(buffer.slice(0, 12));

    await db
      .collection('users')
      .updateOne({ _id: objectId }, { $set: { createdAt: new Date(), role: 'user' } });
  } catch (error) {
    console.error('Error adding additional fields:', error);
  }
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  //@ts-ignore
  adapter,
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token, user }) {
      session.user = token.user as IUser;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (!user.createdAt) {
          await addAdditionalFields(user);
        }
        token.user = user;
      }
      if (trigger === 'update' && session) {
        token = { ...token, user: session };
        return token;
      }
      return token;
    },
  },
});
