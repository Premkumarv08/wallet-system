const express = require('express');
const router = express.Router();
const { transactionController } = require('../controllers');
const { validationMiddleware } = require('../middleware');

// POST /transact/:walletId - Credit/Debit transaction
router.post('/transact/:walletId', transactionController.createTransaction);

// GET /transactions - Fetch transactions with pagination
router.get('/transactions', transactionController.getTransactions);

// GET /transactions/export/:walletId - Export transactions to CSV
router.get('/transactions/export/:walletId', transactionController.exportTransactions);

module.exports = router;