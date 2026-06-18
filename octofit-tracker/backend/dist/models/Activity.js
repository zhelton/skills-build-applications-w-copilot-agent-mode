"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModel = void 0;
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        required: true,
        enum: ['run', 'walk', 'cycle', 'swim', 'strength', 'yoga', 'hiit'],
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    intensity: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    performedAt: { type: Date, required: true },
}, { timestamps: true });
exports.ActivityModel = (0, mongoose_1.model)('Activity', activitySchema);
