import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GoogleAuthSuccess = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [searchParams] = useSearchParams();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                setUser(user);

                toast.success('Successfully signed in with Google!');

                // Delay navigation slightly to prevent hydration issues
                setTimeout(() => {
                    navigate('/');
                }, 100);
            } catch (error) {
                console.error('Error parsing user data:', error);
                toast.error('Authentication failed');
                setTimeout(() => {
                    navigate('/login');
                }, 100);
            }
        } else {
            toast.error('Authentication failed');
            setTimeout(() => {
                navigate('/login');
            }, 100);
        }
    }, [searchParams, navigate, setUser, mounted]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing sign in...</p>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;
