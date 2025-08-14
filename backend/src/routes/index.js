const express = require('express');
const router = express.Router();

// Import route modules
const walletRoutes = require('./wallet.routes');
const transactionRoutes = require('./transaction.routes');

// Use routes
router.use('/', walletRoutes);
router.use('/', transactionRoutes);

module.exports = router;