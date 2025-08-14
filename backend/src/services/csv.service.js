const Papa = require('papaparse');
const { transactionModel } = require('../models');
const logger = require('../config/logger');

class CSVService {
  async exportTransactions(walletId) {
    try {
      // Get all transactions for the wallet
      const transactions = await transactionModel.findByWalletId(walletId, {
        skip: 0,
        limit: 10000, // Large limit to get all transactions
        orderBy: { createdAt: 'desc' }
      });

      // Transform data for CSV
      const csvData = transactions.map(transaction => ({
        'Transaction ID': transaction.id,
        'Wallet ID': transaction.walletId,
        'Amount': parseFloat(transaction.amount),
        'Balance After': parseFloat(transaction.balanceAfter),
        'Description': transaction.description,
        'Type': transaction.type,
        'Date': transaction.createdAt.toISOString()
      }));

      // Generate CSV
      const csv = Papa.unparse(csvData);
      
      logger.info(`CSV exported for wallet: ${walletId}, ${csvData.length} transactions`);
      
      return csv;
    } catch (error) {
      logger.error('CSV export error:', error);
      throw new Error('Failed to export CSV');
    }
  }
}

module.exports = new CSVService();