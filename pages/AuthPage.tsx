import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../hooks/useAppContext';
import { apiService } from '../services/apiService';
import { Button, Input, Card } from '../components/UI';
import { IconGoogle, IconRocket } from '../components/Icons';
import type { ApiError } from '../types';

type AuthMode = 'login' | 'signup' | 'forgotPassword';

const AuthForm: React.FC<{ mode: AuthMode; setMode: (mode: AuthMode) => void; }> = ({ mode, setMode }) => {
    const navigate = useNavigate();
    const { login } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({ 
        email: '', 
        username: '', 
        password: '', 
        confirmPassword: '',
        firstName: '',
        lastName: '' 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (mode === 'login') {
                const tokens = await apiService.login({ username_or_email: formData.username, password: formData.password });
                await login(tokens);
                navigate('/dashboard/accounts');
            } else if (mode === 'signup') {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords do not match.");
                }
                await apiService.signup({ 
                    email: formData.email, 
                    username: formData.username, 
                    password: formData.password,
                    confirm_password: formData.confirmPassword,
                    first_name: formData.firstName,
                    last_name: formData.lastName
                });
                setSuccess('Signup successful! Please check your email to verify your account.');
                setMode('login');
            } else if (mode === 'forgotPassword') {
                await apiService.passwordReset({ email: formData.email });
                setSuccess('Password reset link sent to your email.');
                setMode('login');
            }
        } catch (err) {
            const apiError = err as ApiError;
            const errorDetails = apiError.details;
            if (errorDetails && typeof errorDetails === 'object') {
                const messages = Object.values(errorDetails).flat().join(' ');
                setError(messages || 'An error occurred.');
            } else {
                 setError(apiError.message || 'An error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const title = {
        login: 'Welcome Back!',
        signup: 'Create Your Account',
        forgotPassword: 'Reset Your Password'
    };
    
    const subTitle = {
        login: 'Log in to continue managing your posts.',
        signup: 'Join us to streamline your Reddit presence.',
        forgotPassword: 'Enter your email to receive a reset link.'
    }

    return (
        <Card className="w-full max-w-md p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{title[mode]}</h2>
             <p className="text-center text-gray-500 dark:text-gray-400">{subTitle[mode]}</p>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                 {mode === 'login' && (
                    <>
                        <Input label="Username or Email" id="username" name="username" type="text" value={formData.username} onChange={handleChange} required autoComplete="username" />
                        <Input label="Password" id="password" name="password" type="password" value={formData.password} onChange={handleChange} required autoComplete="current-password" />
                    </>
                )}
                {mode === 'signup' && (
                    <>
                        <div className="flex space-x-4">
                            <Input label="First Name" id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} autoComplete="given-name" />
                            <Input label="Last Name" id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} autoComplete="family-name" />
                        </div>
                        <Input label="Username" id="username" name="username" type="text" value={formData.username} onChange={handleChange} required autoComplete="username" />
                        <Input label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                        <Input label="Password" id="password" name="password" type="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                        <Input label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
                    </>
                )}
                {mode === 'forgotPassword' && (
                     <Input label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                )}
                
                <Button type="submit" isLoading={isLoading} className="w-full">
                    {mode === 'login' && 'Log In'}
                    {mode === 'signup' && 'Sign Up'}
                    {mode === 'forgotPassword' && 'Send Reset Link'}
                </Button>
            </form>

            {(mode === 'login' || mode === 'signup') && (
                <>
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
                        </div>
                    </div>
                    <Button variant="secondary" className="w-full" onClick={apiService.googleLogin}>
                        <IconGoogle className="w-5 h-5 mr-2" /> Google
                    </Button>
                </>
            )}

            <div className="text-sm text-center">
                {mode === 'login' && (
                    <>
                        <p className="text-gray-600 dark:text-gray-300">
                            Don't have an account?{' '}
                            <button onClick={() => setMode('signup')} className="font-medium text-primary-600 hover:text-primary-500">Sign up</button>
                        </p>
                        <button onClick={() => setMode('forgotPassword')} className="font-medium text-primary-600 hover:text-primary-500 mt-2">Forgot password?</button>
                    </>
                )}
                {mode === 'signup' && (
                    <p className="text-gray-600 dark:text-gray-300">
                        Already have an account?{' '}
                        <button onClick={() => setMode('login')} className="font-medium text-primary-600 hover:text-primary-500">Log in</button>
                    </p>
                )}
                 {mode === 'forgotPassword' && (
                    <p className="text-gray-600 dark:text-gray-300">
                        Remembered your password?{' '}
                        <button onClick={() => setMode('login')} className="font-medium text-primary-600 hover:text-primary-500">Log in</button>
                    </p>
                )}
            </div>
        </Card>
    );
};

const AuthPage: React.FC = () => {
    const { isAuthenticated, isLoading } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    
    const getInitialMode = (): AuthMode => {
        const hash = location.hash.substring(1);
        if (hash === 'signup') return 'signup';
        if (hash === 'forgotPassword') return 'forgotPassword';
        return 'login';
    };

    const [mode, setMode] = useState<AuthMode>(getInitialMode());

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard/accounts');
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleSetMode = (newMode: AuthMode) => {
        setMode(newMode);
        navigate(`/auth#${newMode}`);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center mb-6">
                <IconRocket className="w-10 h-10 text-primary-500 mr-2"/>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reddit Post Manager</h1>
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                >
                    <AuthForm mode={mode} setMode={handleSetMode} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AuthPage;
