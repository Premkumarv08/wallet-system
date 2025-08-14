const express = require('express');
const router = express.Router();
const { walletController } = require('../controllers');
const { validationMiddleware } = require('../middleware');

// POST /setup - Setup wallet
router.post('/setup', walletController.setupWallet);

// GET /wallet/:id - Get wallet details
router.get('/wallet/:id', walletController.getWallet);

module.exports = router;