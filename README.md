# Wallet System - Full Stack Application

A complete wallet management system with backend API and frontend web application supporting wallet setup, credit/debit transactions, transaction history, and CSV export functionality.

## Features

### Backend API
- **Wallet Management**: Setup new wallets with initial balance
- **Transaction Processing**: Credit and debit transactions with balance validation
- **Transaction History**: Fetch transactions with pagination and sorting
- **CSV Export**: Export transaction history to CSV format
- **Database**: MySQL with Prisma ORM
- **Validation**: Request validation using Zod
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Rate limiting, CORS, and Helmet security headers

### Frontend Application
- **Wallet Setup**: Create new wallets with name and initial balance
- **Dashboard**: View wallet balance and perform transactions
- **Transaction History**: View all transactions with pagination and sorting
- **CSV Export**: Download transaction history as CSV
- **Responsive Design**: Modern UI with Tailwind CSS
- **State Management**: React Context for wallet state
- **Local Storage**: Persist wallet ID across sessions

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **Prisma** ORM
- **Zod** validation
- **Winston** logging
- **CORS** and **Helmet** security

### Frontend
- **React** 19 with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

## Prerequisites

- Node.js (v18 or higher recommended)
- MySQL database
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd wallet-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Environment Configuration
Create a `.env` file in the backend directory:
```env
DATABASE_URL="mysql://username:password@localhost:3306/wallet_db"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:3000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### 1. Setup Wallet
**POST** `/setup`

Create a new wallet with initial balance.

**Request Body:**
```json
{
  "balance": 20.5612,
  "name": "My Wallet"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Wallet created successfully",
  "data": {
    "id": "uuid",
    "balance": 20.5612,
    "transactionId": "uuid",
    "name": "My Wallet",
    "date": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get Wallet Details
**GET** `/wallet/:id`

Get wallet information by ID.

**Response:**
```json
{
  "status": "success",
  "message": "Wallet retrieved successfully",
  "data": {
    "id": "uuid",
    "balance": 30.0000,
    "name": "My Wallet",
    "date": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Transaction
**POST** `/transact/:walletId`

Create a credit or debit transaction.

**Request Body:**
```json
{
  "amount": 10.5000,
  "description": "Recharge"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Transaction completed successfully",
  "data": {
    "balance": 40.5000,
    "transactionId": "uuid"
  }
}
```

### 4. Get Transactions
**GET** `/transactions?walletId=uuid&skip=0&limit=10`

Get paginated transaction history.

**Query Parameters:**
- `walletId` (required): Wallet ID
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Number of records to return (default: 10, max: 100)

**Response:**
```json
{
  "status": "success",
  "message": "Transactions retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "walletId": "uuid",
      "amount": 10.5000,
      "balance": 40.5000,
      "description": "Recharge",
      "date": "2024-01-01T00:00:00.000Z",
      "type": "CREDIT"
    }
  ]
}
```

### 5. Export Transactions CSV
**GET** `/transactions/export/:walletId`

Export all transactions for a wallet as CSV.

**Response:** CSV file download

## Database Schema

### Wallet Table
```sql
CREATE TABLE wallets (
  id VARCHAR(36) PRIMARY KEY,
  balance DECIMAL(15,4) NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Transaction Table
```sql
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

## Features in Detail

### Wallet Setup
- Create new wallets with custom names
- Set initial balance (supports 4 decimal places)
- Automatic transaction creation for setup
- Wallet ID persistence in localStorage

### Transaction Processing
- Credit transactions (positive amounts)
- Debit transactions (negative amounts)
- Balance validation to prevent overdraft
- Atomic transactions to prevent race conditions
- 4 decimal place precision for amounts

### Transaction History
- Paginated transaction listing
- Sortable by date, amount, and type
- Real-time balance updates
- CSV export functionality
- Responsive table design

### Security Features
- Input validation using Zod schemas
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- Comprehensive error handling

### User Experience
- Modern, responsive UI
- Loading states and error handling
- Form validation and feedback
- Smooth navigation between pages
- Persistent wallet sessions

## Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: 400 Bad Request with field-specific messages
- **Not Found**: 404 for missing wallets
- **Insufficient Balance**: 400 for debit transactions exceeding balance
- **Rate Limiting**: 429 Too Many Requests
- **Server Errors**: 500 Internal Server Error

## Development

### Project Structure
```
wallet-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── validators/      # Request validation
│   ├── prisma/              # Database schema
│   └── logs/                # Application logs
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   └── services/        # API services
│   └── public/              # Static assets
└── docs/                    # Documentation
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

### Backend Deployment
1. Set environment variables for production
2. Run database migrations
3. Build and start the application

### Frontend Deployment
1. Update API base URL for production
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 