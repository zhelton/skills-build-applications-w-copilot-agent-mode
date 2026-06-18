"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', default: null },
    level: { type: Number, default: 1, min: 1 },
    totalPoints: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
