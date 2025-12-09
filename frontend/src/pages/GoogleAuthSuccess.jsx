import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GoogleAuthSuccess = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleAuth = async () => {
            const token = searchParams.get('token');
            const userStr = searchParams.get('user');

            if (token && userStr) {
                try {
                    const user = JSON.parse(decodeURIComponent(userStr));

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    setUser(user);

                    toast.success('Successfully signed in with Google!');
                    navigate('/', { replace: true });
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    toast.error('Authentication failed');
                    navigate('/login', { replace: true });
                }
            } else {
                toast.error('Authentication failed');
                navigate('/login', { replace: true });
            }
        };

        handleAuth();
    }, [searchParams, navigate, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing sign in...</p>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;
