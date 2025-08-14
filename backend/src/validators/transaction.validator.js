const { z } = require('zod');

const createTransactionSchema = z.object({
  walletId: z.string().uuid('Invalid wallet ID'),
  amount: z.number()
    .refine(val => val !== 0, 'Amount cannot be zero')
    .multipleOf(0.0001, 'Amount must have maximum 4 decimal places'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
});

const getTransactionsSchema = z.object({
  walletId: z.string().uuid('Invalid wallet ID'),
  skip: z.string().transform(val => parseInt(val, 10)).pipe(
    z.number().int().min(0, 'Skip must be a non-negative integer')
  ).default('0'),
  limit: z.string().transform(val => parseInt(val, 10)).pipe(
    z.number().int().min(1, 'Limit must be a positive integer').max(100, 'Limit cannot exceed 100')
  ).default('10')
});

module.exports = {
  createTransactionSchema,
  getTransactionsSchema
};