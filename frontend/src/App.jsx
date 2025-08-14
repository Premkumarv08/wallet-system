import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider, useWallet } from './context/WalletContext';
import WalletSetup from './pages/WalletSetup';
import WalletDashboard from './pages/WalletDashboard';
import Transactions from './pages/Transactions';
import './App.css';

// Component to handle routing based on wallet state
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
    <Routes>
      <Route 
        path="/" 
        element={wallet ? <WalletDashboard /> : <WalletSetup />} 
      />
      <Route 
        path="/transactions" 
        element={wallet ? <Transactions /> : <Navigate to="/" replace />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
