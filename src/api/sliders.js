import { api } from './client';

export const slidersAPI = {
  getAll: () => api.get('/slides'),
  getById: (id) => api.get(`/slides/${id}`),
  create: (data) => api.post('/slides', data),
  update: (id, data) => api.put(`/slides/${id}`, data),
  delete: (id) => api.delete(`/slides/${id}`),
};

export default slidersAPI;
