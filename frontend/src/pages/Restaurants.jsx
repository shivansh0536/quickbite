import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Star, MapPin, Clock, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import { RestaurantCardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, [search, cuisine, minRating, sortBy, page]);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (cuisine) params.append('cuisine', cuisine);
            if (minRating) params.append('minRating', minRating);
            if (sortBy) params.append('sortBy', sortBy);
            params.append('page', page);
            params.append('limit', 9);

            const response = await api.get(`/restaurants?${params}`);
            setRestaurants(response.data.restaurants);
            setTotalPages(response.data.pages);
        } catch (error) {
            toast.error('Failed to fetch restaurants');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Restaurants</h1>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search restaurants..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">All Cuisines</option>
                            <option value="Italian">Italian</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Indian">Indian</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Japanese">Japanese</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="newest">Newest</option>
                            <option value="rating">Highest Rated</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <RestaurantCardSkeleton key={index} />
                        ))}
                    </div>
                ) : restaurants.length === 0 ? (
                    <EmptyState
                        icon={UtensilsCrossed}
                        title="No Restaurants Found"
                        description="We couldn't find any restaurants matching your criteria. Try adjusting your filters or search terms."
                        actionLabel="Clear Filters"
                        onAction={() => {
                            setSearch('');
                            setCuisine('');
                            setMinRating('');
                            setSortBy('newest');
                        }}
                    />
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurants.map((restaurant) => (
                                <Link
                                    key={restaurant.id}
                                    to={`/restaurant/${restaurant.id}`}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="h-48 bg-gradient-to-br from-primary-400 to-orange-400 flex items-center justify-center">
                                        {restaurant.imageUrl ? (
                                            <img
                                                src={restaurant.imageUrl}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white text-4xl font-bold">
                                                {restaurant.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {restaurant.description || 'Delicious food awaits!'}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <Star className="text-yellow-500 fill-current" size={16} />
                                                <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MapPin size={16} />
                                                <span className="truncate">{restaurant.cuisine}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8 space-x-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="py-2 px-4 bg-white border border-gray-300 rounded-lg">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Restaurants;
