import { model, Schema } from 'mongoose';
import { IRoom } from '../@types/room';

const roomSchema = new Schema<IRoom>(
  {
    roomCode: { type: String, required: true },
    players: {
      type: [
        new Schema({
          id: { type: String, required: true, unique: true },
          name: { type: String, required: true },
          score: { type: Number, default: 0, required: true },
          completedCategories: {
            type: [
              new Schema({
                category: { type: String, required: true },
                completed: { type: Boolean, default: false, required: true },
              }),
            ],
            required: true,
          },
          votedForTurnSkip: { type: Boolean, default: false, required: true },
        }),
      ],
      required: true,
      unique: true,
    },
    currentPlayer: { type: Object, default: null },
    spectators: { type: [], required: true },
    songId: { type: String, default: null },
    stage: { type: Number, default: 1 },
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
        songId: { type: String, required: true },
        category: { type: String, required: true },
        completed: { type: Boolean, default: false },
        artist: { type: String },
      },
    ],
  },
  { versionKey: false },
);
const roomModel = model<IRoom>('Rooms', roomSchema, 'rooms');
export default roomModel;
