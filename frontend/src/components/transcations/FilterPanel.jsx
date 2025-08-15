import { Wallet } from 'lucide-react';

/**
 * Filter panel component for transactions
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Handler for filter changes
 * @param {Function} props.onReset - Handler for resetting filters
 * @param {boolean} props.showFilters - Whether to show the filter panel
 */
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

export default FilterPanel;