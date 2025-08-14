import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Wallet, ArrowUpRight, ArrowDownRight, LogOut } from 'lucide-react';

const WalletDashboard = () => {
  const { wallet, createTransaction, clearWallet, loading, error } = useWallet();
  const [transactionData, setTransactionData] = useState({
    amount: '',
    description: '',
    type: 'CREDIT'
  });

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

  if (!wallet) {
    return null; // This should not happen as this component is only shown when wallet exists
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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

export default WalletDashboard; 