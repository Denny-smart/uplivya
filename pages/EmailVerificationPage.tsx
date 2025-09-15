import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { Button, Card } from '../components/UI';
import { IconRocket, IconSpinner } from '../components/Icons';
import type { ApiError } from '../types';

const VerificationStatus: React.FC<{
    status: 'loading' | 'success' | 'error';
    message: string | null;
    onNavigate: () => void;
}> = ({ status, message, onNavigate }) => {
    let content;

    switch (status) {
        case 'success':
            content = (
                <>
                    <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">Success!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                    <Button onClick={onNavigate} className="w-full">Proceed to Login</Button>
                </>
            );
            break;
        case 'error':
            content = (
                <>
                    <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Verification Failed</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                    <Button onClick={onNavigate} variant="secondary" className="w-full">Back to Login</Button>
                </>
            );
            break;
        default: // loading
            content = (
                <>
                    <IconSpinner className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-center">{message}</h3>
                </>
            );
            break;
    }

    return <div className="text-center">{content}</div>;
};


const EmailVerificationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState<string | null>('Verifying your email, please wait...');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link. No token provided.');
            return;
        }

        const verify = async () => {
            try {
                await apiService.verifyEmail({ token });
                setStatus('success');
                setMessage('Email successfully verified! You can now log in.');
            } catch (err) {
                const apiError = err as ApiError;
                setStatus('error');
                setMessage(apiError.details?.detail || 'Verification failed. The link may be expired or invalid.');
            }
        };

        // Adding a small delay to show the loading spinner for better UX
        const timer = setTimeout(() => {
            verify();
        }, 1000);

        return () => clearTimeout(timer);

    }, [searchParams]);

    const handleNavigate = () => {
        navigate('/auth#login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                <Card className="w-full max-w-md mx-auto">
                    <div className="p-6 md:p-8">
                        <div className="flex justify-center mb-6">
                            <IconRocket className="w-12 h-12 text-primary-500" />
                        </div>
                        <VerificationStatus status={status} message={message} onNavigate={handleNavigate} />
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default EmailVerificationPage;