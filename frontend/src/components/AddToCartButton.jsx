import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';

const AddToCartButton = ({ onClick, className = '' }) => {
    const [status, setStatus] = useState('idle'); // idle, success

    const handleClick = async (e) => {
        e.stopPropagation(); // Prevent card clicks if any
        if (status === 'success') return;

        setStatus('success');
        if (onClick) {
            onClick();
        }

        // Reset after 2 seconds
        setTimeout(() => {
            setStatus('idle');
        }, 1500);
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className={`
                relative overflow-hidden font-medium rounded-lg text-sm px-4 py-2 flex items-center justify-center gap-1.5 transition-colors duration-200
                ${status === 'success'
                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                    : 'text-primary-600 hover:text-white hover:bg-primary-600 border border-primary-200 hover:border-primary-600'
                }
                ${className}
            `}
        >
            <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                    <motion.span
                        key="success"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1"
                    >
                        <Check size={16} />
                        ADDED
                    </motion.span>
                ) : (
                    <motion.span
                        key="idle"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1"
                    >
                        <Plus size={16} />
                        ADD
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default AddToCartButton;
