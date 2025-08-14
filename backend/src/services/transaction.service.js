const { transactionModel, walletModel } = require('../models');
const { idUtils } = require('../utils');
const { TRANSACTION_TYPES } = require('../config/constants');
const logger = require('../config/logger');
const csvService = require('./csv.service');

class TransactionService {
  async createTransaction({ walletId, amount, description }) {
    try {
      const transactionId = idUtils.generateUUID();
      const type = amount > 0 ? TRANSACTION_TYPES.CREDIT : TRANSACTION_TYPES.DEBIT;

      // Use transaction for atomicity
      const result = await transactionModel.createTransactionWithWalletUpdate({
        transactionId,
        walletId,
        amount: Math.abs(amount), // Store absolute value
        description,
        type
      });

      logger.info(`Transaction created: ${transactionId} for wallet: ${walletId}`);
      
      return {
        balance: parseFloat(result.wallet.balance),
        transactionId: result.transaction.id
      };
    } catch (error) {
      logger.error('Create transaction service error:', error);
      if (error.message.includes('Insufficient balance')) {
        throw new Error('Insufficient balance for debit transaction');
      }
      throw new Error('Failed to create transaction');
    }
  }

  async getTransactions({ walletId, skip, limit }) {
    try {
      // Verify wallet exists
      const wallet = await walletModel.findById(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const transactions = await transactionModel.findByWalletId(walletId, {
        skip,
        limit,
        orderBy: { createdAt: 'desc' }
      });

      const formattedTransactions = transactions.map(transaction => ({
        id: transaction.id,
        walletId: transaction.walletId,
        amount: parseFloat(transaction.amount),
        balance: parseFloat(transaction.balanceAfter),
        description: transaction.description,
        date: transaction.createdAt,
        type: transaction.type
      }));

      return {
        data: formattedTransactions,
        total: formattedTransactions.length
      };
    } catch (error) {
      logger.error('Get transactions service error:', error);
      throw error;
    }
  }

  async exportTransactions(walletId) {
    try {
      // Verify wallet exists
      const wallet = await walletModel.findById(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const csv = await csvService.exportTransactions(walletId);
      
      return csv;
    } catch (error) {
      logger.error('Export transactions service error:', error);
      throw error;
    }
  }
}

module.exports = new TransactionService();