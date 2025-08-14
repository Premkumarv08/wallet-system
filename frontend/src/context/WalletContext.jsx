import { createContext, useContext, useState, useEffect } from 'react';
import { walletAPI } from '../services/api';

/**
 * WalletContext - Manages wallet state and API interactions
 * 
 * Uses the following APIs:
 * - POST /setup - Create new wallet
 * - GET /wallet/{walletID} - Load existing wallet by ID
 * - POST /transact/{walletID} - Create new transaction
 * 
 * The GET /wallet/{walletID} API is used in:
 * 1. loadWallet() - Called on app startup if wallet ID exists in localStorage
 * 2. refreshWallet() - Manually refresh wallet data
 */

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
      console.log('Loading existing wallet with ID:', walletId);
      loadWallet(walletId);
    } else {
      console.log('No wallet ID found in localStorage');
    }
  }, []);

  const loadWallet = async (walletId) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Calling GET /wallet/{walletID} API with ID:', walletId);
      
      const response = await walletAPI.getWallet(walletId);
      console.log('GET /wallet/{walletID} API response:', response);
      
      if (response && response.data) {
        setWallet(response.data);
        console.log('Wallet loaded successfully:', response.data);
      } else {
        throw new Error('Invalid response format from wallet API');
      }
    } catch (err) {
      console.error('Error loading wallet:', err);
      setError(err.message || 'Failed to load wallet');
      // Clear invalid wallet ID from localStorage
      localStorage.removeItem('walletId');
      console.log('Cleared invalid wallet ID from localStorage');
    } finally {
      setLoading(false);
    }
  };

  const setupWallet = async (walletData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Setting up new wallet with data:', walletData);
      
      const response = await walletAPI.setupWallet(walletData);
      console.log('Setup wallet API response:', response);
      
      const newWallet = response.data;
      setWallet(newWallet);
      localStorage.setItem('walletId', newWallet.id);
      console.log('New wallet created and saved to localStorage:', newWallet.id);
      return newWallet;
    } catch (err) {
      console.error('Error setting up wallet:', err);
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
      console.log('Creating transaction:', { amount, description, walletId: wallet.id });
      
      const response = await walletAPI.createTransaction(wallet.id, {
        amount,
        description
      });
      
      console.log('Transaction created successfully:', response);
      
      // Update wallet balance
      setWallet(prev => ({
        ...prev,
        balance: response.data.balance
      }));
      
      return response.data;
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err.message || 'Failed to create transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearWallet = () => {
    console.log('Clearing wallet data');
    setWallet(null);
    setError(null);
    localStorage.removeItem('walletId');
  };

  const refreshWallet = async () => {
    if (!wallet?.id) {
      console.log('No wallet ID available for refresh');
      return;
    }
    
    console.log('Refreshing wallet data using GET /wallet/{walletID} API');
    await loadWallet(wallet.id);
  };

  const value = {
    wallet,
    loading,
    error,
    setupWallet,
    createTransaction,
    loadWallet,
    clearWallet,
    refreshWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 