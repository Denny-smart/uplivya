import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../../services/apiService';
import { Button, Card } from '../../components/UI';
import type { Post } from '../../types';

const PostsView: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);
    const [postType, setPostType] = useState<'scheduled' | 'published'>('scheduled');

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await apiService.getPosts(postType);
                setPosts(data);
            } catch (err) {
                setError(`Failed to fetch ${postType} posts.`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [postType]);

    return (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold">Your Posts</h2>
                <div className="flex space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <Button 
                        variant={postType === 'scheduled' ? 'primary' : 'ghost'} 
                        onClick={() => setPostType('scheduled')}
                        size="sm"
                        className="!shadow-none"
                    >
                        Scheduled
                    </Button>
                    <Button 
                        variant={postType === 'published' ? 'primary' : 'ghost'} 
                        onClick={() => setPostType('published')}
                        size="sm"
                         className="!shadow-none"
                    >
                        Published
                    </Button>
                </div>
            </div>
            {isLoading && <p>Loading posts...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && posts.length > 0 && (
                <div className="space-y-4">
                    {posts.map(post => (
                        <Card key={post.id} className="p-4 hover:shadow-xl transition-shadow">
                            <h3 className="font-bold">{post.title}</h3>
                            <p className="text-sm text-gray-500">Subreddit: r/{post.subreddit}</p>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{post.content.substring(0, 150)}...</p>
                             <div className="flex justify-between items-center mt-4">
                                <p className="text-xs text-gray-500">Account: {post.reddit_account.reddit_username}</p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                                    {post.status}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            { !isLoading && posts.length === 0 && (
                 <Card className="p-8 text-center">
                    <h3 className="text-lg font-medium">No {postType} posts</h3>
                    <p className="text-gray-500 mt-2">You haven't {postType} any posts yet.</p>
                </Card>
            )}
         </motion.div>
    );
}

export default PostsView;
