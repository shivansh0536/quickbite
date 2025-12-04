import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            await api.patch(`/orders/${orderId}/cancel`);
            toast.success('Order cancelled successfully');
            fetchOrders(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="text-yellow-500" size={20} />;
            case 'PREPARING':
                return <Package className="text-blue-500" size={20} />;
            case 'OUT_FOR_DELIVERY':
                return <Package className="text-purple-500" size={20} />;
            case 'DELIVERED':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'CANCELLED':
                return <XCircle className="text-red-500" size={20} />;
            default:
                return <Clock className="text-gray-500" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'PREPARING':
                return 'bg-blue-100 text-blue-800';
            case 'OUT_FOR_DELIVERY':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="mx-auto text-gray-400 mb-4" size={64} />
                        <p className="text-gray-600 text-lg">No orders yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="card p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{order.restaurant.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()} at{' '}
                                            {new Date(order.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(order.status)}
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Items:</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        {order.items.map((item, index) => (
                                            <li key={index}>
                                                {item.quantity}x {item.name} - ₹{(item.price * item.quantity)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                                    <span className="text-xl font-bold text-primary-600">
                                        ₹{order.totalAmount}
                                    </span>
                                </div>

                                {order.status === 'PENDING' && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
