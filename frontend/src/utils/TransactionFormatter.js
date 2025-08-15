import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const TransactionFormatter = {
  formatAmount: (amount) => {
    const num = parseFloat(amount);
    return num >= 0 ? `+$${num.toFixed(4)}` : `-$${Math.abs(num).toFixed(4)}`;
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleString();
  },

  getTransactionType: (amount) => {
    return amount >= 0 ? 'Credit' : 'Debit';
  },


  getTransactionIcon: (amount) => {
    return amount >= 0 ? ArrowUpRight : ArrowDownRight;
  },

  getTransactionColor: (amount) => {
    return amount >= 0 ? 'green' : 'red';
  },

  maskWalletId: (walletId) => {
    if (!walletId) return 'N/A';
    return walletId.length > 8 ? `${walletId.substring(0, 4)}...${walletId.substring(walletId.length - 4)}` : walletId;
  }
};