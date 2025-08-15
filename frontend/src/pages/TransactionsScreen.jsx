import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Download, DollarSign, Search } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import useTransactionData from '../hooks/useTransactionData';
import { exportUtils } from '../utils/exportUtils';
import TransactionTable from '../components/transcations/TransactionTable';

const TransactionsScreen = () => {
  const { wallet } = useWallet();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const { 
    transactions, 
    loading, 
    error, 
    totalCount, 
    currentPage,
    refetch,
    goToPage 
  } = useTransactionData(wallet?.id, itemsPerPage);
  
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
      await exportUtils.exportTransactionsCSV(wallet.id);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
  };

  // No wallet state
  if (!wallet) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <EmptyState
              icon={DollarSign}
              title="No Wallet Found"
              description="Please create a wallet first to view transactions."
              action={
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Go to Dashboard
                </button>
              }
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            </div>
            <div className="flex items-center space-x-3">
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

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
            {totalCount > 0 && (
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  Showing {startItem} to {endItem} of {totalCount} transactions
                </p>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
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
              description="Create your first transaction from the dashboard."
            />
          ) : (
            <>
              <TransactionTable transactions={transactions} showWalletId={false} />

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

export default TransactionsScreen;