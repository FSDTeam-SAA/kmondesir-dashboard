import { api } from "./api"

export const authAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),

  forgotPassword: (data: { email: string }) => api.post("/auth/forget", data),

  verifyOTP: (data: { email: string; otp: string }) => api.post("/auth/verify", data),

  resetPassword: (data: { password: string; otp: string; email: string }) => api.post("/auth/reset-password", data),

  changePassword: (data: { oldPassword: string; newPassword: string }) => api.post("/auth/change-password", data),
}
