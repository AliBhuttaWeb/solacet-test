const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');

describe('Medium Task - Authentication & JWT', () => {
  const validUserData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  };

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create(validUserData);
    });

    test('should login user with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.email,
          password: validUserData.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'patient'
      });
      expect(response.body.user.password).toBeUndefined();

      // Verify JWT token is valid
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'test-secret');
      expect(decoded.userId).toBeDefined();
    });

    test('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: validUserData.password
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email'
          // missing password
        })
        .expect(400);

      expect(response.body.errors).toHaveLength(2); // email format, password required
    });
  });
}); 