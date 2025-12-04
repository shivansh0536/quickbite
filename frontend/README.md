# QuickBite Frontend

This is the frontend for the QuickBite food delivery platform, built with React, Vite, and Tailwind CSS.

## Tech Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`

4.  **Build for Production**
    ```bash
    npm run build
    ```

## Features

### Customer Features
- Browse restaurants with search and filter
- View restaurant menus
- Add items to cart
- Place orders
- Track order status
- View order history

### Authentication
- User registration with role selection (Customer/Restaurant Owner)
- JWT-based authentication
- Protected routes based on user roles

## Project Structure
```
src/
├── components/       # Reusable components (Navbar, ProtectedRoute)
├── context/          # Context providers (Auth, Cart)
├── pages/            # Page components
├── services/         # API client configuration
└── utils/            # Utility functions
```

## Available Routes
- `/` - Home page
- `/restaurants` - Restaurant listing
- `/restaurant/:id` - Restaurant menu
- `/cart` - Shopping cart (Customer only)
- `/orders` - Order history (Customer only)
- `/login` - Login page
- `/register` - Registration page
