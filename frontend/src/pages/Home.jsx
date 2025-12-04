import { Link } from 'react-router-dom';
import { Search, TrendingUp, Clock } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-orange-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Delicious Food, Delivered Fast
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Order from your favorite restaurants and get it delivered to your doorstep
                        </p>
                        <Link
                            to="/restaurants"
                            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                        >
                            Browse Restaurants
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-primary-600" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Easy to Order</h3>
                        <p className="text-gray-600">
                            Browse menus, read reviews, and order your favorite meals in just a few clicks
                        </p>
                    </div>

                    <div className="text-center p-6">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="text-primary-600" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                        <p className="text-gray-600">
                            Get your food delivered hot and fresh within 30-45 minutes
                        </p>
                    </div>

                    <div className="text-center p-6">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="text-primary-600" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
                        <p className="text-gray-600">
                            We partner with the best restaurants to ensure top-quality meals
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
                    <p className="text-gray-600 mb-8">
                        Join thousands of happy customers enjoying delicious food
                    </p>
                    <Link to="/restaurants" className="btn-primary text-lg px-8 py-3">
                        Start Ordering Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
