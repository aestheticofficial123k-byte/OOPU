import api from "./axiosConfig"

export const register = (data) => api.post("/auth/register", data)

export const login = (data) => api.post("/auth/login", data)

export const phoneLogin = (data) =>
  api.post("/auth/phone", data)

export const getMe = () =>
  api.get("/auth/me")