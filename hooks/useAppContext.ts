
import React, { useContext } from 'react';
import type { AppContextType } from '../types';

export const AppContext = React.createContext<AppContextType | null>(null);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
