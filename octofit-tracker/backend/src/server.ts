import express from 'express';

import { connectDatabase, mongoUri } from './config/database';
import { ActivityModel } from './models/Activity';
import { LeaderboardModel } from './models/Leaderboard';
import { TeamModel } from './models/Team';
import { UserModel } from './models/User';
import { WorkoutModel } from './models/Workout';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', baseUrl });
});

app.get('/api/users/', (_req, res) => {
  void UserModel.find()
    .populate('team', 'name city')
    .sort({ totalPoints: -1, createdAt: 1 })
    .lean()
    .then((users) => {
      res.json({ data: users, count: users.length });
    })
    .catch((error: unknown) => {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    });
});

app.get('/api/teams/', (_req, res) => {
  void TeamModel.find()
    .populate('members', 'username displayName totalPoints')
    .sort({ totalPoints: -1, createdAt: 1 })
    .lean()
    .then((teams) => {
      res.json({ data: teams, count: teams.length });
    })
    .catch((error: unknown) => {
      console.error('Failed to fetch teams:', error);
      res.status(500).json({ error: 'Failed to fetch teams' });
    });
});

app.get('/api/activities/', (_req, res) => {
  void ActivityModel.find()
    .populate('user', 'username displayName')
    .sort({ performedAt: -1 })
    .lean()
    .then((activities) => {
      res.json({ data: activities, count: activities.length });
    })
    .catch((error: unknown) => {
      console.error('Failed to fetch activities:', error);
      res.status(500).json({ error: 'Failed to fetch activities' });
    });
});

app.get('/api/leaderboard/', (_req, res) => {
  void LeaderboardModel.find()
    .populate('user', 'username displayName team')
    .sort({ rank: 1 })
    .lean()
    .then((leaderboard) => {
      res.json({ data: leaderboard, count: leaderboard.length });
    })
    .catch((error: unknown) => {
      console.error('Failed to fetch leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    });
});

app.get('/api/workouts/', (_req, res) => {
  void WorkoutModel.find()
    .populate('createdBy', 'username displayName')
    .sort({ createdAt: -1 })
    .lean()
    .then((workouts) => {
      res.json({ data: workouts, count: workouts.length });
    })
    .catch((error: unknown) => {
      console.error('Failed to fetch workouts:', error);
      res.status(500).json({ error: 'Failed to fetch workouts' });
    });
});

const start = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`OctoFit backend listening on port ${port}`);
      console.log(`OctoFit API base URL: ${baseUrl}`);
      console.log(`MongoDB connection: ${mongoUri}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
};

void start();
