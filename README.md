# Rauha Interview Project - Simplified Version

## Overview

Rauha is a prescription digital therapeutic designed to reduce depression and anxiety through cognitive behavioral therapy (CBT). This is a **technical interview project** that tests your knowledge of Node.js, Express, MongoDB, and JWT authentication.

## 🎯 Your Mission - 45 Minutes

You will be implementing **two main tasks** plus an optional advanced task. The entire interview should take **under 45 minutes**.

### 📊 Task Structure

- **🟢 Easy Task (15 minutes)**: Basic MongoDB CRUD operations - 2 endpoints
- **🟡 Medium Task (15 minutes)**: JWT Authentication - 1 endpoint  
- **🔴 Hard Task (15 minutes - Optional)**: MongoDB Aggregation - 1 endpoint

---

## 🚀 Getting Started

### Quick Setup (5 minutes)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # MongoDB connection string is already configured for local MongoDB
   ```

3. **Database Setup**
   ```bash
   npm run seed
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

---

## 📋 Tasks to Complete

### 🟢 **Easy Task: Basic CRUD Operations (15 minutes)**

**File to modify**: `routes/therapies.js`

**What to implement**:
- `GET /api/therapies` - Return all therapies with populated creator info
- `GET /api/therapies/:id` - Return specific therapy by ID

**Skills tested**:
- MongoDB queries with Mongoose
- Population of referenced documents
- Basic error handling

**Tests to pass**: `npm test -- tests/easy.test.js`

**Starter code provided**:
```javascript
// GET /api/therapies
const therapies = await Therapy.find().populate('createdBy', 'name email');
res.json(therapies);

// GET /api/therapies/:id  
const therapy = await Therapy.findById(req.params.id).populate('createdBy', 'name email');
if (!therapy) return res.status(404).json({ message: 'Therapy not found' });
res.json(therapy);
```

### 🟡 **Medium Task: Authentication (15 minutes)**

**File to modify**: `routes/auth.js`

**What to implement**:
- `POST /api/auth/login` - Login existing users and return JWT token

**Skills tested**:
- Password comparison with bcrypt
- JWT token creation
- Basic validation

**Tests to pass**: `npm test -- tests/medium.test.js`

**Starter code provided**:
```javascript
// POST /api/auth/login
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user || !(await user.comparePassword(password))) {
  return res.status(401).json({ message: 'Invalid credentials' });
}

const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
```

### 🔴 **Hard Task: Aggregation (15 minutes - Optional)**

**File to modify**: `routes/progress.js`

**What to implement**:
- `GET /api/progress/user/:userId` - User progress statistics using MongoDB aggregation

**Skills tested**:
- MongoDB aggregation pipeline
- Complex data relationships

**Tests to pass**: `npm test -- tests/hard.test.js`

**Expected Response Format**:
```javascript
{
  "totalStepsCompleted": 3,
  "therapyProgress": [
    {
      "therapyId": "...",
      "therapyTitle": "Anxiety Management", 
      "completedSteps": 2,
      "totalSteps": 4,
      "progressPercentage": 50
    }
  ],
  "recentActivity": [
    {
      "stepTitle": "Introduction",
      "therapyTitle": "Anxiety Management",
      "completedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

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
```

### Test Expectations
- **Easy tests**: 5 test cases (basic CRUD + error handling)
- **Medium tests**: 4 test cases (login flow + validation)
- **Hard tests**: 3 test cases (aggregation + authorization)

---

## 📚 Key Data Models

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
  duration: Number,
  createdBy: ObjectId // User reference
}
```

### UserProgress
```javascript
{
  user: ObjectId, // User reference
  step: ObjectId, // Step reference  
  status: 'completed',
  completedAt: Date
}
```

---

## 🔧 Available API Endpoints

### Authentication
- `POST /api/auth/login` - Login user (**TO IMPLEMENT**)
- `GET /api/auth/me` - Get current user (already implemented)

### Therapies  
- `GET /api/therapies` - Get all therapies (**TO IMPLEMENT**)
- `GET /api/therapies/:id` - Get therapy by ID (**TO IMPLEMENT**)

### Progress
- `POST /api/progress/complete` - Mark step as completed (already implemented)
- `GET /api/progress/user/:userId` - User progress stats (**OPTIONAL TO IMPLEMENT**)

---

## 🧑‍💻 Sample Data

The database is seeded with:
- **Therapist**: `therapist@rauha.com` / `password123`
- **Patient**: `john@example.com` / `password123`  
- **2 Therapies**: Anxiety Management, Depression Recovery
- **Sample Progress**: Completed steps for testing

---

## 💡 Tips for Success

1. **Start with Easy Task**: Get basic CRUD working first (15 min)
2. **Use the starter code**: Copy-paste and modify the provided code snippets
3. **Focus on core functionality**: Don't over-engineer
4. **Test as you go**: Run tests after each endpoint
5. **Skip Hard Task if needed**: It's optional and worth fewer points

---

## 🎯 Time Management

- **Minutes 0-5**: Setup and understand the codebase
- **Minutes 5-20**: Complete Easy Task (2 endpoints)
- **Minutes 20-35**: Complete Medium Task (1 endpoint)  
- **Minutes 35-45**: Attempt Hard Task (optional)

---

## 🏁 Success Criteria

**Minimum to pass**: Easy + Medium tasks completed
**Bonus points**: Hard task completed
**Extra credit**: Clean code with proper error handling

**Good luck! 🚀**