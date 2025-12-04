import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, UtensilsCrossed, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <UtensilsCrossed className="text-primary-600" size={32} />
                        <span className="text-2xl font-bold text-gray-900">QuickBite</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t py-4 space-y-3">
                        <Link
                            to="/restaurants"
                            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Restaurants
                        </Link>

                        {user ? (
                            <>
                                {user.role === 'CUSTOMER' && (
                                    <>
                                        <Link
                                            to="/cart"
                                            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Cart
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Orders
                                        </Link>
                                    </>
                                )}

                                {user.role === 'RESTAURANT_OWNER' && (
                                    <Link
                                        to="/dashboard"
                                        className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                {user.role === 'ADMIN' && (
                                    <Link
                                        to="/admin"
                                        className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                )}

                                <Link
                                    to="/profile"
                                    className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile ({user.name})
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-red-600 hover:text-red-800 font-medium py-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
