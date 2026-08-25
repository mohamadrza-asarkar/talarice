import { api } from './client';

export const slidersAPI = {
  // Get all active banner slides
  getAll: async () => {
    return api.get('/slides').catch(() => api.get('/sliders'));
  },

  // Create new banner slide (Admin)
  create: async (slideData) => {
    if (slideData instanceof FormData) {
      return api.upload('/slides', slideData).catch(() => api.upload('/sliders', slideData));
    }
    return api.post('/slides', slideData).catch(() => api.post('/sliders', slideData));
  },

  // Update banner slide
  update: async (id, slideData) => {
    return api.put(`/slides/${id}`, slideData).catch(() => api.put(`/sliders/${id}`, slideData));
  },

  // Delete banner slide
  delete: async (id) => {
    return api.delete(`/slides/${id}`).catch(() => api.delete(`/sliders/${id}`));
  },
};

export default slidersAPI;
