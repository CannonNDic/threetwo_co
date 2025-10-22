# ThreeTwo Co Backend API

This is a NestJS backend API for the ThreeTwo Co project, featuring JWT authentication, user management, product catalog, cart, and order processing with MongoDB.

## Features

- **JWT Authentication**: Secure login and protected routes.
- **User Management**: Register, login, and manage users.
- **Product Management**: CRUD operations for products, with filtering and pagination.
- **Cart System**: Add, update, and remove items from the cart.
- **Order Processing**: Place orders from cart, manage stock, and view order history.
- **Role-based Access**: Admin and user roles for protected endpoints.
- **MongoDB Integration**: All data is stored in MongoDB using Mongoose.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- npm

### Installation

1. **Clone the repository:**
   ```
   git clone <your-repo-url>
   cd threetwo_co
   ```

2. **Install dependencies:**
   ```
   npm install
   ```
3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following content:
   ```
   MONGO_URI=mongodb://localhost:27017/threetwo_co
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   ```

4. **Run the application:**
   ```
   npm run start:dev
   ```

   The API will be available at `http://localhost:3000`.

## API Endpoints

### Auth

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT token

### Users

- `GET /users` — List users (admin only)
- `GET /users/me` — Get current user profile

### Products

- `GET /products/list` — List products (supports pagination, filtering by name, category, price, stock)
- `POST /products/create` — Create a product (admin only)
- `POST /products/update` — Update a product (admin only)
- `POST /products/delete` — Delete a product (admin only)

### Cart

- `GET /cart` — Get current user's cart
- `POST /cart/add` — Add item to cart
- `POST /cart/remove` — Remove item from cart

### Orders

- `POST /orders/place` — Place an order from cart
- `GET /orders/user` — Get current user's orders
- `GET /orders/all` — Get all orders (admin only)

## Project Structure

```
src/
  ├── auth/
  ├── users/
  ├── products/
  ├── cart/
  ├── orders/
  └── main.ts
```

## Notes

- All protected routes require a JWT token in the `Authorization: Bearer <token>` header.
- Admin-only routes require the user to have the `role: 'admin'`.

## License

MIT