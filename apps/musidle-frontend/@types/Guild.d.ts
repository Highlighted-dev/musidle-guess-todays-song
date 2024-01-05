import { IUser } from './next-auth';
interface IGuild {
  _id: string;
  name: string;
  members: IUser[];
  leader: IUser;
  level: number;
  description: string;
  createdAt: Date;
}
