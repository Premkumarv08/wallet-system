import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import CreateWalletModal from '../components/CreateWalletModal';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar
} from 'lucide-react';

const WalletScreen = () => {
  const { wallet, setupWallet, createTransaction, refreshWallet, loading, error } = useWallet();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [transactionData, setTransactionData] = useState({
    amount: '',
    description: '',
    type: 'CREDIT'
  });

  // Handle wallet setup from modal
  const handleWalletSetup = async (walletData) => {
    try {
      await setupWallet(walletData);
      setShowCreateModal(false);
    } catch (err) {
      // Error is handled by the context
    }
  };

  // Handle transaction submission
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionData.amount || !transactionData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(transactionData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Convert to negative for debit
    const finalAmount = transactionData.type === 'DEBIT' ? -amount : amount;
    
    try {
      await createTransaction(finalAmount, transactionData.description.trim());
      // Reset form
      setTransactionData({
        amount: '',
        description: '',
        type: 'CREDIT'
      });
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRefresh = async () => {
    try {
      await refreshWallet();
    } catch (err) {
      console.error('Failed to refresh wallet:', err);
    }
  };

  // Screen 1: No wallet initialized - show create wallet option
  if (!wallet) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Wallet System
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create your digital wallet to start managing transactions, track your balance, and export your financial data.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your Wallet
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Transactions</h3>
              <p className="text-gray-600">Monitor all your income and expenses with detailed transaction history.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Balance</h3>
              <p className="text-gray-600">Always know your current balance with instant updates after each transaction.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Data</h3>
              <p className="text-gray-600">Download your transaction history as CSV for external analysis.</p>
            </div>
          </div>

          {/* Create Wallet Modal */}
          <CreateWalletModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleWalletSetup}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    );
  }

  // Screen 1: Wallet Dashboard (when wallet exists)
  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{wallet.name}</h1>
                <p className="text-gray-600">Wallet ID: {wallet.id ? `${wallet.id.substring(0, 4)}...${wallet.id.substring(wallet.id.length - 4)}` : 'N/A'}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Refresh Wallet Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Balance</h2>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              ${parseFloat(wallet.balance).toFixed(4)}
            </div>
            <p className="text-gray-600 text-sm">
              Last updated: {new Date(wallet.date).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Data loaded via GET /wallet API
            </p>
          </div>

          {/* Transaction Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Transaction</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="CREDIT"
                      checked={transactionData.type === 'CREDIT'}
                      onChange={handleTransactionInputChange}
                      className="mr-2"
                    />
                    <span className="flex items-center text-green-600">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      Credit
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="DEBIT"
                      checked={transactionData.type === 'DEBIT'}
                      onChange={handleTransactionInputChange}
                      className="mr-2"
                    />
                    <span className="flex items-center text-red-600">
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                      Debit
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={transactionData.amount}
                  onChange={handleTransactionInputChange}
                  placeholder="0.00"
                  step="0.0001"
                  min="0.0001"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports up to 4 decimal places
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={transactionData.description}
                  onChange={handleTransactionInputChange}
                  placeholder="Enter transaction description"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Processing...' : 'Submit Transaction'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletScreen; 