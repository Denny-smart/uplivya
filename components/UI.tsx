import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { IconSpinner } from './Icons';

// Button Component
// FIX: Updated ButtonProps to extend from motion.button props to fix type conflicts.
// Added a `size` prop to control button dimensions and updated the component to use it.
interface ButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'primary', isLoading = false, size = 'md', ...props }, ref) => {
    const baseClasses = "flex items-center justify-center font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200";

    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-primary-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-primary-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <IconSpinner className="w-5 h-5" /> : children}
      </motion.button>
    );
  }
);

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
    <input
      ref={ref}
      id={id}
      className={`block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${className}`}
      {...props}
    />
  </div>
));

// Card Component
export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

// Spinner Component for page loading
export const FullPageSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <IconSpinner className="w-12 h-12 text-primary-500" />
  </div>
);

// Toast notification
export const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onDismiss: () => void; }> = ({ message, type, onDismiss }) => {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={`fixed top-5 right-5 p-4 rounded-md text-white shadow-lg z-50 ${bgColors[type]}`}
    >
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 font-bold">X</button>
    </motion.div>
  );
};