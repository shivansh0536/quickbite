# QuickBite Backend

This is the backend for the QuickBite food delivery platform, built with Node.js, Express, and Prisma (MongoDB).

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory with the following variables:
    ```env
    DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/quickbite?retryWrites=true&w=majority"
    JWT_SECRET="your_super_secret_key"
    PORT=5000
    ```

3.  **Prisma Setup**
    Generate the Prisma client:
    ```bash
    npx prisma generate
    ```

4.  **Run the Server**
    - Development:
      ```bash
      npm run dev
      ```
    - Production:
      ```bash
      npm start
      ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Restaurants
- `GET /api/restaurants` - Get all restaurants (supports `?search=` and `?cuisine=`)
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (Owner/Admin)
- `PUT /api/restaurants/:id` - Update restaurant (Owner/Admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (Owner/Admin)

### Menu
- `GET /api/menu/restaurant/:restaurantId` - Get menu for a restaurant
- `POST /api/menu` - Add menu item (Owner/Admin)
- `PUT /api/menu/:id` - Update menu item (Owner/Admin)
- `DELETE /api/menu/:id` - Delete menu item (Owner/Admin)

### Orders
- `POST /api/orders` - Place an order (Customer)
- `GET /api/orders` - Get user's orders (Customer) or restaurant's orders (Owner)
- `PATCH /api/orders/:id/status` - Update order status (Owner/Admin)
