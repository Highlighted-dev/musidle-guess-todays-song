import { model, Schema } from 'mongoose';

interface IPlayer {
  _id: string;
  name: string;
  score: number;
}

interface IRoomModel {
  room_code: string;
  players: IPlayer[];
  maxRoundsPhaseOne: number;
  maxRoundsPhaseTwo: number;
  round: number;
  inSelectMode: boolean;
}

const roomSchema = new Schema<IRoomModel>(
  {
    room_code: { type: String, required: true },
    players: { type: [], required: true, unique: true },
    maxRoundsPhaseOne: { type: Number, default: 4 },
    maxRoundsPhaseTwo: { type: Number, default: 2 },
    round: { type: Number, required: true },
    inSelectMode: { type: Boolean, required: true },
  },
  { versionKey: false },
);
const roomModel = model<IRoomModel>('Rooms', roomSchema, 'rooms');
export default roomModel;
