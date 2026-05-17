import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export const leadsApi = {
  getAll: () => api.get('/leads'),
  getOne: (id: string) => api.get(`/leads/${id}`),
  create: (data: any) => api.get('/leads', data),
  update: (id: string, data: any) => api.put(`/leads/${id}`, data),
  delete: (id: string) => api.delete(`/leads/${id}`),
};

export const agentsApi = {
  getAll: () => api.get('/agents'),
  getOne: (id: string) => api.get(`/agents/${id}`),
  create: (data: any) => api.post('/agents', data),
  update: (id: string, data: any) => api.put(`/agents/${id}`, data),
  delete: (id: string) => api.delete(`/agents/${id}`),
};

export const conversationsApi = {
  getAll: () => api.get('/conversations'),
  getOne: (id: string) => api.get(`/conversations/${id}`),
};

export const appointmentsApi = {
  getAll: () => api.get('/appointments'),
  getOne: (id: string) => api.get(`/appointments/${id}`),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
};

export default api;
