import { api } from './client';

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = file instanceof FormData ? file : new FormData();
    if (!(file instanceof FormData)) {
      formData.append('image', file);
    }
    return api.upload('/upload', formData);
  },
};

export default uploadAPI;
