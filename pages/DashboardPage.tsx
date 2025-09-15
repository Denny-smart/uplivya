import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const DashboardPage: React.FC = () => {
  const { user } = useAppContext();

  return (
    <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Here's your Reddit activity overview.</p>
        <div className="mt-6">
            <Outlet />
        </div>
    </div>
  );
};

export default DashboardPage;
