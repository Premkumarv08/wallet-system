const express = require('express');
const router = express.Router();
const { walletController } = require('../controllers');
const { validationMiddleware } = require('../middleware');

/**
 * @swagger
 * /setup:
 *   post:
 *     summary: Create a new wallet
 *     description: Creates a new wallet with the provided name and initial balance
 *     tags: [Wallets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the wallet
 *                 example: "My Personal Wallet"
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/setup', walletController.setupWallet);

/**
 * @swagger
 * /wallet/{id}:
 *   get:
 *     summary: Get wallet details
 *     description: Retrieves wallet information by wallet ID
 *     tags: [Wallets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Wallet details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/wallet/:id', walletController.getWallet);

module.exports = router;