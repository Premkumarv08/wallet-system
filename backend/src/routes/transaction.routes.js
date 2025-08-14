const express = require('express');
const router = express.Router();
const { transactionController } = require('../controllers');
const { validationMiddleware } = require('../middleware');

/**
 * @swagger
 * /transact/{walletId}:
 *   post:
 *     summary: Create a transaction
 *     description: Creates a credit or debit transaction for the specified wallet
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Transaction amount (positive for credit, negative for debit)
 *                 example: 100.50
 *               description:
 *                 type: string
 *                 description: Transaction description
 *                 example: "Payment for services"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.post('/transact/:walletId', transactionController.createTransaction);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get transactions
 *     description: Retrieves transactions with optional filtering and pagination
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: walletId
 *         schema:
 *           type: string
 *         description: Filter transactions by wallet ID (optional)
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip for pagination
 *         example: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records to return
 *         example: 10
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 total:
 *                   type: integer
 *                   description: Total number of transactions
 *                   example: 25
 *       400:
 *         description: Invalid request parameters
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
router.get('/transactions', transactionController.getTransactions);

/**
 * @swagger
 * /transactions/export/{walletId}:
 *   get:
 *     summary: Export transactions to CSV
 *     description: Exports transactions for a specific wallet or all transactions to CSV format
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ID or 'all' for all transactions
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: CSV file downloaded successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
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
router.get('/transactions/export/:walletId', transactionController.exportTransactions);

module.exports = router;