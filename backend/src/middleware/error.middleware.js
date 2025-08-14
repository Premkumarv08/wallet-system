const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      status: 'error',
      message: 'Resource already exists'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found'
    });
  }

  // Handle custom errors
  if (err.message === 'Wallet not found') {
    return res.status(404).json({
      status: 'error',
      message: 'Wallet not found'
    });
  }

  if (err.message === 'Insufficient balance for debit transaction') {
    return res.status(400).json({
      status: 'error',
      message: 'Insufficient balance for debit transaction'
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : message
  });
};

module.exports = { errorHandler }; 