import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">QuickBite</h3>
                        <p className="text-sm mb-4">
                            Your favorite food delivered fast. Order from the best restaurants in your area.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="hover:text-primary-500 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                className="hover:text-primary-500 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                className="hover:text-primary-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-primary-500 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/restaurants" className="hover:text-primary-500 transition-colors">
                                    Restaurants
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="hover:text-primary-500 transition-colors">
                                    My Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="hover:text-primary-500 transition-colors">
                                    Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-primary-500 transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-500 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-500 transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-500 transition-colors">
                                    FAQs
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                                <span>123 Food Street, Gourmet City, FC 12345</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="flex-shrink-0" />
                                <a href="tel:+1234567890" className="hover:text-primary-500 transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="flex-shrink-0" />
                                <a href="mailto:support@quickbite.com" className="hover:text-primary-500 transition-colors">
                                    support@quickbite.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                    <p>&copy; {currentYear} QuickBite. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
