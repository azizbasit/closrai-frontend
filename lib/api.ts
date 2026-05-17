import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Avoid infinite loop if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: any) => api.post('auth/register', data),
  login: (credentials: any) => api.post('auth/login', credentials),
  logout: () => api.post('auth/logout'),
  me: () => api.get('auth/me'),
  forgotPassword: (email: string) => api.post('auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('auth/reset-password', data),
};

export const v1Api = {
  dashboard: {
    getStats: () => api.get('dashboard/stats'),
  },
  analytics: {
    getData: (days = 7) => api.get(`analytics?days=${days}`),
  },
  settings: {
    getProfile: () => api.get('settings/profile'),
    updateProfile: (data: any) => api.put('settings/profile', data),
  },
  integrations: {
    getAll: () => api.get('integrations'),
    getOne: (id: string) => api.get(`integrations/${id}`),
    create: (data: any) => api.post('integrations', data),
    update: (id: string, data: any) => api.put(`integrations/${id}`, data),
    delete: (id: string) => api.delete(`integrations/${id}`),
  },
  admin: {
    getStats: () => api.get('admin/stats'),
    getUsers: (page = 1, perPage = 15) => api.get(`admin/users?page=${page}&per_page=${perPage}`),
    getUserDetail: (id: string) => api.get(`admin/users/${id}`),
    updateUser: (id: string, data: any) => api.put(`admin/users/${id}`, data),
    deleteUser: (id: string) => api.delete(`admin/users/${id}`),
    getBusinesses: (page = 1, perPage = 15) => api.get(`admin/businesses?page=${page}&per_page=${perPage}`),
    createBusiness: (data: any) => api.post('admin/businesses', data),
  },
  business: {
    getUsers: () => api.get('business/users'),
    createUser: (data: any) => api.post('business/users', data),
    updateUser: (id: number, data: any) => api.put(`business/users/${id}`, data),
    deleteUser: (id: number) => api.delete(`business/users/${id}`),
    getRoles: () => api.get('business/roles'),
    getPermissions: () => api.get('business/permissions'),
  },
  leads: {
    getAll: () => api.get('leads'),
    getOne: (id: string) => api.get(`leads/${id}`),
    create: (data: any) => api.post('leads', data),
    update: (id: string, data: any) => api.put(`leads/${id}`, data),
    delete: (id: string) => api.delete(`leads/${id}`),
  },
  agents: {
    getAll: () => api.get('agents'),
    getOne: (id: string) => api.get(`agents/${id}`),
    create: (data: any) => api.post('agents', data),
    update: (id: string, data: any) => api.put(`agents/${id}`, data),
    delete: (id: string) => api.delete(`agents/${id}`),
    getKnowledge: (agentId: string) => api.get(`agents/${agentId}/knowledge-base`),
    addKnowledge: (agentId: string, data: any) => api.post(`agents/${agentId}/knowledge-base`, data),
    deleteKnowledge: (id: string) => api.delete(`knowledge-base/${id}`),
  },
  conversations: {
    getAll: () => api.get('conversations'),
    getOne: (id: string) => api.get(`conversations/${id}`),
  },
  appointments: {
    getAll: () => api.get('appointments'),
    getOne: (id: string) => api.get(`appointments/${id}`),
    update: (id: string, data: any) => api.put(`appointments/${id}`, data),
  },
};

export default api;
