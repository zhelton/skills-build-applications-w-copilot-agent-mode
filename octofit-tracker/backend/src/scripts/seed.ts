import { connectDatabase, disconnectDatabase } from '../database';
import { ActivityModel } from '../models/Activity';
import { LeaderboardModel } from '../models/Leaderboard';
import { TeamModel } from '../models/Team';
import { UserModel } from '../models/User';
import { WorkoutModel } from '../models/Workout';

const seed = async () => {
  // Seed the octofit_db database with test data
  console.log('Seed the octofit_db database with test data');

  await connectDatabase();

  await Promise.all([
    ActivityModel.deleteMany({}),
    LeaderboardModel.deleteMany({}),
    TeamModel.deleteMany({}),
    UserModel.deleteMany({}),
    WorkoutModel.deleteMany({}),
  ]);

  const [harborRunners, summitLifters] = await TeamModel.create([
    {
      name: 'Harbor Runners',
      city: 'Seattle',
      members: [],
      totalPoints: 0,
    },
    {
      name: 'Summit Lifters',
      city: 'Denver',
      members: [],
      totalPoints: 0,
    },
  ]);

  const users = await UserModel.create([
    {
      username: 'ana_runner',
      email: 'ana.runner@example.com',
      displayName: 'Ana Rivera',
      team: harborRunners._id,
      level: 8,
      totalPoints: 1240,
    },
    {
      username: 'mike_cycle',
      email: 'mike.cycle@example.com',
      displayName: 'Mike Choi',
      team: harborRunners._id,
      level: 6,
      totalPoints: 980,
    },
    {
      username: 'sara_strength',
      email: 'sara.strength@example.com',
      displayName: 'Sara Patel',
      team: summitLifters._id,
      level: 9,
      totalPoints: 1380,
    },
    {
      username: 'leo_hiit',
      email: 'leo.hiit@example.com',
      displayName: 'Leo Morgan',
      team: summitLifters._id,
      level: 7,
      totalPoints: 1115,
    },
  ]);

  harborRunners.members = [users[0]._id, users[1]._id];
  summitLifters.members = [users[2]._id, users[3]._id];
  harborRunners.totalPoints = users[0].totalPoints + users[1].totalPoints;
  summitLifters.totalPoints = users[2].totalPoints + users[3].totalPoints;
  await Promise.all([harborRunners.save(), summitLifters.save()]);

  await ActivityModel.create([
    {
      user: users[0]._id,
      type: 'run',
      durationMinutes: 48,
      caloriesBurned: 520,
      intensity: 'high',
      performedAt: new Date('2026-06-15T07:30:00Z'),
    },
    {
      user: users[1]._id,
      type: 'cycle',
      durationMinutes: 62,
      caloriesBurned: 610,
      intensity: 'medium',
      performedAt: new Date('2026-06-16T18:10:00Z'),
    },
    {
      user: users[2]._id,
      type: 'strength',
      durationMinutes: 55,
      caloriesBurned: 470,
      intensity: 'high',
      performedAt: new Date('2026-06-16T06:45:00Z'),
    },
    {
      user: users[3]._id,
      type: 'hiit',
      durationMinutes: 32,
      caloriesBurned: 430,
      intensity: 'high',
      performedAt: new Date('2026-06-17T12:00:00Z'),
    },
    {
      user: users[0]._id,
      type: 'yoga',
      durationMinutes: 35,
      caloriesBurned: 170,
      intensity: 'low',
      performedAt: new Date('2026-06-17T20:00:00Z'),
    },
  ]);

  await LeaderboardModel.create([
    {
      user: users[2]._id,
      rank: 1,
      points: users[2].totalPoints,
      streakDays: 11,
      updatedAt: new Date('2026-06-18T00:00:00Z'),
    },
    {
      user: users[0]._id,
      rank: 2,
      points: users[0].totalPoints,
      streakDays: 9,
      updatedAt: new Date('2026-06-18T00:00:00Z'),
    },
    {
      user: users[3]._id,
      rank: 3,
      points: users[3].totalPoints,
      streakDays: 7,
      updatedAt: new Date('2026-06-18T00:00:00Z'),
    },
    {
      user: users[1]._id,
      rank: 4,
      points: users[1].totalPoints,
      streakDays: 5,
      updatedAt: new Date('2026-06-18T00:00:00Z'),
    },
  ]);

  await WorkoutModel.create([
    {
      title: 'Sunrise Tempo Run',
      category: 'cardio',
      difficulty: 'intermediate',
      durationMinutes: 45,
      targetMuscles: ['hamstrings', 'calves', 'core'],
      equipment: ['running shoes', 'gps watch'],
      createdBy: users[0]._id,
    },
    {
      title: 'Barbell Foundations',
      category: 'strength',
      difficulty: 'beginner',
      durationMinutes: 50,
      targetMuscles: ['glutes', 'quads', 'back'],
      equipment: ['barbell', 'rack'],
      createdBy: users[2]._id,
    },
    {
      title: 'Desk Reset Mobility',
      category: 'mobility',
      difficulty: 'beginner',
      durationMinutes: 20,
      targetMuscles: ['hips', 'shoulders', 'thoracic spine'],
      equipment: ['mat'],
      createdBy: users[3]._id,
    },
    {
      title: 'Weekend HIIT Ladder',
      category: 'mixed',
      difficulty: 'advanced',
      durationMinutes: 30,
      targetMuscles: ['core', 'legs', 'shoulders'],
      equipment: ['kettlebell', 'jump rope'],
      createdBy: users[1]._id,
    },
  ]);

  console.log('Seed completed successfully.');
};

void seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
