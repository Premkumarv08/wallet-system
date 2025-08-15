import { Calendar, DollarSign, Wallet } from 'lucide-react';
import { TransactionFormatter } from '../../utils/TransactionFormatter';

/**
 * Individual transaction row component
 * @param {Object} props - Component props
 * @param {Object} props.transaction - Transaction data
 * @param {boolean} props.showWalletId - Whether to show wallet ID column
 */
const TransactionRow = ({ transaction, showWalletId = false }) => {
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
      {showWalletId && (
        <td className="py-4 px-4 text-gray-600">
          <div className="flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            <span className="font-mono text-sm">
              {TransactionFormatter.maskWalletId(transaction.walletId)}
            </span>
          </div>
        </td>
      )}
      <td className="py-4 px-4 text-gray-600">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {TransactionFormatter.formatDate(transaction.date)}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
          <span className="font-semibold">
            {parseFloat(transaction.balance).toFixed(4)}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default TransactionRow;