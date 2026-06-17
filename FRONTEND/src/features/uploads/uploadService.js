import apiClient from '../../api/client';

export const uploadService = {
  /**
   * Upload an Image
   * Route: POST /api/v1/uploads/image
   * Flow: Step 1 of resource creation
   */
  uploadImage: async (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    // Notice we override the default 'application/json' header.
    // Axios will automatically set the correct multipart boundary for us.
    const response = await apiClient.post('/api/v1/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response; // Returns { success, message, data: { url } }
  }
};