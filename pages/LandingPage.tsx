
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/UI';
import { IconRocket } from '../components/Icons';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-primary-950 text-center p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex justify-center items-center mb-6">
          <IconRocket className="w-16 h-16 text-primary-500" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4">
          Manage Your Reddit Posts Smarter 🚀
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
          Authenticate, schedule, and track Reddit posts with ease.
        </p>
        <div className="flex justify-center items-center space-x-4">
          <Button onClick={() => navigate('/auth#login')} className="px-8 py-3 text-lg">
            Login
          </Button>
          <Button onClick={() => navigate('/auth#signup')} variant="secondary" className="px-8 py-3 text-lg">
            Sign Up
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-16 w-full max-w-4xl"
      >
        <div className="relative rounded-xl shadow-2xl bg-white dark:bg-gray-800/50 p-2 ring-1 ring-inset ring-gray-900/10">
            <div className="flex items-center gap-x-2 px-3 py-1.5 border-b border-gray-900/10">
                <div className="flex -space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
            </div>
            <img src="https://picsum.photos/seed/reddit-manager/1200/600" alt="Dashboard preview" className="rounded-lg object-cover" />
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
