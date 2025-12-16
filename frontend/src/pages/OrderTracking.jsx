import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';

import TrackingSkeleton from '../components/TrackingSkeleton';

const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderTracking = async () => {
            try {
                console.log('Fetching order tracking for ID:', id);
                const response = await api.get(`/orders/${id}/track`);
                console.log('Order tracking response:', response.data);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order tracking:', error);
                console.error('Error response:', error.response?.data);
                toast.error(error.response?.data?.message || 'Failed to fetch order details');
                navigate('/orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderTracking();
    }, [id, navigate]);

    const getStatusStep = (status) => {
        const steps = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
        return steps.indexOf(status);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-yellow-500',
            PREPARING: 'bg-blue-500',
            OUT_FOR_DELIVERY: 'bg-purple-500',
            DELIVERED: 'bg-green-500',
            CANCELLED: 'bg-red-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const getStatusIcon = (status) => {
        const icons = {
            PENDING: Clock,
            PREPARING: Package,
            OUT_FOR_DELIVERY: Truck,
            DELIVERED: CheckCircle
        };
        return icons[status] || Clock;
    };

    if (loading) {
        return <TrackingSkeleton />;
    }

    if (!order) {
        return null;
    }

    const currentStep = getStatusStep(order.status);
    const steps = [
        { name: 'Order Placed', status: 'PENDING', icon: Clock },
        { name: 'Preparing', status: 'PREPARING', icon: Package },
        { name: 'Out for Delivery', status: 'OUT_FOR_DELIVERY', icon: Truck },
        { name: 'Delivered', status: 'DELIVERED', icon: CheckCircle }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 page-enter transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Orders
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Tracking</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Order ID: {order.id.slice(-8)}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-white font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                        </span>
                    </div>

                    {order.status !== 'CANCELLED' && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                {steps.map((step, index) => {
                                    const StepIcon = step.icon;
                                    const isCompleted = index <= currentStep;
                                    const isCurrent = index === currentStep;

                                    return (
                                        <div key={step.status} className="flex-1 relative">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                                    } ${isCurrent ? 'ring-4 ring-primary-200 dark:ring-primary-900/50' : ''}`}>
                                                    <StepIcon size={24} />
                                                </div>
                                                <p className={`mt-2 text-sm font-medium text-center ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                                                    }`}>
                                                    {step.name}
                                                </p>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className={`absolute top-6 left-1/2 w-full h-1 ${index < currentStep ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                                                    }`} style={{ zIndex: -1 }}></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {order.estimatedDeliveryTime && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-6 transition-colors">
                            <div className="flex items-center">
                                <Clock className="text-primary-600 dark:text-primary-400 mr-3" size={24} />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Estimated Delivery</p>
                                    <p className="text-gray-600 dark:text-gray-400">{formatDate(order.estimatedDeliveryTime)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <MapPin size={20} className="mr-2 text-primary-600 dark:text-primary-400" />
                                Restaurant Details
                            </h3>
                            <p className="font-medium text-gray-900 dark:text-white">{order.restaurant.name}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{order.restaurant.address}</p>
                            {order.restaurant.phone && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 flex items-center">
                                    <Phone size={14} className="mr-1" />
                                    {order.restaurant.phone}
                                </p>
                            )}
                        </div>

                        <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <Mail size={20} className="mr-2 text-primary-600 dark:text-primary-400" />
                                Delivery Details
                            </h3>
                            <p className="font-medium text-gray-900 dark:text-white">{order.user.name}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{order.user.address || 'No address provided'}</p>
                            {order.user.phone && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 flex items-center">
                                    <Phone size={14} className="mr-1" />
                                    {order.user.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-gray-900 dark:text-white">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t dark:border-gray-700 mt-4 pt-4 flex justify-between items-center">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">Total Amount</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{order.totalAmount}</p>
                        </div>
                    </div>

                    <div className="border-t dark:border-gray-700 mt-6 pt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Order placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
