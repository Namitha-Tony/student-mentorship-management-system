require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const goalRoutes = require('./routes/goalRoutes');
const concernRoutes = require('./routes/concernRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const progressRoutes = require('./routes/progressRoutes');
const notFound = require('./middleware/notFoundMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Student Mentorship Management System API is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/concerns', concernRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/progress', progressRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => console.log(`Server running on port ${port}`));
};

if (require.main === module) startServer();

module.exports = app;
