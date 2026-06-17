import apiClient from '../../api/client';

export const postsService = {
  getAllPosts: async () => {
    const response = await apiClient.get('/api/v1/posts');
    return response.data;
  },

  // ADD THIS NEW FUNCTION
  getPostBySlug: async (slug) => {
    const response = await apiClient.get(`/api/v1/posts/${slug}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await apiClient.post('/api/v1/posts', postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await apiClient.delete(`/api/v1/posts/${id}`);
    return response.data;
  }
};