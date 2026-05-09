# 🖤 NOIR — Fashion Clothing Store

A full-stack fashion e-commerce platform built with **React.js**, **Node.js/Express**, and **MongoDB**.

![NOIR Fashion Store](https://img.shields.io/badge/Status-Production%20Ready-black?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?style=for-the-badge&logo=mongodb)

---

## ✨ Features

- 🛍️ **Product Catalog** — Browse collections with filters (category, price, size, color)
- 🔍 **Search** — Real-time product search
- 🛒 **Shopping Cart** — Add, remove, update quantities
- ❤️ **Wishlist** — Save favorite items
- 👤 **Auth** — JWT-based register/login/logout
- 💳 **Checkout** — Address & order placement
- 📦 **Order History** — Track past orders
- 🔐 **Admin Dashboard** — Manage products, orders, users
- 📱 **Fully Responsive** — Mobile-first design

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Context API, CSS Modules |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + bcryptjs |
| Styling | Custom CSS (no UI library) |
| State | React Context + useReducer |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
fashion-store/
├── frontend/               # React application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level page components
│       ├── context/        # Global state (Cart, Auth, Wishlist)
│       ├── hooks/          # Custom React hooks
│       └── utils/          # Helpers & API calls
├── backend/                # Express REST API
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Auth & error middleware
│   └── config/             # DB connection
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- npm or yarn

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/fashion-store.git
cd fashion-store
```

### 2. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Install & run backend
```bash
cd backend
npm install
npm run dev       # Starts on http://localhost:5000
```

### 4. Install & run frontend
```bash
cd frontend
npm install
npm start         # Starts on http://localhost:3000
```

### 5. Seed the database (optional)
```bash
cd backend
npm run seed      # Adds sample products, categories, admin user
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login & receive JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Cart & Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:itemId` | Update cart item |
| DELETE | `/api/cart/:itemId` | Remove from cart |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get single order |

### Categories & Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/products/:id/reviews` | Add product review |
| GET | `/api/products/:id/reviews` | Get product reviews |

---

## 🌱 Environment Variables

```env
# Backend
PORT=5000
MONGO_URI=mongodb://localhost:27017/fashion-store
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 👑 Admin Access

After seeding:
- **Email:** `admin@noir.com`
- **Password:** `Admin@1234`

---

## 📸 Screenshots

> Add screenshots of your running app here.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT © 2024 NOIR Fashion Store
