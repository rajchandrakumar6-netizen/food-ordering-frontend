# 🍕 Food Ordering System - Frontend

A responsive frontend application for an Online Food Ordering platform built with React, TypeScript, and Tailwind CSS.

## 📋 Project Info

- **Course:** CMJD - Comprehensive Master Java Developer
- **Batch:** 112/113
- **Assignment:** Frontend Development with React

## 🛠️ Tech Stack

- React 18
- TypeScript
- React Router DOM
- Axios
- Tailwind CSS
- Vite

## ✨ Features

### Customer
- Register and Login
- Browse food menu
- Filter by category
- Add items to cart
- Update cart quantities
- Remove items from cart
- Place orders
- View order history

### Admin
- Manage categories (add, delete)
- Manage food items (add, delete, toggle status)
- View all orders

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Backend API running on port 8080

### Setup

1. Clone the repository
```bash
git clone https://github.com/rajchandrakumar6-netizen/food-ordering-frontend.git
cd food-ordering-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

App runs on `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/      # Reusable components (Navbar)
├── context/         # Auth context
├── pages/           # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── FoodsPage.tsx
│   ├── CartPage.tsx
│   ├── OrdersPage.tsx
│   └── AdminPage.tsx
├── services/        # API service (Axios)
└── types/           # TypeScript interfaces
```

## 🔐 Authentication

- JWT tokens stored in localStorage
- Protected routes redirect to login
- Role-based navigation (Admin vs Customer)

## 🔗 Backend

Make sure the backend is running before starting the frontend.

Backend repository: https://github.com/rajchandrakumar6-netizen/food-ordering-backend
