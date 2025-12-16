import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Trash2, Plus, Minus, ShoppingBag, ShoppingCart, CreditCard, Smartphone, Wallet, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import EmptyState from '../components/EmptyState';


const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        upiId: ''
    });

    const handleProceedToPayment = () => {
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setShowPaymentModal(true);
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            toast.error('Please select a payment method');
            return;
        }

        if (paymentMethod === 'card') {
            if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiryDate || !paymentDetails.cvv) {
                toast.error('Please fill all card details');
                return;
            }
        }

        if (paymentMethod === 'upi') {
            if (!paymentDetails.upiId) {
                toast.error('Please enter UPI ID');
                return;
            }
        }

        setLoading(true);

        try {
            const orderData = {
                restaurantId: cart[0].restaurantId,
                items: cart.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity
                })),
                paymentMethod: paymentMethod.toUpperCase(),
                paymentDetails: paymentMethod === 'cod' ? null : paymentDetails
            };

            await api.post('/orders', orderData);
            toast.success(`Order placed successfully! Payment method: ${paymentMethod.toUpperCase()} `);
            clearCart();
            setShowPaymentModal(false);
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };


    const total = getTotal();

    return (
        <div className="py-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <EmptyState
                        icon={ShoppingCart}
                        title="Your Cart is Empty"
                        description="Looks like you haven't added any items to your cart yet. Browse our restaurants and add some delicious food!"
                        actionLabel="Browse Restaurants"
                        onAction={() => navigate('/restaurants')}
                    />
                ) : (
                    <>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b dark:border-gray-700 py-4 last:border-b-0">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{item.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <p className="font-bold text-primary-600 dark:text-primary-400 w-20 text-right">
                                            ₹{item.price * item.quantity}
                                        </p>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">Total:</span>
                                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{total}</span>
                            </div>
                            <button
                                onClick={handleProceedToPayment}
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </>
                )}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
                            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment</h2>
                                <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">Order Total</p>
                                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">₹{total}</p>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">Select Payment Method</p>

                                    <div
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500'
                                            } `}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Smartphone className="text-primary-600 dark:text-primary-400" size={24} />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">UPI</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Pay using UPI ID</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('card')}
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500'
                                            } `}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="text-primary-600 dark:text-primary-400" size={24} />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">Credit/Debit Card</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Pay using card</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500'
                                            } `}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Wallet className="text-primary-600 dark:text-primary-400" size={24} />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {paymentMethod === 'upi' && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            UPI ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="yourname@upi"
                                            value={paymentDetails.upiId}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                )}

                                {paymentMethod === 'card' && (
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                                value={paymentDetails.cardNumber}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={paymentDetails.cardName}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    value={paymentDetails.expiryDate}
                                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                                                    className="input-field"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    maxLength="3"
                                                    value={paymentDetails.cvv}
                                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handlePayment}
                                    disabled={loading || !paymentMethod}
                                    className="btn-primary w-full disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : `Pay ₹${total} `}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
