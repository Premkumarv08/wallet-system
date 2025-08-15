/**
 * Reusable error state component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Optional retry handler
 */
const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-red-600 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-700 hover:text-red-800 text-sm font-medium underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;