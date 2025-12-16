import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { MapPin, Plus, Info, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { MenuItemSkeleton } from '../components/Skeleton';
import RatingStars from '../components/RatingStars';
import CuisineTag from '../components/CuisineTag';
import AddToCartButton from '../components/AddToCartButton';

const RestaurantMenu = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurantDetails();
    }, [id]);

    const fetchRestaurantDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/restaurants/${id}`);
            setRestaurant(response.data);
            setMenuItems(response.data.menuItems || []);
        } catch (error) {
            toast.error('Failed to fetch restaurant details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        addToCart(item, restaurant.id, restaurant.name);
        toast.success(`Added ${item.name} to cart`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors duration-300">
                <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="flex space-x-4">
                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <MenuItemSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 font-medium text-lg">Restaurant not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Restaurant Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{restaurant.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">{restaurant.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-600">
                                    <RatingStars rating={restaurant.rating} />
                                    <span className="font-semibold text-gray-900 dark:text-gray-200">{restaurant.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-600">
                                    <MapPin size={16} className="text-gray-400 dark:text-gray-500" />
                                    <span className="font-medium">{restaurant.address}</span>
                                </div>
                                <CuisineTag cuisine={restaurant.cuisine} className="px-3 py-1.5 text-sm" />
                            </div>
                        </div>
                        {restaurant.imageUrl && (
                            <div className="w-full md:w-48 h-32 md:h-48 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                                <img
                                    src={restaurant.imageUrl}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h2>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{menuItems.length} items</span>
                </div>

                {menuItems.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="bg-gray-50 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No menu items available</h3>
                        <p className="text-gray-500 dark:text-gray-400">This restaurant hasn't added their menu yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {item.name}
                                            </h3>
                                            <span className="font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                                                ₹{item.price}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                {item.category}
                                            </span>
                                            {item.isVeg !== undefined && (
                                                <span className={`w-4 h-4 border border-green-600 flex items-center justify-center flex-shrink-0 ${item.isVeg ? '' : 'border-red-600'}`}>
                                                    <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>

                                        {item.isAvailable ? (
                                            <AddToCartButton onClick={() => handleAddToCart(item)} />
                                        ) : (
                                            <span className="text-sm font-medium text-red-500 bg-red-50 px-3 py-1.5 rounded-lg inline-block">
                                                Sold Out
                                            </span>
                                        )}
                                    </div>
                                    {item.imageUrl && (
                                        <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantMenu;
