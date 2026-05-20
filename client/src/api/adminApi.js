export function createAdminApi(http) {
  return {
    getAnalytics: async () => {
      const { data } = await http.get("/admin/analytics");
      return data;
    },
    getReports: async (status = "pending", skip = 0, limit = 20) => {
      const { data } = await http.get("/admin/reports", {
        params: { status, skip, limit }
      });
      return data;
    },
    updateReportStatus: async (reportId, status) => {
      const { data } = await http.patch(`/reports/${reportId}`, { status });
      return data;
    },
    getPosts: async (search = "", skip = 0, limit = 20) => {
      const { data } = await http.get("/admin/posts", {
        params: { search, skip, limit }
      });
      return data;
    },
    deletePost: async (postId) => {
      const { data } = await http.delete(`/admin/posts/${postId}`);
      return data;
    },
    getComments: async (search = "", skip = 0, limit = 20) => {
      const { data } = await http.get("/admin/comments", {
        params: { search, skip, limit }
      });
      return data;
    },
    deleteComment: async (commentId) => {
      const { data } = await http.delete(`/admin/comments/${commentId}`);
      return data;
    },
    getRecipes: async (search = "", skip = 0, limit = 20) => {
      const { data } = await http.get("/admin/recipes", {
        params: { search, skip, limit }
      });
      return data;
    },
    deleteRecipe: async (recipeId) => {
      const { data } = await http.delete(`/admin/recipes/${recipeId}`);
      return data;
    },
    getUsers: async (search = "", role = "", skip = 0, limit = 20) => {
      const { data } = await http.get("/admin/users", {
        params: { search, role, skip, limit }
      });
      return data;
    },
    getLogs: async (skip = 0, limit = 20) => {
      const { data } = await http.get("/admin/logs", {
        params: { skip, limit }
      });
      return data;
    }
  };
}

export default createAdminApi;
