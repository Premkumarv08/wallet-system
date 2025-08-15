import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { 
  Menu, 
  X, 
  Wallet, 
  BarChart3, 
  User, 
  LogOut,
  Home,
  BarChart2
} from 'lucide-react';

// Single Responsibility: Navigation configuration
const getNavigationConfig = (location, wallet) => [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    current: location.pathname === '/'
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: BarChart3,
    current: location.pathname === '/transactions',
    disabled: !wallet
  },
  {
    name: 'All Transactions',
    href: '/all-transactions',
    icon: BarChart2,
    current: location.pathname === '/all-transactions'
  }
];

// Single Responsibility: Get page title
const getPageTitle = (location) => {
  switch (location.pathname) {
    case '/':
      return 'Dashboard';
    case '/transactions':
      return 'Transactions';
    case '/all-transactions':
      return 'All Transactions';
    default:
      return 'Dashboard';
  }
};

const SidebarLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { wallet, clearWallet } = useWallet();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? This will clear your wallet data.')) {
      clearWallet();
    }
  };

  const navigation = getNavigationConfig(location, wallet);
  const pageTitle = getPageTitle(location);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Wallet System</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : item.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                    {item.disabled && (
                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        No Wallet
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Wallet Info */}
          {wallet && (
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex-1 flex items-center justify-center lg:justify-start">
              <h2 className="text-lg font-semibold text-gray-900">
                {pageTitle}
              </h2>
            </div>

             <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate text-left">
                    {wallet?.name}
                  </p>
                </div>
              </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout; 