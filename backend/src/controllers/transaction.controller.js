const { transactionService } = require('../services');
const { transactionValidator } = require('../validators');
const { responseUtils } = require('../utils');
const logger = require('../config/logger');

class TransactionController {
  async createTransaction(req, res, next) {
    try {
      // Validate request
      const validatedData = transactionValidator.createTransactionSchema.parse({
        walletId: req.params.walletId,
        ...req.body
      });
      
      // Call service
      const result = await transactionService.createTransaction(validatedData);
      
      // Return response
      return responseUtils.success(res, result, 'Transaction completed successfully');
    } catch (error) {
      logger.error('Create transaction error:', error);
      next(error);
    }
  }

  async getTransactions(req, res, next) {
    try {
      // Validate query parameters
      const validatedData = transactionValidator.getTransactionsSchema.parse(req.query);
      
      // Call service
      const transactions = await transactionService.getTransactions(validatedData);
      
      // Return response
      return responseUtils.success(res, transactions, 'Transactions retrieved successfully');
    } catch (error) {
      logger.error('Get transactions error:', error);
      next(error);
    }
  }

  async exportTransactions(req, res, next) {
    try {
      const { walletId } = req.params;
      
      // Validate wallet ID
      if (!walletId) {
        return res.status(400).json({
          status: 'error',
          message: 'Wallet ID is required'
        });
      }
      
      // Call service
      const csv = await transactionService.exportTransactions(walletId);
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="transactions-${walletId}.csv"`);
      
      // Return CSV
      return res.send(csv);
    } catch (error) {
      logger.error('Export transactions error:', error);
      next(error);
    }
  }
}

module.exports = new TransactionController();