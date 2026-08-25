import { api } from './client';

export const uploadAPI = {
  // Upload an image file (returns { success: true, url: string } or url)
  uploadImage: async (fileOrFormData) => {
    let formData;
    if (fileOrFormData instanceof FormData) {
      formData = fileOrFormData;
    } else {
      formData = new FormData();
      formData.append('image', fileOrFormData);
    }

    return api.upload('/upload', formData);
  },
};

export default uploadAPI;
