import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../../services/apiService';
import { Button, Card, Input } from '../../components/UI';
import type { RedditAccount, ApiError } from '../../types';

const CreatePostView: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', content: '', subreddit: '', reddit_account: '', scheduled_at: '' });
    const [accounts, setAccounts] = useState<RedditAccount[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        apiService.getRedditAccounts().then(setAccounts).catch(() => setError('Could not load Reddit accounts.'));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent, schedule = false) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const payload = { ...formData, scheduled_at: schedule ? formData.scheduled_at : null };
            await apiService.createPost(payload);
            setFormData({ title: '', content: '', subreddit: '', reddit_account: '', scheduled_at: '' });
            navigate('/dashboard/posts');
        } catch (err) {
             const apiError = err as ApiError;
            setError(apiError.message || 'Failed to create post.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="max-w-2xl mx-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold">Create a New Post</h2>
                </div>
                <form className="p-6 space-y-4">
                    <div>
                        <label htmlFor="reddit_account" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reddit Account</label>
                        <select id="reddit_account" name="reddit_account" value={formData.reddit_account} onChange={handleChange} className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required>
                            <option value="">Select Reddit Account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.reddit_username}</option>)}
                        </select>
                    </div>
                    <Input label="Subreddit" name="subreddit" placeholder="e.g., reactjs (without r/)" value={formData.subreddit} onChange={handleChange} required />
                    <Input label="Post Title" name="title" placeholder="An interesting title" value={formData.title} onChange={handleChange} required />
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Markdown supported)</label>
                        <textarea id="content" name="content" placeholder="Your post content..." rows={10} value={formData.content} onChange={handleChange} className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required></textarea>
                    </div>
                    <Input label="Schedule Time (optional)" name="scheduled_at" type="datetime-local" value={formData.scheduled_at} onChange={handleChange} />
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <div className="flex space-x-4 pt-4">
                        <Button onClick={(e) => handleSubmit(e, false)} isLoading={isLoading}>Publish Now</Button>
                        <Button onClick={(e) => handleSubmit(e, true)} variant="secondary" isLoading={isLoading} disabled={!formData.scheduled_at}>Schedule Post</Button>
                    </div>
                </form>
            </Card>
        </motion.div>
    );
}

export default CreatePostView;
