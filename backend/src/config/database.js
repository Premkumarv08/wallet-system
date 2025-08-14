const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function connectDB() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    return prisma;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function disconnectDB() {
  await prisma.$disconnect();
  logger.info('📴 Database disconnected');
}

module.exports = {
  prisma,
  connectDB,
  disconnectDB
};