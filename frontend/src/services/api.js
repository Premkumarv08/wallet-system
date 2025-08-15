import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export const walletAPI = {
  setupWallet: (data) => api.post('/setup', data),
  
  getWallet: (id) => api.get(`/wallet/${id}`),
  
  createTransaction: (walletId, data) => api.post(`/transact/${walletId}`, data),
  
  getTransactions: (params) => api.get('/transactions', { params }),
  
  exportTransactions: (walletId) => api.get(`/transactions/export/${walletId}`, {
    responseType: 'blob'
  })
};

export default api; 