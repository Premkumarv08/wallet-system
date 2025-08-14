const { z } = require('zod');

const setupWalletSchema = z.object({
  balance: z.number()
    .positive('Balance must be positive')
    .multipleOf(0.0001, 'Balance must have maximum 4 decimal places'),
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
});

const getWalletSchema = z.object({
  id: z.string().uuid('Invalid wallet ID')
});

module.exports = {
  setupWalletSchema,
  getWalletSchema
};