# Rauha Interview Project

## Overview

Rauha is a prescription digital therapeutic designed to reduce depression and anxiety through cognitive behavioral therapy (CBT). This is a **technical interview project** that tests your knowledge of Node.js, Express, MongoDB, and JWT authentication.

## 🎯 Your Mission

You will be implementing **three tasks** of increasing difficulty. Each task has corresponding tests that will pass when you complete the implementation correctly.

### 📊 Task Structure

- **🟢 Easy Task**: Basic MongoDB CRUD operations
- **🟡 Medium Task**: JWT Authentication & Authorization  
- **🔴 Hard Task (Optional)**: Advanced MongoDB Aggregation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd rauha-interview-project
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env file with your MongoDB connection string
   ```

3. **Database Setup**
   ```bash
   # Seed the database with sample data
   npm run seed
   ```

4. **Run the Application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Run Tests**
   ```bash
   # Run all tests
   npm test
   
   # Run tests in watch mode
   npm run test:watch
   ```

---

## 📋 Tasks to Complete

### 🟢 **Easy Task: Basic CRUD Operations**

**File to modify**: `routes/therapies.js`

**What to implement**:
- `GET /api/therapies` - Return all therapies with populated creator info
- `GET /api/therapies/:id` - Return specific therapy by ID
- `GET /api/therapies/:id/modules` - Return modules for a therapy, sorted by orderIndex

**Skills tested**:
- MongoDB queries with Mongoose
- Population of referenced documents
- Error handling for invalid IDs
- Basic Express route handling

**Tests to pass**: `npm test -- tests/easy.test.js`

**Hints**:
- Use `Therapy.find()` and `.populate('createdBy', 'name email')`
- Handle invalid ObjectIds with try/catch
- Sort modules using `.sort({ orderIndex: 1 })`
- Return appropriate HTTP status codes

### 🟡 **Medium Task: Authentication & Authorization**

**File to modify**: `routes/auth.js`

**What to implement**:
- `POST /api/auth/register` - Register new users
- `POST /api/auth/login` - Login existing users
- JWT token generation and validation

**Skills tested**:
- Password hashing with bcrypt
- JWT token creation and verification
- Input validation
- Authentication middleware
- Error handling

**Tests to pass**: `npm test -- tests/medium.test.js`

**Hints**:
- Check if user exists before registration
- Use `user.comparePassword()` for login
- Generate JWT with `jwt.sign({ userId: user._id }, process.env.JWT_SECRET)`
- Return user data without password
- Handle validation errors properly

### 🔴 **Hard Task: Advanced Aggregation (Optional)**

**File to modify**: `routes/progress.js`

**What to implement**:
- `GET /api/progress/user/:userId` - Complex user progress statistics
- `GET /api/progress/therapy/:therapyId` - Therapy completion analytics

**Skills tested**:
- MongoDB aggregation pipelines
- Complex data relationships
- Performance optimization
- Advanced authorization logic

**Tests to pass**: `npm test -- tests/hard.test.js`

**Expected Response Format**:

```javascript
// GET /api/progress/user/:userId
{
  "totalStepsCompleted": 5,
  "therapyProgress": [
    {
      "therapyId": "...",
      "therapyTitle": "Anxiety Management",
      "completedSteps": 3,
      "totalSteps": 5,
      "progressPercentage": 60,
      "modules": [...]
    }
  ],
  "recentActivity": [...], // Last 7 days
  "overallStats": {
    "totalTherapiesStarted": 2,
    "totalTherapiesCompleted": 1,
    "averageCompletionRate": 75
  }
}
```

**Hints**:
- Use aggregation pipeline with `$lookup`, `$group`, `$project`
- Consider using `$facet` for multiple aggregations
- Filter recent activity with date comparisons
- Calculate percentages using `$divide` and `$multiply`

---

## 🧪 Testing Strategy

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/easy.test.js
npm test -- tests/medium.test.js
npm test -- tests/hard.test.js

# Watch mode for development
npm run test:watch
```

### Test Structure
- **Easy tests**: Focus on basic functionality and error handling
- **Medium tests**: Comprehensive authentication flow testing
- **Hard tests**: Complex data scenarios and edge cases

### Debugging Tests
- Tests use in-memory MongoDB for isolation
- Each test suite has detailed setup and teardown
- Check test output for specific failure reasons

---

## 📚 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'patient' | 'therapist'
}
```

### Therapy
```javascript
{
  title: String,
  description: String,
  category: 'anxiety' | 'depression' | 'general',
  duration: Number, // weeks
  createdBy: ObjectId // User reference
}
```

### Module
```javascript
{
  title: String,
  description: String,
  therapy: ObjectId, // Therapy reference
  orderIndex: Number,
  type: 'lesson' | 'exercise' | 'assessment'
}
```

### Step
```javascript
{
  title: String,
  content: String,
  module: ObjectId, // Module reference
  orderIndex: Number,
  type: 'video' | 'reading' | 'exercise' | 'quiz'
}
```

### UserProgress
```javascript
{
  user: ObjectId, // User reference
  step: ObjectId, // Step reference
  status: 'not-started' | 'completed',
  completedAt: Date
}
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Therapies
- `GET /api/therapies` - Get all therapies
- `GET /api/therapies/:id` - Get therapy by ID
- `GET /api/therapies/:id/modules` - Get therapy modules
- `POST /api/therapies` - Create therapy (therapist only)

### Progress
- `POST /api/progress/complete` - Mark step as completed (protected)
- `GET /api/progress/user/:userId` - User progress stats (protected)
- `GET /api/progress/therapy/:therapyId` - Therapy stats (therapist only)

### Utility
- `GET /health` - Health check

---

## 🧑‍💻 Sample Data

The database is seeded with:
- **Therapist**: `therapist@rauha.com` / `password123`
- **Patient 1**: `john@example.com` / `password123`
- **Patient 2**: `jane@example.com` / `password123`
- **2 Therapies**: Anxiety Management, Depression Recovery
- **5 Modules**: Various lesson types
- **8 Steps**: Reading, exercises, quizzes
- **Sample Progress**: Completed steps for testing

---

## 🎖️ Evaluation Criteria

### Code Quality
- ✅ Clean, readable code structure
- ✅ Proper error handling
- ✅ Appropriate HTTP status codes
- ✅ Input validation

### MongoDB Knowledge
- ✅ Efficient queries and indexes
- ✅ Proper use of population
- ✅ Aggregation pipeline usage (Hard task)
- ✅ Data modeling understanding

### Security
- ✅ Password hashing
- ✅ JWT implementation
- ✅ Authorization checks
- ✅ Input sanitization

### Testing
- ✅ All tests pass
- ✅ Edge cases handled
- ✅ Proper test data setup

---

## 💡 Tips for Success

1. **Start with Easy**: Get the basic CRUD operations working first
2. **Read the Tests**: Tests show exactly what's expected
3. **Use Postman**: Test your endpoints manually during development
4. **Check Sample Data**: Understand the data relationships
5. **Handle Errors**: Always return appropriate error messages
6. **Security First**: Never expose passwords in responses
7. **Performance**: Use efficient MongoDB queries

---

## 🆘 Getting Help

If you're stuck:
1. Check the test files for expected behavior
2. Review the sample data structure
3. Use `console.log()` for debugging
4. Check MongoDB queries in MongoDB Compass
5. Verify your JWT tokens at jwt.io

---

## 🏁 Submission

When you're ready to submit:
1. Ensure all tests pass: `npm test`
2. Test the API manually with sample data
3. Commit your changes with clear messages
4. Be prepared to explain your implementation choices

**Good luck! 🚀**