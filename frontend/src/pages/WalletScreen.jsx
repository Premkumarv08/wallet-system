import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Wallet, ArrowUpRight, ArrowDownRight, LogOut, User, DollarSign, RefreshCw } from 'lucide-react';

const WalletScreen = () => {
  const { wallet, setupWallet, createTransaction, clearWallet, refreshWallet, loading, error } = useWallet();
  const [formData, setFormData] = useState({
    name: '',
    balance: ''
  });
  const [transactionData, setTransactionData] = useState({
    amount: '',
    description: '',
    type: 'CREDIT'
  });

  // Handle wallet setup
  const handleWalletSetup = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a username');
      return;
    }

    const balance = parseFloat(formData.balance) || 0;
    
    try {
      await setupWallet({
        name: formData.name.trim(),
        balance
      });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? This will clear your wallet data.')) {
      clearWallet();
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshWallet();
    } catch (err) {
      console.error('Failed to refresh wallet:', err);
    }
  };

  // Screen 1: Wallet Initialization (when no wallet exists)
  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Wallet System</h1>
            <p className="text-gray-600">Create your wallet to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleWalletSetup} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Username *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Initial Balance (Optional)
              </label>
              <input
                type="number"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.0001"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports up to 4 decimal places (e.g., 20.5612)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Wallet...' : 'Create Wallet'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Screen 1: Wallet Dashboard (when wallet exists)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{wallet.name}</h1>
                <p className="text-gray-600">Wallet ID: {wallet.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="text-gray-600 hover:text-blue-600 transition-colors"
                title="Refresh Wallet Data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                to="/transactions"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Transactions
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Balance</h2>
            <div className="text-4xl font-bold text-green-600 mb-2">
              ${parseFloat(wallet.balance).toFixed(4)}
            </div>
            <p className="text-gray-600 text-sm">
              Last updated: {new Date(wallet.date).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Data loaded via GET /wallet/{wallet.id} API
            </p>
          </div>

          {/* Transaction Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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