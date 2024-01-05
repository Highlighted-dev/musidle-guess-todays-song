import { IUser } from './user';
interface IGuild {
  _id: string;
  name: string;
  members: IUser[];
  leader: IUser;
  level: number;
  description: string;
  createdAt: Date;
}
