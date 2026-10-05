import api from "./axiosConfig"

export const getSuggestions = () =>
  api.get("/outfits/suggest")

export const getOccasionSuggestions = (occasion) =>
  api.get(`/outfits/suggest/${occasion}`)

export const createOutfit = (data) =>
  api.post("/outfits", data)

export const getMyOutfits = () =>
  api.get("/outfits/mine")

export const getCommunityOutfits = () =>
  api.get("/outfits/community")

export const toggleLike = (id) =>
  api.put(`/outfits/${id}/like`)

export const toggleSave = (id) =>
  api.put(`/outfits/${id}/save`)

// Edit outfit
export const updateOutfit = (id, data) =>
  api.put(`/outfits/${id}`, data)

// Delete outfit
export const deleteOutfit = (id) =>
  api.delete(`/outfits/${id}`)