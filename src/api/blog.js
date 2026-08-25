import { api } from './client';

export const blogAPI = {
  // Get all blog articles / posts
  getAll: async (params = {}) => {
    return api.get('/posts', { params }).catch(() => api.get('/blog', { params }));
  },

  // Get single post by ID or slug
  getById: async (id) => {
    return api.get(`/posts/${id}`).catch(() => api.get(`/blog/${id}`));
  },

  // Create new post (Admin)
  create: async (postData) => {
    return api.post('/posts', postData).catch(() => api.post('/blog', postData));
  },

  // Update post (Admin)
  update: async (id, postData) => {
    return api.put(`/posts/${id}`, postData).catch(() => api.put(`/blog/${id}`, postData));
  },

  // Delete post (Admin)
  delete: async (id) => {
    return api.delete(`/posts/${id}`).catch(() => api.delete(`/blog/${id}`));
  },
};

export default blogAPI;
