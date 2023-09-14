import { model, Schema } from 'mongoose';
import { IUser } from '../@types/user';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  { versionKey: false },
);
const userModel = model<IUser>('Users', userSchema, 'userData');
export default userModel;
