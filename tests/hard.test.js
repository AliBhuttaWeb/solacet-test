const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Therapy = require('../models/Therapy');
const Module = require('../models/Module');
const Step = require('../models/Step');
const UserProgress = require('../models/UserProgress');

describe('Hard Task - User Progress Statistics', () => {
  let therapist, patient1, patient2, therapy1;
  let module1, step1, step2, token;

  beforeEach(async () => {
    // Create users
    therapist = await User.create({
      name: 'Dr. Therapist',
      email: 'therapist@test.com',
      password: 'password123',
      role: 'therapist'
    });

    patient1 = await User.create({
      name: 'Patient One',
      email: 'patient1@test.com',
      password: 'password123',
      role: 'patient'
    });

    patient2 = await User.create({
      name: 'Patient Two',
      email: 'patient2@test.com',
      password: 'password123',
      role: 'patient'
    });

    // Create therapy
    therapy1 = await Therapy.create({
      title: 'Anxiety Management',
      description: 'CBT for anxiety',
      category: 'anxiety',
      duration: 8,
      createdBy: therapist._id
    });

    // Create module
    module1 = await Module.create({
      title: 'Module 1',
      description: 'First module',
      therapy: therapy1._id,
      orderIndex: 0,
      type: 'lesson'
    });

    // Create steps
    step1 = await Step.create({
      title: 'Step 1',
      content: 'First step content',
      module: module1._id,
      orderIndex: 0,
      type: 'reading'
    });

    step2 = await Step.create({
      title: 'Step 2',
      content: 'Second step content',
      module: module1._id,
      orderIndex: 1,
      type: 'exercise'
    });

    // Create progress data
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    await UserProgress.create([
      {
        user: patient1._id,
        step: step1._id,
        status: 'completed',
        completedAt: twoDaysAgo
      },
      {
        user: patient1._id,
        step: step2._id,
        status: 'completed',
        completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      }
    ]);

    // Create JWT token for therapist
    token = jwt.sign(
      { userId: therapist._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    );
  });

  describe('GET /api/progress/user/:userId', () => {
    test('should return user progress statistics', async () => {
      const response = await request(app)
        .get(`/api/progress/user/${patient1._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalStepsCompleted');
      expect(response.body.totalStepsCompleted).toBe(2);

      expect(response.body).toHaveProperty('therapyProgress');
      expect(response.body.therapyProgress).toHaveLength(1);
      expect(response.body.therapyProgress[0]).toMatchObject({
        therapyId: therapy1._id.toString(),
        therapyTitle: 'Anxiety Management',
        completedSteps: 2,
        totalSteps: 2,
        progressPercentage: 100
      });

      expect(response.body).toHaveProperty('recentActivity');
      expect(response.body.recentActivity).toHaveLength(2);
    });

    test('should allow patients to view their own progress', async () => {
      const patientToken = jwt.sign(
        { userId: patient1._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .get(`/api/progress/user/${patient1._id}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalStepsCompleted');
    });

    test('should deny access to other patients progress', async () => {
      const patientToken = jwt.sign(
        { userId: patient2._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .get(`/api/progress/user/${patient1._id}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(403);

      expect(response.body.message).toBe('Access denied');
    });
  });
}); 