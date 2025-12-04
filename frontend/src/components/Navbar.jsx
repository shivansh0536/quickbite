import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, UtensilsCrossed } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <UtensilsCrossed className="text-primary-600" size={32} />
                        <span className="text-2xl font-bold text-gray-900">QuickBite</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link to="/restaurants" className="text-gray-700 hover:text-primary-600 font-medium">
                            Restaurants
                        </Link>

                        {user ? (
                            <>
                                {user.role === 'CUSTOMER' && (
                                    <>
                                        <Link to="/cart" className="text-gray-700 hover:text-primary-600">
                                            <ShoppingCart size={24} />
                                        </Link>
                                        <Link to="/orders" className="text-gray-700 hover:text-primary-600 font-medium">
                                            Orders
                                        </Link>
                                    </>
                                )}

                                {user.role === 'RESTAURANT_OWNER' && (
                                    <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                                        Dashboard
                                    </Link>
                                )}

                                {user.role === 'ADMIN' && (
                                    <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
                                        Admin
                                    </Link>
                                )}

                                <div className="flex items-center space-x-3">
                                    <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                                        <User size={20} />
                                        <span className="font-medium">{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="text-gray-700 hover:text-red-600"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
