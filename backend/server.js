const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/meeting', require('./routes/meetingRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/workflow', require('./routes/workflowRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autoops-ai';

let isConnected;
const connectDB = async () => {
  if (isConnected) return;
  try {
     const db = await mongoose.connect(MONGO_URI);
     isConnected = db.connections[0].readyState;
     console.log('Connected to MongoDB');
  } catch(err) {
     console.error('Database connection error:', err);
  }
};
connectDB();

// Deployment Routing - serve Frontend statically
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Start Server unconditionally for Render
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
