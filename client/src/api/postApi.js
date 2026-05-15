/**
 * Post API Service
 * Handles all API calls related to posts
 */

export function createPostApi(http) {
  return {
    /**
     * Create a new casual post
     */
    create: async (caption) => {
      const { data } = await http.post("/posts", { caption });
      return data;
    },

    /**
     * Fetch posts for the community feed
     * @param {number} skip - Number of posts to skip for pagination
     * @param {number} limit - Number of posts to fetch
     */
    getAll: async (skip = 0, limit = 10) => {
      const { data } = await http.get("/posts", {
        params: { skip, limit }
      });
      return data;
    },

    /**
     * Get a single post by ID
     */
    getById: async (postId) => {
      const { data } = await http.get(`/posts/${postId}`);
      return data;
    },

    /**
     * Like a post
     */
    like: async (postId) => {
      const { data } = await http.post(`/posts/${postId}/like`);
      return data;
    },

    /**
     * Unlike a post
     */
    unlike: async (postId) => {
      const { data } = await http.delete(`/posts/${postId}/like`);
      return data;
    },

    /**
     * Delete a post
     */
    delete: async (postId) => {
      const { data } = await http.delete(`/posts/${postId}`);
      return data;
    },

    /**
     * Get posts by a specific user
     */
    getByUser: async (userId, skip = 0, limit = 10) => {
      const { data } = await http.get(`/posts/user/${userId}`, {
        params: { skip, limit }
      });
      return data;
    }
  };
}

export default createPostApi;
