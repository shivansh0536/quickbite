import { useState } from 'react';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    icon: Icon,
    required = false,
    className = '',
    placeholder = '',
    error
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;

    return (
        <div className={`relative mb-4 ${className}`}>
            <label
                className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-all duration-200 ${error ? 'text-red-500' : ''
                    }`}
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
                {Icon && (
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
                        }`}>
                        <Icon size={20} />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2 border rounded-lg outline-none transition-all duration-200 
                        ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-800 dark:focus:ring-red-900'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:focus:border-primary-500 dark:focus:ring-primary-900/30'
                        }
                        ${isFocused
                            ? 'bg-white dark:bg-gray-800'
                            : 'bg-gray-50 dark:bg-gray-900'
                        }
                        text-gray-900 dark:text-gray-100 dark:placeholder-gray-500
                    `}
                    placeholder={placeholder}
                    required={required}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
