const { prisma } = require('../config/database');
const logger = require('../config/logger');

class TransactionModel {
  async create({ id, walletId, amount, balanceAfter, description, type }) {
    return await prisma.transaction.create({
      data: { id, walletId, amount, balanceAfter, description, type }
    });
  }

  async findByWalletId(walletId, { skip = 0, limit = 10, orderBy = { createdAt: 'desc' } }) {
    return await prisma.transaction.findMany({
      where: { walletId },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy
    });
  }

  async createTransactionWithWalletUpdate({ transactionId, walletId, amount, description, type }) {
    return await prisma.$transaction(async (tx) => {
      // Get current wallet with lock to prevent race conditions
      const wallet = await tx.wallet.findUnique({
        where: { id: walletId },
        select: { id: true, balance: true }
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Calculate new balance
      const currentBalance = parseFloat(wallet.balance);
      const newBalance = type === 'CREDIT' 
        ? currentBalance + amount 
        : currentBalance - amount;

      // Check for insufficient balance for debit
      if (type === 'DEBIT' && newBalance < 0) {
        throw new Error('Insufficient balance for debit transaction');
      }

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: walletId },
        data: { balance: newBalance }
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          id: transactionId,
          walletId,
          amount,
          balanceAfter: newBalance,
          description,
          type
        }
      });

      return { wallet: updatedWallet, transaction };
    });
  }

  async getTransactionCount(walletId) {
    return await prisma.transaction.count({
      where: { walletId }
    });
  }
}

module.exports = new TransactionModel();