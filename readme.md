# Vendor Voice

> AI-powered retail operations platform for modern shop owners.

Vendor Voice is a full-stack business management application designed to help small retailers manage customers, inventory, transactions, and day-to-day operations from a single dashboard. It combines a premium UI with AI-assisted workflows and voice-based transaction capture to reduce manual bookkeeping.

## Live Demo

- Frontend: https://vendor-voice.vercel.app
- API: https://vendor-voice.onrender.com

## Why this project exists

Running a shop often means juggling multiple tools for sales, dues, stock, and customer follow-ups. Vendor Voice brings these workflows into one place so merchants can focus on growth instead of repetitive admin work.

## Key Features

### 1. Smart dashboard
The overview page gives merchants a quick picture of business health with:
- total customers
- products in stock
- outstanding balances
- today’s sales
- low-stock alerts

### 2. Inventory management
Manage stock with a dedicated inventory module that supports:
- adding and editing products
- updating prices and quantities
- setting low-stock thresholds
- searching inventory quickly
- removing outdated entries

### 3. Customer management
Keep a clean record of every customer with:
- customer names and contact details
- address information
- outstanding balance tracking
- WhatsApp reminders for pending dues

### 4. Transactions and ledger flow
Record and review sales and payments through a simple transaction workflow:
- create sales entries
- create payment entries
- view recent transaction history
- keep customer balances in sync

### 5. AI assistant workspace
The AI workspace lets users process transaction notes using either text or voice input. The system can interpret plain-language instructions and prepare a transaction preview for confirmation.

### 6. Voice capture
Users can speak naturally into the app and have their note converted into a structured transaction action. This is especially useful for quick store-side data entry.

### 7. Authentication and security
The app includes:
- user registration and login
- OTP verification flow
- protected routes
- JWT-based authentication with cookie support

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Framer Motion
- Axios
- React Hot Toast
- Lucide icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for OTP/email flows
- Gemini AI integration for smart transaction processing

## Project Structure

- frontend/ — React app, pages, services, layout, and auth context
- backend/ — Express API, controllers, services, models, routes, and middleware
- readme.md — project overview and setup guide

## Getting Started

### Prerequisites
Make sure you have:
- Node.js 18 or newer
- npm or pnpm
- a MongoDB database
- a Gemini API key

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Vendor-Voice
```

### 2. Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configure environment variables
Create a `.env` file inside the backend folder with values for:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

### 4. Run the app
Start the backend:
```bash
cd backend
npm run dev
```

Start the frontend:
```bash
cd frontend
npm run dev
```

The frontend will usually run on http://localhost:5173 and the backend on http://localhost:3000.

## Notes for local use

- Voice features require microphone access in the browser.
- AI processing depends on your Gemini API configuration.
- OTP/email features require valid SMTP credentials.

## Summary

Vendor Voice is built for shop owners who want an elegant, modern way to manage sales, inventory, customers, and AI-assisted workflows without switching between many apps.
