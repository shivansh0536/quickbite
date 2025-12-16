import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Store, Package, Menu, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('restaurants');
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'create', 'edit'
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'users':
                    const usersRes = await api.get('/users');
                    setUsers(usersRes.data);
                    break;
                case 'restaurants':
                    const restaurantsRes = await api.get('/restaurants?limit=100');
                    setRestaurants(restaurantsRes.data.restaurants);
                    break;
                case 'orders':
                    const ordersRes = await api.get('/orders');
                    setOrders(ordersRes.data);
                    break;
                case 'menu':
                    const allRestaurants = await api.get('/restaurants?limit=100');
                    const allMenuItems = [];
                    for (const restaurant of allRestaurants.data.restaurants) {
                        const menuRes = await api.get(`/menu/restaurant/${restaurant.id}`);
                        allMenuItems.push(...menuRes.data.map(item => ({
                            ...item,
                            restaurantName: restaurant.name
                        })));
                    }
                    setMenuItems(allMenuItems);
                    break;
            }
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            switch (type) {
                case 'user':
                    await api.delete(`/users/${id}`);
                    toast.success('User deleted');
                    break;
                case 'restaurant':
                    await api.delete(`/restaurants/${id}`);
                    toast.success('Restaurant deleted');
                    break;
                case 'order':
                    await api.delete(`/orders/${id}`);
                    toast.success('Order deleted');
                    break;
                case 'menu':
                    await api.delete(`/menu/${id}`);
                    toast.success('Menu item deleted');
                    break;
            }
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated');
            fetchData();
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const tabs = [
        { id: 'restaurants', label: 'Restaurants', icon: Store },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'menu', label: 'Menu Items', icon: Menu },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 transition-colors duration-300">
                    <div className="flex border-b dark:border-gray-700 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-4 sm:px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'restaurants' && (
                                <RestaurantsTab
                                    restaurants={restaurants}
                                    onDelete={(id) => handleDelete('restaurant', id)}
                                    onRefresh={fetchData}
                                />
                            )}
                            {activeTab === 'users' && (
                                <UsersTab
                                    users={users}
                                    onDelete={(id) => handleDelete('user', id)}
                                    onRefresh={fetchData}
                                />
                            )}
                            {activeTab === 'orders' && (
                                <OrdersTab
                                    orders={orders}
                                    onDelete={(id) => handleDelete('order', id)}
                                    onUpdateStatus={handleUpdateOrderStatus}
                                />
                            )}
                            {activeTab === 'menu' && (
                                <MenuTab
                                    menuItems={menuItems}
                                    onDelete={(id) => handleDelete('menu', id)}
                                    onRefresh={fetchData}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Restaurants Tab Component
const RestaurantsTab = ({ restaurants, onDelete, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cuisine: '',
        address: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/restaurants', formData);
            toast.success('Restaurant created successfully');
            setShowModal(false);
            setFormData({ name: '', description: '', cuisine: '', address: '', imageUrl: '' });
            onRefresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create restaurant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Restaurants ({restaurants.length})</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>Add Restaurant</span>
                </button>
            </div>
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cuisine</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {restaurants.map((restaurant) => (
                            <tr key={restaurant.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{restaurant.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{restaurant.cuisine}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">{restaurant.rating.toFixed(1)}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{restaurant.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onDelete(restaurant.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4">
                {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{restaurant.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.cuisine}</p>
                            </div>
                            <button
                                onClick={() => onDelete(restaurant.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-2"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>Rating: {restaurant.rating.toFixed(1)} ⭐</p>
                            <p className="mt-1">{restaurant.address}</p>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Restaurant</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Restaurant Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Cuisine *
                                </label>
                                <input
                                    type="text"
                                    value={formData.cuisine}
                                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="e.g., Italian, Chinese, Indian"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Address *
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Restaurant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Users Tab Component
const UsersTab = ({ users, onDelete, onRefresh }) => {
    const [editingUser, setEditingUser] = useState(null);

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await api.patch(`/users/${userId}`, { role: newRole });
            toast.success('User role updated');
            onRefresh();
            setEditingUser(null);
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users ({users.length})</h2>
            </div>
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingUser === user.id ? (
                                        <select
                                            defaultValue={user.role}
                                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                            className="input-field py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        >
                                            <option value="CUSTOMER">Customer</option>
                                            <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    ) : (
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {user.role}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{user.phone || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <button
                                        onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {users.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.phone || 'No phone'}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(user.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        {editingUser === user.id ? (
                            <select
                                defaultValue={user.role}
                                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                className="input-field w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                {user.role}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Orders Tab Component
const OrdersTab = ({ orders, onDelete, onUpdateStatus }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Orders ({orders.length})</h2>
            </div>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{order.restaurant.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Customer: {order.user.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary-600 dark:text-primary-400">₹{order.totalAmount}</p>
                                <select
                                    value={order.status}
                                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                                    className="input-field mt-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PREPARING">Preparing</option>
                                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="border-t dark:border-gray-700 pt-2 mt-2">
                            <p className="text-sm font-medium mb-1 text-gray-900 dark:text-white">Items:</p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400">
                                {order.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.quantity}x {item.name} - ₹{(item.price * item.quantity)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={() => onDelete(order.id)}
                            className="mt-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                            Delete Order
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Menu Tab Component
const MenuTab = ({ menuItems, onDelete, onRefresh }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Menu Items ({menuItems.length})</h2>
            </div>
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Restaurant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Available</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {menuItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{item.restaurantName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">₹{item.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                        }`}>
                                        {item.isAvailable ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {menuItems.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.restaurantName}</p>
                            </div>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-2"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="font-semibold text-primary-600 dark:text-primary-400">₹{item.price}</span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                {item.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
