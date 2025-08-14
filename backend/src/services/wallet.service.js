const { walletModel, transactionModel } = require('../models');
const { idUtils } = require('../utils');
const { TRANSACTION_TYPES } = require('../config/constants');
const logger = require('../config/logger');

class WalletService {
  async setupWallet({ balance, name }) {
    try {
      const walletId = idUtils.generateUUID();
      const transactionId = idUtils.generateUUID();

      // Use transaction for atomicity
      const result = await walletModel.createWalletWithTransaction({
        walletId,
        transactionId,
        balance,
        name,
        transactionType: TRANSACTION_TYPES.CREDIT,
        description: 'Setup'
      });

      logger.info(`Wallet created: ${walletId}`);
      
      return {
        id: result.wallet.id,
        balance: parseFloat(result.wallet.balance),
        transactionId: result.transaction.id,
        name: result.wallet.name,
        date: result.wallet.createdAt
      };
    } catch (error) {
      logger.error('Setup wallet service error:', error);
      throw new Error('Failed to setup wallet');
    }
  }

  async getWalletById(id) {
    const wallet = await walletModel.findById(id);
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return {
      id: wallet.id,
      balance: parseFloat(wallet.balance),
      name: wallet.name,
      date: wallet.createdAt
    };
  }
}

module.exports = new WalletService();