import { useState } from 'react';
import { 
  Download, 
  Search, 
  Filter,
  RefreshCw
} from 'lucide-react';
import Pagination from '../components/common/Pagination';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import useTransactionData from '../hooks/useTransactionData';
import { TransactionFormatter } from '../utils/TransactionFormatter';
import { exportUtils } from '../utils/exportUtils';
import TransactionTable from '../components/transcations/TransactionTable';
import FilterPanel from '../components/transcations/FilterPanel';

const AllTransactionsScreen = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    walletId: 'e6ac2547-97d7-4b14-b8e7-bfd6d454e62b' // Default to a valid wallet ID
  });
  
  const itemsPerPage = 10;
  
  const { 
    transactions, 
    loading, 
    error, 
    totalCount, 
    currentPage,
    refetch, 
    goToPage 
  } = useTransactionData(filters, itemsPerPage);
  
  // Pagination calculations
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
      await exportUtils.exportTransactionsCSV(
        filters.walletId || 'all',
        `all_transactions_${new Date().toISOString().split('T')[0]}.csv`
      );
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      walletId: 'e6ac2547-97d7-4b14-b8e7-bfd6d454e62b'
    });
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 text-left">All Transactions</h1>
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

        {/* Filter Panel */}
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
          
          {error && <ErrorState message={error} onRetry={refetch} />}

          {loading ? (
            <LoadingState message="Loading transactions..." />
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No transactions found"
              description={
                filters.walletId 
                  ? 'Try adjusting your filters or check the wallet ID.' 
                  : 'No transactions exist yet.'
              }
            />
          ) : (
            <>
              <TransactionTable transactions={transactions} showWalletId={true} />

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