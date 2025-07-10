const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Therapy = require('../models/Therapy');
const Module = require('../models/Module');
const Step = require('../models/Step');
const UserProgress = require('../models/UserProgress');

describe('Hard Task - Advanced Progress Statistics', () => {
  let therapist, patient1, patient2, therapy1, therapy2;
  let modules, steps, token;

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

    // Create therapies
    therapy1 = await Therapy.create({
      title: 'Anxiety Management',
      description: 'CBT for anxiety',
      category: 'anxiety',
      duration: 8,
      createdBy: therapist._id
    });

    therapy2 = await Therapy.create({
      title: 'Depression Recovery',
      description: 'CBT for depression',
      category: 'depression',
      duration: 12,
      createdBy: therapist._id
    });

    // Create modules
    const module1 = await Module.create({
      title: 'Module 1',
      description: 'First module',
      therapy: therapy1._id,
      orderIndex: 0,
      type: 'lesson'
    });

    const module2 = await Module.create({
      title: 'Module 2',
      description: 'Second module',
      therapy: therapy1._id,
      orderIndex: 1,
      type: 'exercise'
    });

    const module3 = await Module.create({
      title: 'Module 3',
      description: 'Third module',
      therapy: therapy2._id,
      orderIndex: 0,
      type: 'lesson'
    });

    // Create steps
    const step1 = await Step.create({
      title: 'Step 1',
      content: 'First step content',
      module: module1._id,
      orderIndex: 0,
      type: 'reading'
    });

    const step2 = await Step.create({
      title: 'Step 2',
      content: 'Second step content',
      module: module1._id,
      orderIndex: 1,
      type: 'exercise'
    });

    const step3 = await Step.create({
      title: 'Step 3',
      content: 'Third step content',
      module: module2._id,
      orderIndex: 0,
      type: 'quiz'
    });

    const step4 = await Step.create({
      title: 'Step 4',
      content: 'Fourth step content',
      module: module3._id,
      orderIndex: 0,
      type: 'reading'
    });

    // Create progress data
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    await UserProgress.create([
      {
        user: patient1._id,
        step: step1._id,
        status: 'completed',
        completedAt: threeDaysAgo
      },
      {
        user: patient1._id,
        step: step2._id,
        status: 'completed',
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        user: patient1._id,
        step: step3._id,
        status: 'completed',
        completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        user: patient2._id,
        step: step1._id,
        status: 'completed',
        completedAt: oneWeekAgo
      },
      {
        user: patient2._id,
        step: step4._id,
        status: 'completed',
        completedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
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
    test('should return comprehensive user progress statistics', async () => {
      const response = await request(app)
        .get(`/api/progress/user/${patient1._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalStepsCompleted');
      expect(response.body.totalStepsCompleted).toBe(3);

      expect(response.body).toHaveProperty('therapyProgress');
      expect(response.body.therapyProgress).toHaveLength(1);
      expect(response.body.therapyProgress[0]).toMatchObject({
        therapyId: therapy1._id.toString(),
        therapyTitle: 'Anxiety Management',
        completedSteps: 3,
        totalSteps: 3,
        progressPercentage: 100
      });

      expect(response.body).toHaveProperty('moduleProgress');
      expect(response.body.moduleProgress).toHaveLength(2);

      expect(response.body).toHaveProperty('recentActivity');
      expect(response.body.recentActivity).toHaveLength(2); // Only last 7 days

      expect(response.body).toHaveProperty('overallStats');
      expect(response.body.overallStats).toMatchObject({
        totalTherapiesStarted: 1,
        totalTherapiesCompleted: 1,
        averageCompletionRate: 100
      });
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

    test('should handle users with no progress', async () => {
      const newPatient = await User.create({
        name: 'New Patient',
        email: 'new@test.com',
        password: 'password123',
        role: 'patient'
      });

      const response = await request(app)
        .get(`/api/progress/user/${newPatient._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.totalStepsCompleted).toBe(0);
      expect(response.body.therapyProgress).toHaveLength(0);
      expect(response.body.recentActivity).toHaveLength(0);
    });
  });

  describe('GET /api/progress/therapy/:therapyId', () => {
    test('should return comprehensive therapy statistics', async () => {
      const response = await request(app)
        .get(`/api/progress/therapy/${therapy1._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('therapyInfo');
      expect(response.body.therapyInfo).toMatchObject({
        title: 'Anxiety Management',
        category: 'anxiety',
        totalSteps: 3,
        totalModules: 2
      });

      expect(response.body).toHaveProperty('userStats');
      expect(response.body.userStats).toMatchObject({
        totalUsersStarted: 1,
        totalUsersCompleted: 1,
        completionRate: 100
      });

      expect(response.body).toHaveProperty('moduleStats');
      expect(response.body.moduleStats).toHaveLength(2);

      expect(response.body).toHaveProperty('stepStats');
      expect(response.body.stepStats).toHaveLength(3);

      expect(response.body).toHaveProperty('timeStats');
      expect(response.body.timeStats).toHaveProperty('averageCompletionTime');
    });

    test('should only allow therapists to view therapy statistics', async () => {
      const patientToken = jwt.sign(
        { userId: patient1._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .get(`/api/progress/therapy/${therapy1._id}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(403);

      expect(response.body.message).toBe('Only therapists can view therapy statistics');
    });

    test('should handle therapy with no user progress', async () => {
      const newTherapy = await Therapy.create({
        title: 'New Therapy',
        description: 'No progress yet',
        category: 'general',
        duration: 4,
        createdBy: therapist._id
      });

      const response = await request(app)
        .get(`/api/progress/therapy/${newTherapy._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.userStats.totalUsersStarted).toBe(0);
      expect(response.body.userStats.totalUsersCompleted).toBe(0);
      expect(response.body.userStats.completionRate).toBe(0);
    });

    test('should calculate accurate completion rates', async () => {
      // Create additional incomplete progress
      const newStep = await Step.create({
        title: 'New Step',
        content: 'New step content',
        module: (await Module.findOne({ therapy: therapy1._id }))._id,
        orderIndex: 10,
        type: 'reading'
      });

      const response = await request(app)
        .get(`/api/progress/therapy/${therapy1._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Should show partial completion since we added a new step
      expect(response.body.userStats.completionRate).toBeLessThan(100);
    });
  });

  describe('Advanced Aggregation Requirements', () => {
    test('should use MongoDB aggregation pipeline for complex queries', async () => {
      // This test verifies that the implementation uses proper aggregation
      // by checking the structure and completeness of returned data
      const response = await request(app)
        .get(`/api/progress/user/${patient1._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify complex nested data that would require $lookup and $group
      expect(response.body.therapyProgress[0]).toHaveProperty('modules');
      expect(response.body.therapyProgress[0].modules).toBeInstanceOf(Array);
      
      // Verify calculated fields that would require $project
      expect(response.body.therapyProgress[0]).toHaveProperty('progressPercentage');
      expect(typeof response.body.therapyProgress[0].progressPercentage).toBe('number');
    });

    test('should handle date-based filtering for recent activity', async () => {
      const response = await request(app)
        .get(`/api/progress/user/${patient1._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Should only include activities from last 7 days
      expect(response.body.recentActivity.length).toBeLessThanOrEqual(3);
      
      // All activities should be within the last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      response.body.recentActivity.forEach(activity => {
        expect(new Date(activity.completedAt)).toBeGreaterThan(sevenDaysAgo);
      });
    });
  });
}); 