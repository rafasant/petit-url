import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'\;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface ShortenUrlResponse {
  originalUrl: string;
  shortUrl: string;
  slug: string;
  visits: number;
  createdAt: string;
}

export interface UserUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug: string;
  visits: number;
  createdAt: string;
  lastVisited: string | null;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
  };
}

// API functions
export const shortenUrl = async (originalUrl: string, customSlug?: string): Promise<ShortenUrlResponse> => {
  try {
    const response = await api.post('/shorten', { originalUrl, customSlug });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to shorten URL');
  }
};

// Auth functions
export const register = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const getUserUrls = async (): Promise<UserUrl[]> => {
  try {
    const response = await api.get('/urls');
    return response.data.urls;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to get URLs');
  }
};

export default api;
