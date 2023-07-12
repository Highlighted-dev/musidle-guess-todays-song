import { model, Schema } from 'mongoose';

interface IPlayer {
  _id: string;
  name: string;
  score: number;
}

interface IRoomModel {
  room_code: string;
  players: IPlayer[];
  maxRounds: number;
  round: number;
}

const roomSchema = new Schema<IRoomModel>(
  {
    room_code: { type: String, required: true },
    players: { type: [], required: true, unique: true },
    maxRounds: { type: Number, required: true },
    round: { type: Number, required: true },
  },
  { versionKey: false },
);
const roomModel = model<IRoomModel>('Rooms', roomSchema, 'rooms');
export default roomModel;
