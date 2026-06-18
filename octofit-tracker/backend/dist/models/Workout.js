"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutModel = void 0;
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
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
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
exports.WorkoutModel = (0, mongoose_1.model)('Workout', workoutSchema);
