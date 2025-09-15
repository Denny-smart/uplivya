import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../../services/apiService';
import { Button, Card } from '../../components/UI';
import type { RedditAccount } from '../../types';

const RedditAccountsView: React.FC = () => {
    const [accounts, setAccounts] = useState<RedditAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiService.getRedditAccounts();
            setAccounts(data);
        } catch (err) {
            setError('Failed to fetch Reddit accounts.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleDisconnect = async (id: string) => {
        if (window.confirm('Are you sure you want to disconnect this account?')) {
            try {
                await apiService.disconnectRedditAccount(id);
                fetchAccounts();
            } catch (err) {
                setError('Failed to disconnect account.');
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Connected Reddit Accounts</h2>
                <Button onClick={apiService.connectRedditAccount}>Connect New Account</Button>
            </div>
            {isLoading && <p>Loading accounts...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && accounts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map(account => (
                        <Card key={account.id} className="p-4 flex items-center justify-between hover:shadow-xl transition-shadow">
                            <div className="flex items-center">
                                <img src={account.avatar_url || `https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png`} alt={account.reddit_username} className="w-10 h-10 rounded-full mr-4" />
                                <div>
                                    <p className="font-semibold">{account.reddit_username}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Connected</p>
                                </div>
                            </div>
                            <Button variant="danger" size="sm" onClick={() => handleDisconnect(account.id)}>Disconnect</Button>
                        </Card>
                    ))}
                </div>
            )}
             { !isLoading && accounts.length === 0 && (
                <Card className="p-8 text-center">
                    <h3 className="text-lg font-medium">No accounts connected</h3>
                    <p className="text-gray-500 mt-2">Connect a Reddit account to start managing your posts.</p>
                </Card>
             )}
        </motion.div>
    );
};

export default RedditAccountsView;
