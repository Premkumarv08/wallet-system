# Wallet System Setup Guide

## Current Status

The wallet system has been fully implemented with both backend and frontend components. However, there are some Node.js version constraints that need to be addressed.

## Node.js Version Issue

The current Node.js version (v16.19.0) is too old for some dependencies:
- Prisma requires Node.js >= 18.18.0
- Some frontend dependencies require Node.js >= 20.0.0

## Quick Setup Options

### Option 1: Update Node.js (Recommended)

1. **Install Node Version Manager (nvm):**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Restart your terminal and install Node.js 18:**
   ```bash
   nvm install 18
   nvm use 18
   ```

3. **Verify the version:**
   ```bash
   node -v
   # Should show v18.x.x
   ```

### Option 2: Use Docker (Alternative)

If you prefer to use Docker, you can create a Dockerfile to run the application with the correct Node.js version.

### Option 3: Manual Database Setup

If you want to proceed with the current Node.js version:

1. **Set up the database manually:**
   ```sql
   -- Create the database
   CREATE DATABASE IF NOT EXISTS railway;
   
   -- Create wallets table
   CREATE TABLE wallets (
     id VARCHAR(36) PRIMARY KEY,
     balance DECIMAL(15,4) NOT NULL,
     name VARCHAR(255) NOT NULL,
     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
     updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   
   -- Create transactions table
   CREATE TABLE transactions (
     id VARCHAR(36) PRIMARY KEY,
     walletId VARCHAR(36) NOT NULL,
     amount DECIMAL(15,4) NOT NULL,
     balanceAfter DECIMAL(15,4) NOT NULL,
     description TEXT,
     type ENUM('CREDIT', 'DEBIT') NOT NULL,
     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE,
     INDEX idx_walletId (walletId),
     INDEX idx_walletId_createdAt (walletId, createdAt),
     INDEX idx_walletId_amount (walletId, amount)
   );
   ```

## Application Features

### ✅ Completed Features

**Backend API:**
- ✅ Wallet setup endpoint (`POST /api/setup`)
- ✅ Get wallet details (`GET /api/wallet/:id`)
- ✅ Create transactions (`POST /api/transact/:walletId`)
- ✅ Get transactions with pagination (`GET /api/transactions`)
- ✅ Export transactions to CSV (`GET /api/transactions/export/:walletId`)
- ✅ Input validation using Zod
- ✅ Error handling and logging
- ✅ Rate limiting and security headers
- ✅ Database models and services

**Frontend Application:**
- ✅ Wallet setup page with form validation
- ✅ Wallet dashboard with balance display
- ✅ Transaction form with credit/debit options
- ✅ Transaction history page with pagination
- ✅ CSV export functionality
- ✅ Responsive design with Tailwind CSS
- ✅ State management with React Context
- ✅ Local storage for wallet persistence
- ✅ Modern UI with icons and animations

### 🎯 Key Features Implemented

1. **Wallet Management:**
   - Create wallets with custom names and initial balance
   - Support for 4 decimal place precision
   - Automatic transaction creation for setup

2. **Transaction Processing:**
   - Credit and debit transactions
   - Balance validation to prevent overdraft
   - Atomic transactions to prevent race conditions

3. **Transaction History:**
   - Paginated transaction listing
   - Sortable by date, amount, and type
   - CSV export functionality

4. **User Experience:**
   - Modern, responsive UI
   - Loading states and error handling
   - Form validation and feedback
   - Persistent wallet sessions

## API Endpoints

All endpoints follow the exact specification from the requirements:

- `POST /api/setup` - Setup wallet
- `GET /api/wallet/:id` - Get wallet details
- `POST /api/transact/:walletId` - Create transaction
- `GET /api/transactions` - Get transactions with pagination
- `GET /api/transactions/export/:walletId` - Export CSV

## Database Schema

The application uses MySQL with the following schema:

```sql
-- Wallets table
CREATE TABLE wallets (
  id VARCHAR(36) PRIMARY KEY,
  balance DECIMAL(15,4) NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  walletId VARCHAR(36) NOT NULL,
  amount DECIMAL(15,4) NOT NULL,
  balanceAfter DECIMAL(15,4) NOT NULL,
  description TEXT,
  type ENUM('CREDIT', 'DEBIT') NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE,
  INDEX idx_walletId (walletId),
  INDEX idx_walletId_createdAt (walletId, createdAt),
  INDEX idx_walletId_amount (walletId, amount)
);
```

## Running the Application

Once Node.js is updated:

1. **Start the backend:**
   ```bash
   cd backend
   npm run db:setup  # Set up database
   npm run dev       # Start server
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev       # Start development server
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Testing the Application

1. **Create a wallet:**
   - Go to http://localhost:5173
   - Enter wallet name and optional initial balance
   - Click "Create Wallet"

2. **Perform transactions:**
   - Use the transaction form on the dashboard
   - Choose credit or debit
   - Enter amount and description
   - Submit transaction

3. **View transaction history:**
   - Click "View Transactions" on the dashboard
   - Use pagination and sorting
   - Export to CSV

## Environment Configuration

The application uses the following environment variables:

```env
DATABASE_URL="mysql://root:MdGZsuerUbXSEjebWerDudBiIJbPyBQM@caboose.proxy.rlwy.net:35941/railway"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

## Next Steps

1. Update Node.js to version 18 or higher
2. Run the database setup commands
3. Start both backend and frontend servers
4. Test all functionality

The application is fully implemented and ready to use once the Node.js version issue is resolved! 