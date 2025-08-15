import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider, useWallet } from './context/WalletContext';
import SidebarLayout from './components/SidebarLayout';
import WalletScreen from './pages/WalletScreen';
import TransactionsScreen from './pages/TransactionsScreen';
import AllTransactionsScreen from './pages/AllTransactionsScreen';
import './App.css';

const AppRoutes = () => {
  const { wallet, loading } = useWallet();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarLayout>
      <Routes>
        <Route 
          path="/" 
          element={<WalletScreen />} 
        />
        <Route 
          path="/transactions" 
          element={wallet ? <TransactionsScreen /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/all-transactions" 
          element={<AllTransactionsScreen />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SidebarLayout>
  );
};

function App() {
  return (
    <Router>
      <WalletProvider>
        <AppRoutes />
      </WalletProvider>
    </Router>
  );
}

export default App;
