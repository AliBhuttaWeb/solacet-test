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

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

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

    test('should not register user with existing email', async () => {
      await User.create(validUserData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(400);

      expect(response.body.message).toBe('User already exists');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123' // too short
        })
        .expect(400);

      expect(response.body.errors).toHaveLength(3); // name, email, password
    });

    test('should hash password before saving', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      const user = await User.findOne({ email: validUserData.email });
      expect(user.password).not.toBe(validUserData.password);
      expect(user.password).toMatch(/^\$2[ab]\$\d+\$/); // bcrypt hash pattern
    });
  });

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

  describe('GET /api/auth/me', () => {
    let user, token;

    beforeEach(async () => {
      user = await User.create(validUserData);
      token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '7d' }
      );
    });

    test('should return current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'patient'
      });
      expect(response.body.password).toBeUndefined();
    });

    test('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toBe('Token is not valid');
    });

    test('should return 401 with expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.message).toBe('Token is not valid');
    });
  });

  describe('Authentication Middleware', () => {
    let user, token;

    beforeEach(async () => {
      user = await User.create(validUserData);
      token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '7d' }
      );
    });

    test('should protect routes that require authentication', async () => {
      // Test a protected route (progress completion)
      const response = await request(app)
        .post('/api/progress/complete')
        .send({ stepId: '507f1f77bcf86cd799439011' })
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });

    test('should allow access to protected routes with valid token', async () => {
      // This should pass authentication but fail due to missing step
      const response = await request(app)
        .post('/api/progress/complete')
        .set('Authorization', `Bearer ${token}`)
        .send({ stepId: '507f1f77bcf86cd799439011' })
        .expect(404);

      expect(response.body.message).toBe('Step not found');
    });
  });
}); 