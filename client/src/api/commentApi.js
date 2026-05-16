/**
 * Comment API Service
 * Handles all API calls related to comments
 */

export function createCommentApi(http) {
  return {
    /**
     * Create a new comment on a post
     */
    create: async (postId, text) => {
      const { data } = await http.post(`/posts/${postId}/comments`, { text });
      return data;
    },

    /**
     * Fetch comments for a specific post
     * @param {string} postId - The post ID
     * @param {number} skip - Number of comments to skip for pagination
     * @param {number} limit - Number of comments to fetch
     */
    getByPost: async (postId, skip = 0, limit = 10) => {
      const { data } = await http.get(`/posts/${postId}/comments`, {
        params: { skip, limit }
      });
      return data;
    },

    /**
     * Get a single comment by ID
     */
    getById: async (commentId) => {
      const { data } = await http.get(`/comments/${commentId}`);
      return data;
    },

    /**
     * Delete a comment
     */
    delete: async (commentId) => {
      const { data } = await http.delete(`/comments/${commentId}`);
      return data;
    },

    /**
     * Get comments by a specific user
     */
    getByUser: async (userId, skip = 0, limit = 10) => {
      const { data } = await http.get(`/comments/user/${userId}`, {
        params: { skip, limit }
      });
      return data;
    },

    // TODO: implement comment liking (Phase 4+)
    // like: async (commentId) => {
    //   const { data } = await http.post(`/comments/${commentId}/like`);
    //   return data;
    // },
    // unlike: async (commentId) => {
    //   const { data } = await http.delete(`/comments/${commentId}/like`);
    //   return data;
    // }
  }
}

export default createCommentApi;
