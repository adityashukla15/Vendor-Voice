Hey! Backend is almost completed.

GitHub Repository:
<YOUR_GITHUB_REPO_LINK>

Tech Stack
React + Vite
Tailwind CSS
Axios
React Router DOM
React Hook Form
React Hot Toast
Recharts
Lucide React
Backend
Node.js
Express
MongoDB
JWT Authentication (Cookie-based)
REST APIs
Your Task

Please build the frontend using React and integrate it with the backend APIs.

Pages Required
Login
Register + OTP Verification
Dashboard
Customers
Inventory
Ledger
API Integration

Use the backend APIs directly. The backend already handles all business logic.

Authentication:

POST /api/otp/send
POST /api/otp/verify
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

Dashboard:

GET /api/dashboard/overview

Customers:

GET /api/customer/all
POST /api/customer/create
PUT /api/customer/update/:id
DELETE /api/customer/delete/:id
GET /api/customer/search?q=

Inventory:

GET /api/inventory/all
POST /api/inventory/create
PUT /api/inventory/update/:id
DELETE /api/inventory/delete/:id
GET /api/inventory/low-stock

Ledger:

POST /api/ledger/sale
POST /api/ledger/payment
GET /api/ledger/customer/:id
GET /api/ledger/all
Important

Backend runs on:

http://localhost:5000

Frontend should run on:

http://localhost:5173

Use Axios with:

withCredentials: true

because authentication uses JWT cookies.

UI

Keep it clean and modern. The main focus should be:

Dashboard with analytics cards
Customer Management
Inventory Management
Ledger / Transactions
Responsive design

The backend is already ready, so the main work is building the UI and connecting it to the APIs.
