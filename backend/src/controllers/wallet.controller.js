const { walletService } = require('../services');
const { walletValidator } = require('../validators');
const { responseUtils } = require('../utils');
const logger = require('../config/logger');

class WalletController {
  async setupWallet(req, res, next) {
    try {
      const validatedData = walletValidator.setupWalletSchema.parse(req.body);
      
      const wallet = await walletService.setupWallet(validatedData);
      
      return responseUtils.success(res, wallet, 'Wallet created successfully');
    } catch (error) {
      logger.error('Setup wallet error:', error);
      next(error);
    }
  }

  async getWallet(req, res, next) {
    try {
      const { id } = walletValidator.getWalletSchema.parse({ id: req.params.id });
      
      const wallet = await walletService.getWalletById(id);
      
      return responseUtils.success(res, wallet, 'Wallet retrieved successfully');
    } catch (error) {
      logger.error('Get wallet error:', error);
      next(error);
    }
  }
}

module.exports = new WalletController();