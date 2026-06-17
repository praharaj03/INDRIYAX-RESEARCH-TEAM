import apiClient from '../../api/client';

export const commentsService = {
  getCommentsForPost: async (postId) => {
    const response = await apiClient.get(`/api/v1/comments/post/${postId}`);
    return response.data;
  },
  
  createComment: async (commentData) => {
    // commentData expects { postId, content }
    const response = await apiClient.post('/api/v1/comments', commentData);
    return response.data;
  }
};