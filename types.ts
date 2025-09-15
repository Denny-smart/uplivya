
export interface User {
  id: number;
  email: string;
  username: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface RedditAccount {
  id: string;
  reddit_username: string;
  avatar_url: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  subreddit: string;
  status: 'draft' | 'scheduled' | 'published' | 'error';
  scheduled_at: string | null;
  published_at: string | null;
  reddit_account: RedditAccount;
}

export type Theme = 'light' | 'dark';

export interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: Theme;
  login: (tokens: Tokens) => Promise<void>;
  logout: () => void;
  toggleTheme: () => void;
}

export interface ApiError {
  message: string;
  details?: Record<string, any>;
}
