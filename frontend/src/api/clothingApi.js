import api from "./axiosConfig"
export const getClothes      = (params)   => api.get("/clothes", { params })
export const getClothingItem = (id)       => api.get(`/clothes/${id}`)
export const addClothing     = (formData) =>
  api.post("/clothes", formData, { headers: { "Content-Type": "multipart/form-data" } })
export const updateClothing  = (id, data) => api.put(`/clothes/${id}`, data)
export const deleteClothing  = (id)       => api.delete(`/clothes/${id}`)
