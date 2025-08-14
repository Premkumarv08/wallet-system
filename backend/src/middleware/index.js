const { errorHandler } = require('./error.middleware');
const { loggerMiddleware } = require('./logger.middleware');
const { rateLimitMiddleware } = require('./rateLimit.middleware');
const { validationMiddleware } = require('./validation.middleware');

module.exports = {
  errorHandler,
  loggerMiddleware,
  rateLimitMiddleware,
  validationMiddleware
};