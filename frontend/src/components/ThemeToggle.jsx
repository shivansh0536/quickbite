import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-200 
                ${theme === 'dark'
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                } ${className}`}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? (
                <Sun size={20} className="transition-transform duration-500 rotate-0" />
            ) : (
                <Moon size={20} className="transition-transform duration-500 rotate-0" />
            )}
        </button>
    );
};

export default ThemeToggle;
