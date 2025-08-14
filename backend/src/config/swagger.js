const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wallet System API',
      version: '1.0.0',
      description: 'A comprehensive API for managing digital wallets and transactions',
      contact: {
        name: 'Wallet System Team',
        email: 'support@walletsystem.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Wallet: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique wallet identifier',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            name: {
              type: 'string',
              description: 'Wallet name',
              example: 'My Personal Wallet'
            },
            balance: {
              type: 'number',
              description: 'Current wallet balance',
              example: 1000.50
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Wallet creation date',
              example: '2024-01-01T00:00:00.000Z'
            }
          },
          required: ['id', 'name', 'balance', 'date']
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique transaction identifier',
              example: '123e4567-e89b-12d3-a456-426614174001'
            },
            walletId: {
              type: 'string',
              description: 'Wallet ID associated with the transaction',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            amount: {
              type: 'number',
              description: 'Transaction amount (positive for credit, negative for debit)',
              example: 100.50
            },
            description: {
              type: 'string',
              description: 'Transaction description',
              example: 'Payment for services'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction date',
              example: '2024-01-01T00:00:00.000Z'
            },
            balance: {
              type: 'number',
              description: 'Wallet balance after transaction',
              example: 1100.00
            }
          },
          required: ['id', 'walletId', 'amount', 'description', 'date', 'balance']
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Wallet not found'
            },
            status: {
              type: 'number',
              description: 'HTTP status code',
              example: 404
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 