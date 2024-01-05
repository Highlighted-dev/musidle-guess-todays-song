export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  token: string;
  activated: boolean;
  guild: {
    _id: string;
    name: string;
  };
}
