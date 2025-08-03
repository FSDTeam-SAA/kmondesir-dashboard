import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:3001";

export const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add auth token from NextAuth session
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        await signOut({ callbackUrl: "/login" });
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const categoryAPI = {
  getAll: () => api.get("/category/all-category"),
  getById: (id: string) => api.get(`/category/get-category/${id}`),
  create: (data: FormData) =>
    api.post("/category/create-category", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id: string, data: FormData) =>
    api.patch(`/category/update-category/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id: string) => api.delete(`/category/${id}`),
};

export const audioAPI = {
  getAll: () => api.get("/audio/all-audio"),
  getById: (id: string) => api.get(`/audio/${id}/play`),
  upload: (data: FormData) =>
    api.post("/audio/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id: string, data: FormData) =>
    api.patch(`/audio/${id}/update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id: string) => api.delete(`/audio/${id}`),
};

export const subscriptionAPI = {
  getAll: () => api.get("/subscriptions"),
  getById: (id: string) => api.get(`/subscriptions/${id}`),
  create: (data: any) => api.post("/subscriptions", data),
  update: (id: string, data: any) => api.patch(`/subscriptions/${id}`, data),
  delete: (id: string) => api.delete(`/subscription/${id}`),
};
