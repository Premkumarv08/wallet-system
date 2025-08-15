import { walletAPI } from "../services/api";

export const exportUtils = {
  /**
   * Export transactions to CSV
   * @param {string} walletId - Wallet ID or 'all' for all transactions
   * @param {string} filename - Optional custom filename
   */
  exportTransactionsCSV: async (walletId, filename = null) => {
    try {
      const response = await walletAPI.exportTransactions(walletId);
      
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      if (!filename) {
        const prefix = walletId === 'all' ? 'all_transactions' : 'transactions';
        const date = new Date().toISOString().split('T')[0];
        filename = `${prefix}_${date}.csv`;
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed:', err);
      throw new Error('Failed to export transactions');
    }
  }
};