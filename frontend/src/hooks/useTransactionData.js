import { useState, useEffect } from 'react';
import { walletAPI } from '../services/api';

/**
 * Custom hook for managing transaction data
 * @param {Object|string} filters - Filter object or walletId string for backward compatibility
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} Transaction data and pagination methods
 */
const useTransactionData = (filters, itemsPerPage) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle backward compatibility - if filters is a string, treat it as walletId
  const walletId = typeof filters === 'string' ? filters : filters?.walletId;

  const loadTransactions = async (page = 1) => {
    if (!walletId) {
      setLoading(false);
      setError('Wallet ID is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * itemsPerPage;
      const response = await walletAPI.getTransactions({
        walletId,
        skip,
        limit: itemsPerPage
      });
      
      // Handle different response structures
      if (response && response.data && response.data.data) {
        setTransactions(response.data.data);
        setTotalCount(response.data.total || response.data.data.length);
      } else if (response && response.data) {
        setTransactions(response.data);
        setTotalCount(response.total || response.data.length);
      } else if (Array.isArray(response)) {
        setTransactions(response);
        setTotalCount(response.length);
      } else {
        setTransactions([]);
        setTotalCount(0);
      }
      setCurrentPage(page);
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page) => {
    loadTransactions(page);
  };

  const refetch = () => {
    loadTransactions(currentPage);
  };

  useEffect(() => {
    loadTransactions(1);
  }, [walletId, itemsPerPage]);

  return { 
    transactions, 
    loading, 
    error, 
    totalCount, 
    currentPage,
    refetch,
    goToPage
  };
};

export default useTransactionData;