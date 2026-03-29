const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');
const Meeting = require('./models/Meeting');
const AuditLog = require('./models/AuditLog');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autoops-ai';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Task.deleteMany({});
    await Meeting.deleteMany({});
    await AuditLog.deleteMany({});
    
    // Create Tasks
    const designTask = await Task.create({
      title: "Landing Page Design",
      owner: "Sneha",
      team: "Design",
      deadline: "20 March",
      status: "Completed",
      priority: "High"
    });

    const frontendTask = await Task.create({
      title: "Frontend Integration",
      owner: "Rahul",
      team: "Frontend",
      deadline: "22 March",
      status: "Overdue",
      priority: "High",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      dependencies: [designTask._id]
    });

    const qaTask = await Task.create({
      title: "QA Testing",
      owner: "Priya",
      team: "QA",
      deadline: "25 March",
      status: "Pending",
      priority: "Medium",
      dependencies: [frontendTask._id]
    });

    await Task.create({
      title: "Backend API Auth",
      owner: "Arjun",
      team: "Backend",
      deadline: "24 March",
      status: "In Progress",
      priority: "High"
    });

    await Task.create({
      title: "Database Indexing",
      owner: "Arjun",
      team: "Backend",
      deadline: "21 March",
      status: "Overdue",
      priority: "Medium",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    await Task.create({
      title: "Competitor Analysis Report",
      owner: "Kripa",
      team: "Operations",
      deadline: "28 March",
      status: "Completed",
      priority: "Low"
    });

    console.log('Demo data perfectly seeded!');
    process.exit(0);
  } catch(error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedDatabase();
