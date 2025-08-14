import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { walletAPI } from '../services/api';
import { 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  DollarSign, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  RefreshCw,
  Wallet
} from 'lucide-react';

// Single Responsibility: Handle transaction data formatting
const TransactionFormatter = {
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

  // Mask sensitive data
  maskWalletId: (walletId) => {
    if (!walletId) return 'N/A';
    return walletId.length > 8 ? `${walletId.substring(0, 4)}...${walletId.substring(walletId.length - 4)}` : walletId;
  }
};



// Single Responsibility: Handle transaction data fetching
const useTransactionData = (filters, itemsPerPage) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const loadTransactions = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * itemsPerPage;
      const response = await walletAPI.getTransactions({
        walletId: filters.walletId,
        skip,
        limit: itemsPerPage
      });
      
      if (response && response.data && response.data.data) {
        setTransactions(response.data.data);
        setTotalCount(response.data.total || response.data.data.length);
      } else if (response && response.data) {
        setTransactions(response.data);
        setTotalCount(response.total || response.data.length);
      } else if (Array.isArray(response)) {
        setTransactions(response);
        setTotalCount(response.length);
      } else {
        setTransactions([]);
        setTotalCount(0);
      }
      setCurrentPage(page);
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page) => {
    loadTransactions(page);
  };

  useEffect(() => {
    loadTransactions(1);
  }, [filters.walletId, itemsPerPage]);

  return { 
    transactions, 
    loading, 
    error, 
    totalCount, 
    currentPage,
    refetch: () => loadTransactions(currentPage),
    goToPage
  };
};

// Single Responsibility: Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange, onNext, onPrevious, hasNext, hasPrevious }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
        
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Single Responsibility: Transaction row component
const TransactionRow = ({ transaction }) => {
  const Icon = TransactionFormatter.getTransactionIcon(transaction.amount);
  const color = TransactionFormatter.getTransactionColor(transaction.amount);
  const type = TransactionFormatter.getTransactionType(transaction.amount);

  const getColorClasses = (color) => {
    if (color === 'green') {
      return {
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-700',
        amount: 'text-green-600'
      };
    } else {
      return {
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
        amount: 'text-red-600'
      };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center">
          <Icon className={`w-4 h-4 ${colorClasses.icon} mr-2`} />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses.badge}`}>
            {type}
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={`font-semibold ${colorClasses.amount}`}>
          {TransactionFormatter.formatAmount(transaction.amount)}
        </span>
      </td>
      <td className="py-4 px-4 text-gray-900">
        {transaction.description}
      </td>
      <td className="py-4 px-4 text-gray-600">
        <div className="flex items-center">
          <Wallet className="w-4 h-4 mr-2" />
          <span className="font-mono text-sm">{TransactionFormatter.maskWalletId(transaction.walletId)}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-gray-600">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {TransactionFormatter.formatDate(transaction.date)}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
          <span className="font-semibold">${parseFloat(transaction.balance).toFixed(4)}</span>
        </div>
      </td>
    </tr>
  );
};

// Single Responsibility: Filter component
const FilterPanel = ({ filters, onFilterChange, onReset, showFilters }) => {
  if (!showFilters) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Transactions</h2>
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Wallet className="w-4 h-4 inline mr-1" />
            Wallet ID
          </label>
          <input
            type="text"
            value={filters.walletId}
            onChange={(e) => onFilterChange('walletId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter wallet ID (required)"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Wallet ID is required to view transactions
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// Main component
const AllTransactionsScreen = () => {
  const { wallet } = useWallet();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    walletId: 'e6ac2547-97d7-4b14-b8e7-bfd6d454e62b' // Default to a valid wallet ID
  });
  
  const itemsPerPage = 10; // Fixed items per page
  
  // Get transaction data with pagination
  const { 
    transactions, 
    loading, 
    error, 
    totalCount, 
    currentPage,
    refetch, 
    goToPage 
  } = useTransactionData(filters, itemsPerPage);
  
  // Handle pagination UI
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const startItem = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);
  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;
  
  const goToNext = () => {
    if (hasNext) {
      goToPage(currentPage + 1);
    }
  };
  
  const goToPrevious = () => {
    if (hasPrevious) {
      goToPage(currentPage - 1);
    }
  };

  const handleExport = async () => {
    try {
      const response = await walletAPI.exportTransactions(filters.walletId || 'all');
      
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      walletId: 'e6ac2547-97d7-4b14-b8e7-bfd6d454e62b' // Reset to default wallet ID
    });
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
              <p className="text-gray-600">Manage and view transactions across all wallets</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button
                onClick={refetch}
                disabled={loading}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          showFilters={showFilters}
        />

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
            {totalCount > 0 && (
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  Showing {startItem} to {endItem} of {totalCount} transactions
                </p>
                {filters.walletId && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Filtered by: {TransactionFormatter.maskWalletId(filters.walletId)}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">No transactions found</p>
              <p className="text-gray-500 text-sm">
                {filters.walletId ? 'Try adjusting your filters or check the wallet ID.' : 'No transactions exist yet.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Description</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Wallet ID</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} />
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                onNext={goToNext}
                onPrevious={goToPrevious}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTransactionsScreen; 