
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Tokens, Theme, AppContextType } from '../types';
import { AppContext } from '../hooks/useAppContext';
import { apiService } from '../services/apiService';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(() => {
    try {
      const storedTokens = localStorage.getItem('tokens');
      return storedTokens ? JSON.parse(storedTokens) : null;
    } catch (error) {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme') as Theme;
    }
    return 'light';
  });

  const fetchUser = useCallback(async () => {
    if (tokens) {
      try {
        const userData = await apiService.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user', error);
        logout();
      }
    }
    setIsLoading(false);
  }, [tokens]);


  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = useCallback(async (newTokens: Tokens) => {
    apiService.setTokens(newTokens);
    setTokens(newTokens);
    await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    apiService.removeTokens();
    setUser(null);
    setTokens(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const contextValue = useMemo<AppContextType>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    theme,
    login,
    logout,
    toggleTheme,
  }), [user, isLoading, theme, login, logout, toggleTheme]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
