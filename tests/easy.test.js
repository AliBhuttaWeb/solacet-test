const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Therapy = require('../models/Therapy');

describe('Easy Task - Basic CRUD Operations', () => {
  let therapist, therapy;

  beforeEach(async () => {
    // Create test data
    therapist = await User.create({
      name: 'Test Therapist',
      email: 'therapist@test.com',
      password: 'password123',
      role: 'therapist'
    });

    therapy = await Therapy.create({
      title: 'Test Therapy',
      description: 'A test therapy program',
      category: 'anxiety',
      duration: 6,
      createdBy: therapist._id
    });
  });

  describe('GET /api/therapies', () => {
    test('should return all therapies with populated creator', async () => {
      const response = await request(app)
        .get('/api/therapies')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        title: 'Test Therapy',
        description: 'A test therapy program',
        category: 'anxiety',
        duration: 6
      });
      expect(response.body[0].createdBy).toMatchObject({
        name: 'Test Therapist',
        email: 'therapist@test.com'
      });
      expect(response.body[0].createdBy.password).toBeUndefined();
    });

    test('should return empty array when no therapies exist', async () => {
      await Therapy.deleteMany({});
      
      const response = await request(app)
        .get('/api/therapies')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/therapies/:id', () => {
    test('should return specific therapy by ID with populated creator', async () => {
      const response = await request(app)
        .get(`/api/therapies/${therapy._id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        title: 'Test Therapy',
        description: 'A test therapy program',
        category: 'anxiety',
        duration: 6
      });
      expect(response.body.createdBy).toMatchObject({
        name: 'Test Therapist',
        email: 'therapist@test.com'
      });
      expect(response.body.createdBy.password).toBeUndefined();
    });

    test('should return 404 for non-existent therapy', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/therapies/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Therapy not found');
    });

    test('should return 400 for invalid therapy ID', async () => {
      const response = await request(app)
        .get('/api/therapies/invalid-id')
        .expect(400);

      expect(response.body.message).toBe('Invalid therapy ID');
    });
  });
}); 