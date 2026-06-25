import apiClient from '../../api/client';

/**
 * Standard Response Envelope: { success, message?, data: { url } }.
 * Your response interceptor returns the envelope on success, so the
 * uploaded URL is at response.data.url. unwrap() tolerates either shape.
 */
const unwrap = (res) => {
  if (res && res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data.data;
  }
  if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
    return res.data;
  }
  return res?.data ?? res;
};

export const uploadService = {
  /**
   * Upload an Image — POST /api/v1/uploads/image
   * Returns the public URL string.
   *
   * folder: one of 'events' | 'posts' | 'avatars' | 'misc' (else coerced to 'misc')
   *
   * NOTE on Content-Type: we must NOT hard-set 'multipart/form-data' with a
   * fixed string, because that strips the boundary the server needs. Setting
   * it to undefined lets the browser/axios generate the correct
   * 'multipart/form-data; boundary=...' header automatically.
   */
  uploadImage: async (file, folder = 'misc') => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    const response = await apiClient.post('/api/v1/uploads/image', formData, {
      headers: {
        // Override the apiClient's default JSON header so the multipart
        // boundary is generated correctly. undefined => let axios set it.
        'Content-Type': undefined,
      },
    });

    const data = unwrap(response); // { url }
    return data?.url || '';
  },
};