
import { API_BASE_URL } from '../constants';
import type { Tokens, User, RedditAccount, Post, ApiError } from '../types';

let tokens: Tokens | null = null;

const getTokens = (): Tokens | null => {
  if (tokens) return tokens;
  try {
    const stored = localStorage.getItem('tokens');
    if (stored) {
      tokens = JSON.parse(stored);
      return tokens;
    }
  } catch (e) {
    console.error('Could not parse tokens from localStorage', e);
  }
  return null;
};

const setTokens = (newTokens: Tokens): void => {
  tokens = newTokens;
  localStorage.setItem('tokens', JSON.stringify(tokens));
};

const removeTokens = (): void => {
  tokens = null;
  localStorage.removeItem('tokens');
};

const refreshToken = async (): Promise<Tokens> => {
    const currentTokens = getTokens();
    if (!currentTokens?.refresh) throw new Error('No refresh token available.');

    const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: currentTokens.refresh }),
    });

    if (!res.ok) {
        removeTokens();
        throw new Error('Failed to refresh token.');
    }

    const newTokens: Tokens = await res.json();
    setTokens(newTokens);
    return newTokens;
};

const request = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    let currentTokens = getTokens();
    const headers = new Headers(options.headers || {});
    headers.append('Content-Type', 'application/json');

    if (currentTokens?.access) {
        headers.append('Authorization', `Bearer ${currentTokens.access}`);
    }
    
    options.headers = headers;

    let res = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (res.status === 401 && currentTokens?.refresh) {
        try {
            const newTokens = await refreshToken();
            headers.set('Authorization', `Bearer ${newTokens.access}`);
            options.headers = headers;
            res = await fetch(`${API_BASE_URL}${endpoint}`, options);
        } catch (error) {
            removeTokens();
            window.location.hash = '/auth'; // Redirect to login
            throw new Error('Session expired. Please log in again.');
        }
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'An unknown error occurred' }));
        const error: ApiError = {
            message: `API Error: ${res.status} ${res.statusText}`,
            details: errorData,
        };
        throw error;
    }
    
    // For 204 No Content
    if(res.status === 204) {
        return {} as T;
    }
    
    return res.json() as Promise<T>;
};

export const apiService = {
  setTokens,
  removeTokens,

  // Auth
  login: (data: any) => request<Tokens>('/api/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data: any) => request<any>('/api/auth/signup/', { method: 'POST', body: JSON.stringify(data) }),
  googleLogin: () => { window.location.href = `${API_BASE_URL}/api/auth/google/` },
  logout: () => request<void>('/api/auth/logout/', { method: 'POST' }),
  verifyEmail: (data: any) => request<any>('/api/auth/verify-email/', { method: 'POST', body: JSON.stringify(data) }),
  resendVerification: (data: any) => request<any>('/api/auth/resend-verification/', { method: 'POST', body: JSON.stringify(data) }),
  passwordReset: (data: any) => request<any>('/api/auth/password-reset/', { method: 'POST', body: JSON.stringify(data) }),
  passwordResetConfirm: (data: any) => request<any>('/api/auth/password-reset-confirm/', { method: 'POST', body: JSON.stringify(data) }),
  getUser: () => request<User>('/api/auth/user/'),

  // Reddit Accounts
  getRedditAccounts: () => request<RedditAccount[]>('/api/reddit/accounts/'),
  connectRedditAccount: () => { window.location.href = `${API_BASE_URL}/api/reddit/connect/` },
  disconnectRedditAccount: (id: string) => request<void>(`/api/reddit/disconnect/${id}/`, { method: 'DELETE' }),

  // Posts
  getPosts: (status?: 'scheduled' | 'published') => {
      let url = '/api/posts/';
      if (status === 'scheduled') url = '/api/posts/scheduled/';
      if (status === 'published') url = '/api/posts/posted/';
      return request<Post[]>(url);
  },
  createPost: (data: any) => request<Post>('/api/posts/create/', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id: string, data: any) => request<Post>(`/api/posts/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id: string) => request<void>(`/api/posts/${id}/`, { method: 'DELETE' }),
  publishPost: (id: string) => request<Post>(`/api/posts/${id}/publish/`, { method: 'POST' }),
  schedulePost: (id: string, data: any) => request<Post>(`/api/posts/${id}/schedule/`, { method: 'POST', body: JSON.stringify(data) }),
};
