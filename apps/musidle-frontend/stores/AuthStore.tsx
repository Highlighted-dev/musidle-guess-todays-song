import { create } from 'zustand';

interface IAuthStore {
  user_id: string | null;
  setUserId: (user_id: string | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
}

export const useAuthStore = create<IAuthStore>(set => ({
  user_id: '',
  setUserId: (user_id: string | null) =>
    set(() => ({
      user_id: user_id,
    })),
  username: '',
  setUsername: (username: string | null) =>
    set(() => ({
      username: username,
    })),
  email: '',
  setEmail: (email: string | null) =>
    set(() => ({
      email: email,
    })),
  role: '',
  setRole: (role: string | null) =>
    set(() => ({
      role: role,
    })),
}));
