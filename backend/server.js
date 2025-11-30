import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import roleRoutes from './routes/role.routes.js';
import contentRoutes from './routes/content.routes.js';
import courseRoutes from './routes/course.routes.js';
import learningPathRoutes from './routes/learningPath.routes.js';
import categoryRoutes from './routes/category.routes.js';
import tagRoutes from './routes/tag.routes.js';
import templateRoutes from './routes/template.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Knowledge Center API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Knowledge Center API',
    version: '1.0.0',
    description: 'Learning Management System Backend API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      roles: '/api/roles',
          content: '/api/content',
          courses: '/api/courses',
          learningPaths: '/api/learning-paths',
          categories: '/api/categories',
          tags: '/api/tags',
          templates: '/api/templates',
          assessments: '/api/assessments'
        }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/assessments', assessmentRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Test database connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection error:', error.message);
    console.error('Please check your database configuration in .env file');
    console.error('Make sure MySQL/MariaDB is running and the database exists');
  });

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Knowledge Center API Server');
  console.log('═══════════════════════════════════════');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${CORS_ORIGIN}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log('═══════════════════════════════════════');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

