import { Schema, model, type InferSchemaType } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rank: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 0 },
    streakDays: { type: Number, default: 0, min: 0 },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export type Leaderboard = InferSchemaType<typeof leaderboardSchema>;
export const LeaderboardModel = model('Leaderboard', leaderboardSchema);
