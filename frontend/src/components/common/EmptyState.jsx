/**
 * Reusable empty state component
 * @param {Object} props - Component props
 * @param {React.ComponentType} props.icon - Icon component to display
 * @param {string} props.title - Main title text
 * @param {string} props.description - Description text
 * @param {React.ReactNode} props.action - Optional action element (button, link, etc.)
 */
const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-600 text-lg mb-2">{title}</p>
      <p className="text-gray-500 text-sm mb-6">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;