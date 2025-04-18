# 📝 Inventory Management API

A simple and secure Inventory Management REST API built with **Node.js**, **Express**, and **PostgreSQL**. Features include:

- User Authentication (Register/Login)
- JWT-based Protected Routes
- CRUD operations for Tasks
- Swagger API Documentation
- Password and Email validation
- Middleware-based protection
- Pagination and Filtering Functionality

---

## 🔐 Auth APIs

| Method | Endpoint                      | Description         | Access |
| ------ | ----------------------------- | ------------------- | ------ |
| POST   | `/api/v1/auth/register/admin` | Register New Admin  | Public |
| POST   | `/api/v1/auth/register`       | Register New User   | Public |
| POST   | `/api/v1/auth/login`          | Login Existing User | Public |

## 👤 User APIs

> All user APIs are **protected** and require a valid JWT token And Admin Access Only.

| Method | Endpoint            | Description                                                                   |
| ------ | ------------------- | ----------------------------------------------------------------------------- |
| GET    | `/api/v1/users`     | Get all users (with pagination, filtering by first_name, email, phone_number) |
| GET    | `/api/v1/users/:id` | Get user by ID                                                                |
| PATCH  | `/api/v1/users/:id` | Update user by ID                                                             |
| DELETE | `/api/v1/users/:id` | Delete user by ID                                                             |

## ✅ Order APIs

> All Order APIs are **protected** and require a valid JWT token.

| Method | Endpoint             | Description                                           |
| ------ | -------------------- | ----------------------------------------------------- |
| GET    | `/api/v1/orders`     | Get all orders (with pagination, filtering by status) |
| POST   | `/api/v1/orders`     | Create a new task                                     |
| GET    | `/api/v1/orders/:id` | Get a specific task by ID                             |
| PATCH  | `/api/v1/orders/:id` | Update task by ID                                     |
| DELETE | `/api/v1/orders/:id` | Delete task by ID                                     |

## ✅ Stocks APIs

> All Stocks APIs are **protected** and require a valid JWT token And Admin Access Only.

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| GET    | `/api/v1/stocks`     | Get all stocks (with pagination) |
| POST   | `/api/v1/stocks`     | Create a new task                |
| GET    | `/api/v1/stocks/:id` | Get a specific task by ID        |
| PATCH  | `/api/v1/stocks/:id` | Update task by ID                |
| DELETE | `/api/v1/stocks/:id` | Delete task by ID                |

## ✅ Products APIs

> All Products APIs are **protected** and require a valid JWT token And Admin Access Only.

| Method | Endpoint               | Description                                                         |
| ------ | ---------------------- | ------------------------------------------------------------------- |
| GET    | `/api/v1/products`     | Get all products (with pagination, filtering by name, price, stock) |
| POST   | `/api/v1/products`     | Create a new task                                                   |
| GET    | `/api/v1/products/:id` | Get a specific task by ID                                           |
| PATCH  | `/api/v1/products/:id` | Update task by ID                                                   |
| DELETE | `/api/v1/products/:id` | Delete task by ID                                                   |

## ✅ Warehouses APIs

> All Warehouses APIs are **protected** and require a valid JWT token And Admin Access Only.

| Method | Endpoint                 | Description                                             |
| ------ | -----------------------  | ------------------------------------------------------- |
| GET    | `/api/v1/warehouses`     | Get all warehouses (with pagination, filtering by name) |
| POST   | `/api/v1/warehouses`     | Create a new task                                       |
| GET    | `/api/v1/warehouses/:id` | Get a specific task by ID                               |
| PATCH  | `/api/v1/warehouses/:id` | Update task by ID                                       |
| DELETE | `/api/v1/warehouses/:id` | Delete task by ID                                       |

## 📄 Swagger Docs

All endpoints are documented using Swagger. To view the API docs, visit:

`http://localhost:3000/api-docs`

## 🛠️ Tech Stack

- Node.js
- Express.js
- PostgreSQL with Sequelize
- JWT for authentication
- Swagger for documentation

## 📦 Installation

```bash
git clone https://github.com/sagar2535/inventory-management.git
cd inventory-management
npm install
```

## 🔐 Envoriment Variables

NODE_ENV=devlopment

PORT=3000

JWT_SECRET=this is the super secretkey

JWT_EXPIRES_IN=1d

DATABASE_URL=your PGSQL database url
