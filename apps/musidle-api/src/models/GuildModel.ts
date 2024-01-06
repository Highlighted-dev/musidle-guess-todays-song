import { model, Schema } from 'mongoose';
import { IGuild } from '../@types/guild';

const guildSchema = new Schema<IGuild>(
  {
    name: { type: String, required: true, unique: true },
    members: {
      type: [
        new Schema({
          _id: { type: String, required: true, unique: true },
          username: { type: String, required: true },
          email: { type: String, required: true },
          role: { type: String, required: true },
          activated: { type: Boolean, required: true },
          guild: {
            _id: { type: String },
            name: { type: String },
          },
        }),
      ],
      required: true,
      unique: true,
    },
    leader: { type: Object, unique: true },
    level: { type: Number, default: 1 },
    description: { type: String },
  },
  { versionKey: false, timestamps: true },
);

const guildModel = model<IGuild>('Guilds', guildSchema, 'guilds');
export default guildModel;
