// Silencing TypeScript errors for modules imported via CDN
// FIX: Replaced problematic module declarations and imports with global const declarations,
// assuming 'marked' and 'dompurify' are loaded from a CDN.
declare const marked: {
  parse(markdown: string, options?: any): string;
};
declare const DOMPurify: {
  sanitize(html: string): string;
};

import React, { useState, useEffect, useMemo } from 'react';
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
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

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
    
    const sanitizedHtml = useMemo(() => {
        if (typeof window !== 'undefined') {
            const rawHtml = marked.parse(formData.content, { async: false }) as string;
            return DOMPurify.sanitize(rawHtml);
        }
        return '';
    }, [formData.content]);

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
                        <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                            <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-t-md">
                                <button type="button" onClick={() => setActiveTab('write')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'write' ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent'}`}>
                                    Write
                                </button>
                                <button type="button" onClick={() => setActiveTab('preview')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent'}`}>
                                    Preview
                                </button>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-b-md">
                                {activeTab === 'write' ? (
                                    <textarea id="content" name="content" placeholder="Your post content..." rows={10} value={formData.content} onChange={handleChange} className="block w-full px-3 py-2 bg-transparent border-0 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm" required></textarea>
                                ) : (
                                    <div 
                                        className="markdown-preview p-4 min-h-[268px] prose-sm"
                                        dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <Input label="Schedule Time (optional)" name="scheduled_at" type="datetime-local" value={formData.scheduled_at} onChange={handleChange} />
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <div className="flex space-x-4 pt-4">
                        <Button type="button" onClick={(e) => handleSubmit(e, false)} isLoading={isLoading}>Publish Now</Button>
                        <Button type="button" onClick={(e) => handleSubmit(e, true)} variant="secondary" isLoading={isLoading} disabled={!formData.scheduled_at}>Schedule Post</Button>
                    </div>
                </form>
            </Card>
        </motion.div>
    );
}

export default CreatePostView;