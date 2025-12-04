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
                    // Get all menu items from all restaurants
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex border-b">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                                        ? 'border-b-2 border-primary-600 text-primary-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
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
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Restaurants ({restaurants.length})</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuisine</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {restaurants.map((restaurant) => (
                            <tr key={restaurant.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{restaurant.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{restaurant.cuisine}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{restaurant.rating.toFixed(1)}</td>
                                <td className="px-6 py-4">{restaurant.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onDelete(restaurant.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
                <h2 className="text-xl font-semibold">Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingUser === user.id ? (
                                        <select
                                            defaultValue={user.role}
                                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                            className="input-field py-1"
                                        >
                                            <option value="CUSTOMER">Customer</option>
                                            <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    ) : (
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                            {user.role}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.phone || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <button
                                        onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Orders Tab Component
const OrdersTab = ({ orders, onDelete, onUpdateStatus }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Orders ({orders.length})</h2>
            </div>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold">{order.restaurant.name}</h3>
                                <p className="text-sm text-gray-600">Customer: {order.user.name}</p>
                                <p className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary-600">₹{order.totalAmount}</p>
                                <select
                                    value={order.status}
                                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                                    className="input-field mt-2 text-sm"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PREPARING">Preparing</option>
                                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <p className="text-sm font-medium mb-1">Items:</p>
                            <ul className="text-sm text-gray-600">
                                {order.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.quantity}x {item.name} - ₹{(item.price * item.quantity)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={() => onDelete(order.id)}
                            className="mt-2 text-red-600 hover:text-red-900 text-sm"
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
                <h2 className="text-xl font-semibold">Menu Items ({menuItems.length})</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {menuItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.restaurantName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">₹{item.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {item.isAvailable ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
