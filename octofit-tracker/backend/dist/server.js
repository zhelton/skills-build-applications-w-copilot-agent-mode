"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Activity_1 = require("./models/Activity");
const Leaderboard_1 = require("./models/Leaderboard");
const Team_1 = require("./models/Team");
const User_1 = require("./models/User");
const Workout_1 = require("./models/Workout");
const app = (0, express_1.default)();
const port = 8000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', baseUrl });
});
app.get('/api/users/', (_req, res) => {
    void User_1.UserModel.find()
        .populate('team', 'name city')
        .sort({ totalPoints: -1, createdAt: 1 })
        .lean()
        .then((users) => {
        res.json({ data: users, count: users.length });
    })
        .catch((error) => {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    });
});
app.get('/api/teams/', (_req, res) => {
    void Team_1.TeamModel.find()
        .populate('members', 'username displayName totalPoints')
        .sort({ totalPoints: -1, createdAt: 1 })
        .lean()
        .then((teams) => {
        res.json({ data: teams, count: teams.length });
    })
        .catch((error) => {
        console.error('Failed to fetch teams:', error);
        res.status(500).json({ error: 'Failed to fetch teams' });
    });
});
app.get('/api/activities/', (_req, res) => {
    void Activity_1.ActivityModel.find()
        .populate('user', 'username displayName')
        .sort({ performedAt: -1 })
        .lean()
        .then((activities) => {
        res.json({ data: activities, count: activities.length });
    })
        .catch((error) => {
        console.error('Failed to fetch activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    });
});
app.get('/api/leaderboard/', (_req, res) => {
    void Leaderboard_1.LeaderboardModel.find()
        .populate('user', 'username displayName team')
        .sort({ rank: 1 })
        .lean()
        .then((leaderboard) => {
        res.json({ data: leaderboard, count: leaderboard.length });
    })
        .catch((error) => {
        console.error('Failed to fetch leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    });
});
app.get('/api/workouts/', (_req, res) => {
    void Workout_1.WorkoutModel.find()
        .populate('createdBy', 'username displayName')
        .sort({ createdAt: -1 })
        .lean()
        .then((workouts) => {
        res.json({ data: workouts, count: workouts.length });
    })
        .catch((error) => {
        console.error('Failed to fetch workouts:', error);
        res.status(500).json({ error: 'Failed to fetch workouts' });
    });
});
const start = async () => {
    try {
        await mongoose_1.default.connect(mongoUri);
        app.listen(port, () => {
            console.log(`OctoFit backend listening on port ${port}`);
            console.log(`OctoFit API base URL: ${baseUrl}`);
        });
    }
    catch (error) {
        console.error('Failed to start backend:', error);
        process.exit(1);
    }
};
void start();
