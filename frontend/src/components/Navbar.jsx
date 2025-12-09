import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, UtensilsCrossed, Menu, X, ShieldCheck } from 'lucide-react';
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

                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu Backdrop */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Mobile Menu Slide-over */}
                <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center p-4 border-b">
                            <span className="text-xl font-bold text-gray-900">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                            <Link
                                to="/restaurants"
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <UtensilsCrossed size={20} />
                                Restaurants
                            </Link>

                            {user ? (
                                <>
                                    {user.role === 'CUSTOMER' && (
                                        <>
                                            <Link
                                                to="/cart"
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors font-medium"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <ShoppingCart size={20} />
                                                Cart
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors font-medium"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <div className="relative">
                                                    <div className="w-5 h-5 border-2 border-current rounded opacity-40"></div>
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-0.5 bg-current rounded-full"></div>
                                                </div>
                                                Orders
                                            </Link>
                                        </>
                                    )}

                                    {user.role === 'RESTAURANT_OWNER' && (
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center">
                                                <div className="w-1 h-1 bg-current rounded-full"></div>
                                            </div>
                                            Dashboard
                                        </Link>
                                    )}

                                    {user.role === 'ADMIN' && (
                                        <Link
                                            to="/admin"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <ShieldCheck size={20} />
                                            Admin
                                        </Link>
                                    )}

                                    <div className="my-2 border-t border-gray-100"></div>

                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User size={20} />
                                        Profile ({user.name.split(' ')[0]})
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-left"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="my-2 border-t border-gray-100"></div>
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User size={20} />
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex items-center gap-3 px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User size={20} />
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
