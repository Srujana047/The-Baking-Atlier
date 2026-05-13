export function createAuthApi(http) {
  return {
    signup: async (payload) => {
      const { data } = await http.post("/auth/signup", payload);
      return data;
    },
    login: async (payload) => {
      const { data } = await http.post("/auth/login", payload);
      return data;
    },
    me: async () => {
      const { data } = await http.get("/auth/me");
      return data;
    }
  };
}

