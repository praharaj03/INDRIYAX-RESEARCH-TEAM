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

export const postsService = {
  /**
   * Get All Posts — GET /api/v1/posts
   * Published only for public; AUTHOR/ADMIN also see drafts.
   * Metadata only (NO content). Newest first.
   */
  getAllPosts: async () => {
    const response = await apiClient.get('/api/v1/posts');
    return unwrap(response);
  },

  /**
   * Get Post by Slug — GET /api/v1/posts/:slug
   * Returns full post incl. content.
   * Premium + anonymous -> 401. Draft + non-privileged -> 404.
   */
  getPostBySlug: async (slug) => {
    const response = await apiClient.get(`/api/v1/posts/${slug}`);
    return unwrap(response);
  },

  /**
   * Create Post — POST /api/v1/posts  (AUTHOR, ADMIN)
   * Fields: title, content, excerpt?, coverImage?, published?, isPremium?, tags?
   */
  createPost: async (postData) => {
    const response = await apiClient.post('/api/v1/posts', postData);
    return unwrap(response);
  },

  /**
   * Update Post — PATCH /api/v1/posts/:id  (AUTHOR own / ADMIN any)
   * Send only changed fields. Unknown fields -> 400.
   */
  updatePost: async (postId, postData) => {
    const response = await apiClient.patch(`/api/v1/posts/${postId}`, postData);
    return unwrap(response);
  },

  /**
   * Delete Post — DELETE /api/v1/posts/:id  (AUTHOR own / ADMIN any)
   */
  deletePost: async (postId) => {
    const response = await apiClient.delete(`/api/v1/posts/${postId}`);
    return unwrap(response);
  },
};