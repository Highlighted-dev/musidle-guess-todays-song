import { model, Schema } from 'mongoose';

interface IPlayer {
  _id: string;
  name: string;
  score: number;
}

interface IRoomModel {
  room_code: string;
  players: IPlayer[];
  current_player: IPlayer | null;
  song_id: string;
  maxRoundsPhaseOne: number;
  maxRoundsPhaseTwo: number;
  round: number;
  isInGameLobby: boolean;
  isInSelectMode: boolean;
  timer: number;
}

const roomSchema = new Schema<IRoomModel>(
  {
    room_code: { type: String, required: true },
    players: { type: [], required: true, unique: true },
    current_player: { type: Object, default: null },
    song_id: { type: String, default: null },
    maxRoundsPhaseOne: { type: Number, default: 4 },
    maxRoundsPhaseTwo: { type: Number, default: 2 },
    round: { type: Number, required: true },
    isInGameLobby: { type: Boolean, required: true },
    isInSelectMode: { type: Boolean, required: true },
    timer: { type: Number, default: 35 },
  },
  { versionKey: false },
);
const roomModel = model<IRoomModel>('Rooms', roomSchema, 'rooms');
export default roomModel;
