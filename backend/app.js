const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import middleware
const { errorHandler } = require('./src/middleware');
const { loggerMiddleware } = require('./src/middleware');
const { rateLimitMiddleware } = require('./src/middleware');

// Import routes
const routes = require('./src/routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
app.use(rateLimitMiddleware);

// Request logging
app.use(loggerMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

module.exports = app;