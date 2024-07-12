import { model, Schema } from 'mongoose';
import { IGuild } from '../@types/guild';

const guildSchema = new Schema<IGuild>(
  {
    name: { type: String, required: true, unique: true },
    members: {
      type: [
        new Schema({
          id: { type: String, required: true, unique: true },
          name: { type: String, required: true },
          email: { type: String, required: true },
          image: { type: String, required: true },
          role: { type: String, required: true },
          createdAt: { type: Date, required: true },
        }),
      ],
      required: true,
      unique: true,
    },
    leader: {
      type: {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        image: { type: String, required: true },
        role: { type: String, required: true },
        createdAt: { type: Date, required: true },
      },
      required: true,
      unique: true,
    },
    level: { type: Number, default: 1 },
    description: { type: String },
  },
  { versionKey: false, timestamps: true },
);

const guildModel = model<IGuild>('Guilds', guildSchema, 'guilds');
export default guildModel;
