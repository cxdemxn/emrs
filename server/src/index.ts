import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import facultyRoutes from './routes/faculty';
import departmentRoutes from './routes/department';
import courseRoutes from './routes/course';
import timetableRoutes from './routes/timetable';
import studentRoutes from './routes/student';
import { prisma } from './utils/prisma';
import Logger from './utils/logger';
import { requestLogger, errorLogger } from './middleware/logger.middleware';

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/students', studentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware (must be after routes)
app.use(errorLogger);

// Start server
app.listen(port, () => {
  Logger.info(`Server running on port ${port}`);
  Logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  Logger.info('Server shutting down...');
  await prisma.$disconnect();
  Logger.info('Database connection closed');
  process.exit(0);
});
