require('dotenv').config();
const app = require('./app');
const logger = require('./src/config/logger');
const { connectDB } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();