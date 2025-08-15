const { prisma } = require('../config/database');

class WalletModel {
  async create({ id, balance, name }) {
    return await prisma.wallet.create({
      data: { id, balance, name }
    });
  }

  async findById(id) {
    return await prisma.wallet.findUnique({
      where: { id }
    });
  }

  async updateBalance(id, newBalance) {
    return await prisma.wallet.update({
      where: { id },
      data: { balance: newBalance }
    });
  }

  async createWalletWithTransaction({ walletId, transactionId, balance, name, transactionType, description }) {
    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.create({
        data: {
          id: walletId,
          balance,
          name
        }
      });

      const transaction = await tx.transaction.create({
        data: {
          id: transactionId,
          walletId: walletId,
          amount: balance,
          balanceAfter: balance,
          description,
          type: transactionType
        }
      });

      return { wallet, transaction };
    });
  }
}

module.exports = new WalletModel();