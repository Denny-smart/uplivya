import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../hooks/useAppContext';
import { IconDashboard, IconPost, IconUserCircle, IconLogout, IconSun, IconMoon, IconChevronDown, IconRocket } from './Icons';
import { Button } from './UI';

const navItems = [
  { to: "/dashboard/accounts", icon: IconUserCircle, label: "Accounts" },
  { to: "/dashboard/posts", icon: IconPost, label: "Posts" },
];

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700">
                <IconRocket className="w-8 h-8 text-primary-500" />
                <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">RedditMgr</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/dashboard/accounts"} // ensure only this matches for the base dashboard
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                isActive
                                    ? 'bg-primary-500 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

const Header: React.FC = () => {
    const { user, logout, theme, toggleTheme } = useAppContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
             <div>
                {/* Placeholder for breadcrumbs or page title if needed */}
            </div>
            <div className="flex items-center space-x-4">
                 <Button onClick={() => navigate('/dashboard/create-post')} size="sm">Create Post</Button>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                    {theme === 'light' ? <IconMoon className="w-5 h-5" /> : <IconSun className="w-5 h-5" />}
                </button>
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.username || 'User'}</span>
                        <IconChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onMouseLeave={() => setDropdownOpen(false)}
                                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10"
                            >
                                <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <IconLogout className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
