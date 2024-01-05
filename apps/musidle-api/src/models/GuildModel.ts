import { model, Schema } from 'mongoose';
import { IGuild } from '../@types/guild';

const guildSchema = new Schema<IGuild>(
  {
    name: { type: String, required: true, unique: true },
    members: { type: [], unique: true },
    leader: { type: Object, unique: true },
    level: { type: Number, default: 1 },
    description: { type: String },
  },
  { versionKey: false, timestamps: true },
);

const guildModel = model<IGuild>('Guilds', guildSchema, 'guilds');
export default guildModel;
