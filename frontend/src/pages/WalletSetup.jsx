import { useState } from 'react';
import { useWallet } from '../context/WalletContext';

const WalletSetup = () => {
  const { setupWallet, loading, error } = useWallet();
  const [formData, setFormData] = useState({
    name: '',
    balance: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a wallet name');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet Setup</h1>
          <p className="text-gray-600">Create your new wallet to get started</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter wallet name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-2">
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
};

export default WalletSetup; 