import api from "./axiosConfig"
export const getWeekPlan = (startDate) => api.get("/planner/week", { params: { startDate } })
export const createPlan  = (data)      => api.post("/planner", data)
export const updatePlan  = (id, data)  => api.put(`/planner/${id}`, data)
export const markWorn    = (id)        => api.put(`/planner/${id}/worn`)
export const deletePlan  = (id)        => api.delete(`/planner/${id}`)
