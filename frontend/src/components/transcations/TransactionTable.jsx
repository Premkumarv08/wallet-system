import TransactionRow from "./TranscationRow";

/**
 * Table component for displaying transactions
 * @param {Object} props - Component props
 * @param {Array} props.transactions - Array of transaction objects
 * @param {boolean} props.showWalletId - Whether to show wallet ID column
 */
const TransactionTable = ({ transactions, showWalletId = false }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Amount</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Description</th>
            {showWalletId && (
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Wallet ID</th>
            )}
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionRow 
              key={transaction.id} 
              transaction={transaction} 
              showWalletId={showWalletId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;