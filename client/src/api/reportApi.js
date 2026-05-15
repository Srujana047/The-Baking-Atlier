/**
 * Report API Service
 * Handles all API calls related to content reporting
 */

export function createReportApi(http) {
  return {
    /**
     * Create a new report for inappropriate content
     */
    create: async (reportedType, reportedId, reason) => {
      const { data } = await http.post("/reports", {
        reportedType,
        reportedId,
        reason
      });
      return data;
    },

    /**
     * Get all reports (admin only)
     */
    getAll: async (skip = 0, limit = 20, status = "pending") => {
      const { data } = await http.get("/reports", {
        params: { skip, limit, status }
      });
      return data;
    },

    /**
     * Get a single report by ID (admin only)
     */
    getById: async (reportId) => {
      const { data } = await http.get(`/reports/${reportId}`);
      return data;
    },

    /**
     * Update report status (admin only)
     */
    updateStatus: async (reportId, status) => {
      const { data } = await http.patch(`/reports/${reportId}`, { status });
      return data;
    },

    /**
     * Get reports by a specific reporter
     */
    getByReporter: async (userId, skip = 0, limit = 10) => {
      const { data } = await http.get(`/reports/user/${userId}`, {
        params: { skip, limit }
      });
      return data;
    }
  };
}

export default createReportApi;
