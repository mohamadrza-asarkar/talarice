import { api } from './client';

export const slidersAPI = {
  getAll: async () => {
    try {
      return await api.get('/slides');
    } catch {
      return await api.get('/sliders');
    }
  },
  getById: (id) => api.get(`/slides/${id}`).catch(() => api.get(`/sliders/${id}`)),
  create: (data) => api.post('/slides', data).catch(() => api.post('/sliders', data)),
  update: (id, data) => api.put(`/slides/${id}`, data).catch(() => api.put(`/sliders/${id}`, data)),
  delete: (id) => api.delete(`/slides/${id}`).catch(() => api.delete(`/sliders/${id}`)),
};

export default slidersAPI;
