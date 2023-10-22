import { Session } from 'next-auth';
import { create } from 'zustand';

//Why does this component exist? Its because we need a way to use the session objects outside the react components.
//We can't use the useSession hook outside the react components. So we use this store to store the session object.

interface INextAuthStore {
  session: Session | null;
}

export const useNextAuthStore = create<INextAuthStore>(set => ({
  session: null,
}));
