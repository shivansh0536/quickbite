import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Star, MapPin, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

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
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Restaurant not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                            <p className="text-gray-600 mb-4">{restaurant.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <Star className="text-yellow-500 fill-current" size={18} />
                                    <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MapPin size={18} />
                                    <span>{restaurant.cuisine}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">Menu</h2>

                {menuItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No menu items available</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map((item) => (
                            <div key={item.id} className="card p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                            {item.description}
                                        </p>
                                        <p className="text-primary-600 font-bold text-lg">
                                            ₹{item.price}
                                        </p>
                                    </div>
                                    {item.imageUrl && (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg ml-3"
                                        />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {item.category}
                                    </span>
                                    {item.isAvailable ? (
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="btn-primary py-1 px-3 text-sm flex items-center space-x-1"
                                        >
                                            <Plus size={16} />
                                            <span>Add</span>
                                        </button>
                                    ) : (
                                        <span className="text-red-500 text-sm font-medium">Unavailable</span>
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
