import apiClient from '../../api/client';

/**
 * Standard Response Envelope: { success, message?, data }.
 * unwrap() returns the inner `data` regardless of whether an axios
 * interceptor already peeled a layer.
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

export const commentsService = {
  /**
   * Get comments for a post — GET /api/v1/comments/post/:postId
   * Public, but only for PUBLISHED posts (draft -> 404).
   * Returns a flat array (newest first):
   *   [{ id, content, createdAt, user: { fullName, imageUrl } }]
   */
  getCommentsForPost: async (postId) => {
    const response = await apiClient.get(`/api/v1/comments/post/${postId}`);
    return unwrap(response);
  },

  /**
   * Create a comment — POST /api/v1/comments  (logged-in)
   * Body: { postId, content }  (content 1–1000 chars, not whitespace-only)
   * Author is taken from the token. Returns the created comment WITH user.
   */
  createComment: async (commentData) => {
    const response = await apiClient.post('/api/v1/comments', commentData);
    return unwrap(response);
  },

  /**
   * Update a comment — PATCH /api/v1/comments/:id  (OWNER only)
   * Body: { content }  (1–1000 chars). Non-owner -> 403.
   */
  updateComment: async (id, content) => {
    const response = await apiClient.patch(`/api/v1/comments/${id}`, { content });
    return unwrap(response);
  },

  /**
   * Delete a comment — DELETE /api/v1/comments/:id  (OWNER or ADMIN)
   * Anyone else -> 403.
   */
  deleteComment: async (id) => {
    const response = await apiClient.delete(`/api/v1/comments/${id}`);
    return unwrap(response);
  },
};