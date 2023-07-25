import { AxiosError } from 'axios';

export type IAxiosErrorRestApi = AxiosError & {
  response: {
    data: {
      error: string;
      status: string;
      message: string;
    };
  };
};

export type AuthContextType = {
  register: (username: string, email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
  loadData: () => Promise;
};
