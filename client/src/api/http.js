import axios from "axios";
import { ENV } from "../config/env";

export function createHttpClient({ getToken }) {
  const http = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 15000
  });

  http.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // TODO: add response interceptor for global toast/notifications (Phase 2+)
  return http;
}

