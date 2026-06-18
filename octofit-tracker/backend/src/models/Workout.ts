import { Schema, model, type InferSchemaType } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['cardio', 'strength', 'mobility', 'recovery', 'mixed'],
    },
    difficulty: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    durationMinutes: { type: Number, required: true, min: 5 },
    targetMuscles: [{ type: String, required: true }],
    equipment: [{ type: String, required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export type Workout = InferSchemaType<typeof workoutSchema>;
export const WorkoutModel = model('Workout', workoutSchema);
