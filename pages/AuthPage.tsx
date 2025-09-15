import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../hooks/useAppContext';
import { apiService } from '../services/apiService';
import { Button, Input, Card } from '../components/UI';
import { IconGoogle, IconRocket } from '../components/Icons';
import type { ApiError } from '../types';

const AuthFormContainer: React.FC<{ children: React.ReactNode; title: string; }> = ({ children, title }) => (
    <Card className="w-full max-w-md mx-auto">
        <div className="p-6 md:p-8">
            <div className="flex justify-center mb-6">
                <IconRocket className="w-12 h-12 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">{title}</h2>
            {children}
        </div>
    </Card>
);

const LoginForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    const navigate = useNavigate();
    const { login } = useAppContext();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const tokens = await apiService.login(formData);
            await login(tokens);
            navigate('/dashboard');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.details?.detail || apiError.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <AuthFormContainer title="Welcome Back!">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required autoComplete="current-password" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" isLoading={isLoading} className="w-full">Log In</Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button onClick={onSwitch} className="font-medium text-primary-600 hover:underline">Sign up</button>
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
            <Button onClick={apiService.googleLogin} variant="secondary" className="w-full">
                <IconGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
            </Button>
        </AuthFormContainer>
    );
};

const SignupForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    const navigate = useNavigate();
    const { login } = useAppContext();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await apiService.signup(formData);
            // After signup, log the user in
            const tokens = await apiService.login({ email: formData.email, password: formData.password });
            await login(tokens);
            navigate('/dashboard');
        } catch (err) {
            const apiError = err as ApiError;
            // Handle specific error messages from backend if available
            if (apiError.details) {
                const errorMessages = Object.entries(apiError.details).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join(' ');
                setError(errorMessages || 'Signup failed. Please try again.');
            } else {
                setError(apiError.message || 'Signup failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthFormContainer title="Create an Account">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Username" name="username" value={formData.username} onChange={handleChange} required autoComplete="username" />
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" isLoading={isLoading} className="w-full">Sign Up</Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button onClick={onSwitch} className="font-medium text-primary-600 hover:underline">Log in</button>
            </div>
        </AuthFormContainer>
    );
};

const AuthPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoginView, setIsLoginView] = useState(true);
    const { isAuthenticated, isLoading } = useAppContext();

    useEffect(() => {
        setIsLoginView(location.hash !== '#signup');
    }, [location.hash]);
    
    if(isLoading) return null; // Or a spinner
    if(isAuthenticated) {
        navigate('/dashboard', { replace: true });
        return null;
    }

    const toggleView = () => {
        if (isLoginView) {
            navigate('/auth#signup');
        } else {
            navigate('/auth#login');
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={isLoginView ? 'login' : 'signup'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {isLoginView ? <LoginForm onSwitch={toggleView} /> : <SignupForm onSwitch={toggleView} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AuthPage;
