import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Clock, Star, ShieldCheck, Users, ArrowRight, ChevronRight } from 'lucide-react';
import api from '../services/api';
import RatingStars from '../components/RatingStars';
import CuisineTag from '../components/CuisineTag';
import Button from '../components/Button';

const Home = () => {
    const [popularRestaurants, setPopularRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await api.get('/restaurants');
                // Sort by rating (desc) and take top 3
                const sorted = response.data
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3);
                setPopularRestaurants(sorted);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 page-enter">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
                        <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Delicious food</span>{' '}
                                    <span className="block text-primary-600 xl:inline">delivered to you</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Order from your favorite local restaurants and get fresh food delivered to your doorstep in minutes. Experience the taste of convenience.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                                    <div className="rounded-md shadow">
                                        <Link
                                            to="/restaurants"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            Order Now
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <a
                                            href="#features"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all hover:border-gray-300"
                                        >
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-100">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src="/hero-food.png"
                        alt="Delicious gourmet food bowl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent lg:via-white/20"></div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-primary-600">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Trusted by food lovers everywhere
                        </h2>
                        <p className="mt-3 text-xl text-primary-100 sm:mt-4">
                            Join our community of happy customers enjoying the best food delivery service.
                        </p>
                    </div>
                    <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
                        <div className="flex flex-col">
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-100">
                                Active Users
                            </dt>
                            <dd className="order-1 text-5xl font-extrabold text-white">
                                10k+
                            </dd>
                        </div>
                        <div className="flex flex-col mt-10 sm:mt-0">
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-100">
                                Partner Restaurants
                            </dt>
                            <dd className="order-1 text-5xl font-extrabold text-white">
                                500+
                            </dd>
                        </div>
                        <div className="flex flex-col mt-10 sm:mt-0">
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-100">
                                Successful Deliveries
                            </dt>
                            <dd className="order-1 text-5xl font-extrabold text-white">
                                1M+
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Popular Restaurants */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Popular Restaurants</h2>
                        <p className="mt-2 text-gray-600">Top rated by our customers</p>
                    </div>
                    <Link to="/restaurants" className="hidden sm:flex items-center text-primary-600 font-medium hover:text-primary-700">
                        View all <ChevronRight size={20} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {popularRestaurants.map((restaurant) => (
                            <Link
                                key={restaurant.id}
                                to={`/restaurant/${restaurant.id}`}
                                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-sm">
                                        <Star size={14} className="text-yellow-400 fill-current" />
                                        {restaurant.rating.toFixed(1)}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {restaurant.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <CuisineTag cuisine={restaurant.cuisine} />
                                        <span className="text-gray-400 text-sm">•</span>
                                        <span className="text-gray-500 text-sm">{restaurant.deliveryTime} mins</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="truncate">{restaurant.address}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center sm:hidden">
                    <Link to="/restaurants" className="btn-secondary w-full inline-block">
                        View All Restaurants
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why choose QuickBite?</h2>
                        <p className="mt-4 text-xl text-gray-500">We make food delivery seamless and enjoyable</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors duration-300">
                            <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center mb-6 text-primary-600">
                                <Clock size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Super Fast Delivery</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our delivery partners are always nearby, ensuring your food arrives hot and fresh within minutes of ordering.
                            </p>
                        </div>

                        <div className="p-8 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors duration-300">
                            <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center mb-6 text-primary-600">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We prioritize your safety with contactless delivery options and strict hygiene standards for all our restaurant partners.
                            </p>
                        </div>

                        <div className="p-8 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors duration-300">
                            <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center mb-6 text-primary-600">
                                <Users size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our dedicated customer support team is available round the clock to assist you with any queries or concerns.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to start your food journey?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied users who use QuickBite daily for their food cravings. Cancel anytime.
                    </p>
                    <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                        Get Started <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
