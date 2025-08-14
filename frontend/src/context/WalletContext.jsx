import { createContext, useContext, useState, useEffect } from 'react';
import { walletAPI } from '../services/api';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const walletId = localStorage.getItem('walletId');
    if (walletId) {
      loadWallet(walletId);
    }
  }, []);

  const loadWallet = async (walletId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletAPI.getWallet(walletId);
      setWallet(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load wallet');
      // Clear invalid wallet ID from localStorage
      localStorage.removeItem('walletId');
    } finally {
      setLoading(false);
    }
  };

  const setupWallet = async (walletData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletAPI.setupWallet(walletData);
      const newWallet = response.data;
      setWallet(newWallet);
      localStorage.setItem('walletId', newWallet.id);
      return newWallet;
    } catch (err) {
      setError(err.message || 'Failed to setup wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (amount, description) => {
    if (!wallet) {
      throw new Error('No wallet available');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await walletAPI.createTransaction(wallet.id, {
        amount,
        description
      });
      
      // Update wallet balance
      setWallet(prev => ({
        ...prev,
        balance: response.data.balance
      }));
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearWallet = () => {
    setWallet(null);
    setError(null);
    localStorage.removeItem('walletId');
  };

  const value = {
    wallet,
    loading,
    error,
    setupWallet,
    createTransaction,
    loadWallet,
    clearWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 