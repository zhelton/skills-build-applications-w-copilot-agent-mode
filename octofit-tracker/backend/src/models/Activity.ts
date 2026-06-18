import { Schema, model, type InferSchemaType } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      required: true,
      enum: ['run', 'walk', 'cycle', 'swim', 'strength', 'yoga', 'hiit'],
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    intensity: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    performedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export type Activity = InferSchemaType<typeof activitySchema>;
export const ActivityModel = model('Activity', activitySchema);
