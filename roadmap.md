# 🚀 Vendor-Voice Frontend Roadmap (React.js)

## Tech Stack

* React.js (Vite)
* React Router DOM
* Tailwind CSS
* Axios
* React Hook Form
* React Hot Toast
* Recharts
* Framer Motion
* React Icons
* Zustand/Context API (Global State)

---

# Phase 1: Project Setup

* Create React + Vite project
* Install Tailwind CSS
* Configure React Router
* Setup Axios instance
* Setup environment variables
* Create reusable folder structure

```
src/
 ├── assets/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── hooks/
 ├── services/
 ├── context/
 ├── utils/
 ├── routes/
 ├── styles/
 └── App.jsx
```

---

# Phase 2: Authentication

### Pages

* Login
* Register
* Forgot Password (optional)
* Protected Route

### Features

* JWT Authentication
* Store token
* Auto login
* Logout
* User profile

---

# Phase 3: Dashboard

After login

Cards:

* Total Balance
* Total Credit
* Total Debit
* Inventory Items
* Pending Payments

Charts:

* Income vs Expense
* Category Distribution
* Weekly Transactions

Recent Activity

* Latest transactions
* Recent reminders

---

# Phase 4: Ledger Module

Pages

### Ledger List

* Search
* Filter
* Pagination

### Add Transaction

Fields:

* Customer Name
* Amount
* Credit/Debit
* Category
* Date
* Notes

### Edit Transaction

### Delete Transaction

---

# Phase 5: Voice Transaction

Voice Recording Component

Features

* Start Recording
* Stop Recording
* Upload Audio
* Display Transcript
* AI Generated Fields Preview
* Confirm & Save

Flow

Voice
↓

Speech to Text
↓

Gemma Extraction
↓

Preview
↓

Save Transaction

---

# Phase 6: Inventory Module

Inventory List

Features

* Search
* Filter
* Sort

Add Item

Fields

* Product Name
* Quantity
* Unit
* Buying Price
* Selling Price
* Low Stock Limit

Edit Item

Delete Item

Inventory Statistics

---

# Phase 7: Smart Inventory Suggestions

AI Suggestions Page

Display

* Low Stock
* Frequently Sold Items
* Restock Suggestions
* Weekly Trends

---

# Phase 8: Payment Reminder Module

Reminder List

Features

* Upcoming Payments
* Overdue Payments
* Paid History

Reminder Card

* Customer
* Amount
* Due Date
* Status

Buttons

* Send Reminder
* Mark Paid

---

# Phase 9: Analytics

Charts

* Monthly Income
* Monthly Expense
* Profit
* Category Breakdown
* Inventory Trend
* Cash Flow

---

# Phase 10: Profile

Pages

* User Information
* Change Password
* Language Selection
* Logout

---

# Phase 11: Responsive Design

Support

* Mobile
* Tablet
* Desktop

---

# Phase 12: UI Components

Reusable Components

* Navbar
* Sidebar
* Dashboard Cards
* Buttons
* Inputs
* Modal
* Loader
* Empty State
* Toast Notifications
* Voice Recorder
* Chart Components
* Table Component
* Pagination
* Search Bar
* Confirmation Dialog

---

# API Integration

### Auth

* Register
* Login
* Logout
* Get Profile

### Ledger

* Get Transactions
* Add Transaction
* Update Transaction
* Delete Transaction

### Inventory

* Get Items
* Add Item
* Update Item
* Delete Item

### AI

* Upload Voice
* Get Transcript
* Extract Entities
* Categorize Transaction
* Inventory Suggestions

### Reminder

* Get Reminders
* Create Reminder
* Mark Paid

### Dashboard

* Summary
* Analytics

---

# Folder Structure

```
src
│
├── assets
├── components
│   ├── common
│   ├── charts
│   ├── forms
│   ├── layout
│   ├── ledger
│   ├── inventory
│   ├── reminders
│   └── voice
│
├── pages
│   ├── auth
│   ├── dashboard
│   ├── ledger
│   ├── inventory
│   ├── reminders
│   ├── analytics
│   └── profile
│
├── services
│   ├── api.js
│   ├── authApi.js
│   ├── ledgerApi.js
│   ├── inventoryApi.js
│   ├── reminderApi.js
│   └── aiApi.js
│
├── hooks
├── context
├── routes
├── utils
└── App.jsx
```

---

# Final UI Screens

1. Splash Screen
2. Login
3. Register
4. Dashboard
5. Ledger
6. Add Transaction
7. Voice Transaction
8. Inventory
9. Add Inventory
10. AI Suggestions
11. Payment Reminders
12. Analytics
13. Profile
14. Settings

---

# Priority Order (1-Day Hackathon)

1. Project Setup
2. Authentication
3. Dashboard
4. Ledger CRUD
5. Voice Transaction UI
6. Inventory CRUD
7. Payment Reminder UI
8. Analytics
9. Profile
10. Responsive Design & Final Polish

**Goal:** Deliver a clean, responsive MVP where vendors can log in, add transactions manually or via voice, manage inventory, view analytics, and receive AI-powered payment and inventory insights.
