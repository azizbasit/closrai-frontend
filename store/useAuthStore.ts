import { create } from 'zustand';
import { authApi } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  status: string;
  roles: string[];
  permissions: string[];
  business?: {
    id: number;
    name: string;
    slug: string;
  };
  email_verified_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: () => boolean;
  isBusinessAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  hasRole: (role) => {
    const user = get().user;
    return user?.roles.includes(role) || false;
  },

  hasPermission: (permission) => {
    const user = get().user;
    // Super admins have all permissions
    if (user?.roles.includes('super-admin')) return true;
    return user?.permissions.includes(permission) || false;
  },

  isSuperAdmin: () => {
    return get().hasRole('super-admin');
  },

  isBusinessAdmin: () => {
    return get().hasRole('business-admin');
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      let message = 'An unexpected error occurred. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 404) {
          message = 'We couldn\'t find the login service. Please check your connection or try again later.';
        } else if (status === 422) {
          message = data.message || 'The information provided is incorrect.';
        } else if (status === 401) {
          message = 'The email or password you entered is incorrect.';
        } else if (status === 429) {
          message = 'Too many login attempts. Please wait a few minutes and try again.';
        } else if (data?.message) {
          message = data.message;
        }
      } else if (error.request) {
        message = 'We\'re having trouble reaching our servers. Please check your internet connection.';
      }

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      let message = 'Registration failed. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 422) {
          message = data.message || 'Please check the information you provided.';
        } else if (status === 409) {
          message = 'An account with this email already exists.';
        } else if (data?.message) {
          message = data.message;
        }
      } else if (error.request) {
        message = 'We\'re having trouble reaching our servers. Please check your connection.';
      }

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  fetchUser: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await authApi.me();
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
