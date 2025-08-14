const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

// Import middleware
const { errorHandler } = require('./src/middleware');
const { loggerMiddleware } = require('./src/middleware');
const { rateLimitMiddleware } = require('./src/middleware');

// Import routes
const routes = require('./src/routes');

// Import Swagger specs
const swaggerSpecs = require('./src/config/swagger');

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

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Wallet System API Documentation'
}));

// API routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

module.exports = app;