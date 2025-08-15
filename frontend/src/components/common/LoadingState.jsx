/**
 * Reusable loading state component
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display
 */
const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;