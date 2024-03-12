import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import clientPromise from 'apps/musidle-frontend/lib/mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      //@ts-ignore
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password)
            throw new Error('Please fill all fields');
          const uri =
            process.env.NODE_ENV == 'production'
              ? process.env.MONGODB_URL_PROD
              : process.env.MONGODB_URL;
          if (!uri) {
            throw new Error('MONGODB_URI is not defined');
          }

          const client = await clientPromise;
          const userCollection = client
            .db(process.env.NODE_ENV == 'development' ? 'musidle' : 'musidle-prod')
            .collection('userData');
          const user = await userCollection.findOne({ email: credentials?.email });

          if (!user) throw new Error('User not found');
          const isPasswordValid = await bcrypt.compare(credentials?.password, user.password);
          if (!isPasswordValid) throw new Error('Password is not valid');

          return {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            activated: user.activated,
            guild: user.guild,
          };
        } catch (e: unknown) {
          if (e instanceof Error) throw new Error(e.message);
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },

  secret: process.env.JWT_SECRET!,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, trigger, user, session }) {
      if (trigger === 'update' && session?.activated) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.activated = session.activated;
      } else if (trigger === 'update' && session?.guild) {
        token.guild = session.guild;
      }
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
        token.activated = user.activated;
        token.guild = user.guild;
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id as string;
      session.user.username = token.username as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.activated = token.activated as boolean;
      session.user.guild = token.guild as { _id: string; name: string };
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
