import { model, Schema } from 'mongoose';
import { IRoomModel } from '../@types/room';

const roomSchema = new Schema<IRoomModel>(
  {
    room_code: { type: String, required: true },
    players: { type: [], required: true, unique: true },
    current_player: { type: Object, default: null },
    spectators: { type: [], required: true },
    song_id: { type: String, default: null },
    maxRoundsPhaseOne: { type: Number, default: 4 },
    maxRoundsPhaseTwo: { type: Number, default: 2 },
    round: { type: Number, required: true },
    isInGameLobby: { type: Boolean, required: true },
    isInSelectMode: { type: Boolean, required: true },
    timer: { type: Number, default: 35 },
    maxTimer: { type: Number, default: 35 },
    votesForTurnSkip: { type: Number, default: 0, required: true },
    songs: [
      {
        song_id: { type: String, required: true },
        category: { type: String, required: true },
        completed: { type: Boolean, default: false },
        artist: { type: String },
      },
    ],
  },
  { versionKey: false },
);
const roomModel = model<IRoomModel>('Rooms', roomSchema, 'rooms');
export default roomModel;
