require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Therapy = require('../models/Therapy');
const Module = require('../models/Module');
const Step = require('../models/Step');
const UserProgress = require('../models/UserProgress');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Therapy.deleteMany({});
    await Module.deleteMany({});
    await Step.deleteMany({});
    await UserProgress.deleteMany({});

    console.log('Cleared existing data');

    // Create sample users
    const therapist = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'therapist@rauha.com',
      password: 'password123',
      role: 'therapist'
    });

    const patient1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'patient'
    });

    const patient2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'patient'
    });

    console.log('Created sample users');

    // Create sample therapies
    const anxietyTherapy = await Therapy.create({
      title: 'Anxiety Management',
      description: 'A comprehensive CBT program to help manage anxiety symptoms through proven techniques.',
      category: 'anxiety',
      duration: 8,
      createdBy: therapist._id
    });

    const depressionTherapy = await Therapy.create({
      title: 'Depression Recovery',
      description: 'Evidence-based cognitive behavioral therapy for depression recovery.',
      category: 'depression',
      duration: 12,
      createdBy: therapist._id
    });

    console.log('Created sample therapies');

    // Create sample modules for anxiety therapy
    const anxietyModule1 = await Module.create({
      title: 'Understanding Anxiety',
      description: 'Learn about the nature of anxiety and how it affects your mind and body.',
      therapy: anxietyTherapy._id,
      orderIndex: 0,
      type: 'lesson'
    });

    const anxietyModule2 = await Module.create({
      title: 'Breathing Techniques',
      description: 'Master breathing exercises to manage anxiety in the moment.',
      therapy: anxietyTherapy._id,
      orderIndex: 1,
      type: 'exercise'
    });

    const anxietyModule3 = await Module.create({
      title: 'Thought Challenging',
      description: 'Learn to identify and challenge anxious thoughts.',
      therapy: anxietyTherapy._id,
      orderIndex: 2,
      type: 'lesson'
    });

    // Create sample modules for depression therapy
    const depressionModule1 = await Module.create({
      title: 'Understanding Depression',
      description: 'Learn about depression and its impact on daily life.',
      therapy: depressionTherapy._id,
      orderIndex: 0,
      type: 'lesson'
    });

    const depressionModule2 = await Module.create({
      title: 'Mood Tracking',
      description: 'Learn to track and understand your mood patterns.',
      therapy: depressionTherapy._id,
      orderIndex: 1,
      type: 'exercise'
    });

    console.log('Created sample modules');

    // Create sample steps
    const steps = [
      // Anxiety Module 1 steps
      {
        title: 'What is Anxiety?',
        content: 'Anxiety is a natural response to stress. It\'s your body\'s way of alerting you to danger.',
        module: anxietyModule1._id,
        orderIndex: 0,
        type: 'reading'
      },
      {
        title: 'Anxiety Symptoms',
        content: 'Common symptoms include rapid heartbeat, sweating, trembling, and feelings of worry.',
        module: anxietyModule1._id,
        orderIndex: 1,
        type: 'reading'
      },
      {
        title: 'Anxiety Quiz',
        content: 'Test your understanding of anxiety concepts.',
        module: anxietyModule1._id,
        orderIndex: 2,
        type: 'quiz'
      },
      // Anxiety Module 2 steps
      {
        title: 'Basic Breathing Exercise',
        content: 'Practice the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8.',
        module: anxietyModule2._id,
        orderIndex: 0,
        type: 'exercise'
      },
      {
        title: 'Progressive Muscle Relaxation',
        content: 'Learn to tense and relax different muscle groups to reduce physical anxiety.',
        module: anxietyModule2._id,
        orderIndex: 1,
        type: 'exercise'
      },
      // Depression Module 1 steps
      {
        title: 'Understanding Depression',
        content: 'Depression is more than just feeling sad. It affects how you think, feel, and behave.',
        module: depressionModule1._id,
        orderIndex: 0,
        type: 'reading'
      },
      {
        title: 'Depression Symptoms',
        content: 'Symptoms include persistent sadness, loss of interest, fatigue, and difficulty concentrating.',
        module: depressionModule1._id,
        orderIndex: 1,
        type: 'reading'
      },
      // Depression Module 2 steps
      {
        title: 'Daily Mood Check',
        content: 'Rate your mood on a scale of 1-10 and note any triggers or patterns.',
        module: depressionModule2._id,
        orderIndex: 0,
        type: 'exercise'
      }
    ];

    const createdSteps = await Step.create(steps);
    console.log('Created sample steps');

    // Create some sample progress data
    const progressData = [
      {
        user: patient1._id,
        step: createdSteps[0]._id,
        status: 'completed',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        user: patient1._id,
        step: createdSteps[1]._id,
        status: 'completed',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        user: patient2._id,
        step: createdSteps[0]._id,
        status: 'completed',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        user: patient2._id,
        step: createdSteps[5]._id,
        status: 'completed',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    await UserProgress.create(progressData);
    console.log('Created sample progress data');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample accounts:');
    console.log('Therapist: therapist@rauha.com / password123');
    console.log('Patient 1: john@example.com / password123');
    console.log('Patient 2: jane@example.com / password123');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
  }
};

connectDB().then(() => {
  seedDatabase();
}); 