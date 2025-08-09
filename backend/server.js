const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');
const models = require('./models');
const { Op } = require('sequelize');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const contractRoutes = require('./routes/contracts');
const departmentRoutes = require('./routes/departments');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database successfully');
    
    // Sync all models with force: false to prevent dropping tables
    await sequelize.sync({ force: false, alter: false });
    console.log('Database synchronized');
  } catch (err) {
    console.error('Database connection error:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Initial connection attempt
connectDB();

// Import routes
const projectRoutes = require(path.join(__dirname, 'routes', 'projects'));
const hrRoutes = require(path.join(__dirname, 'routes', 'hr'));
const calendarRoutes = require(path.join(__dirname, 'routes', 'calendar'));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/calendar-events', calendarRoutes); // Alias for calendar events
app.use('/api/departments', departmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 