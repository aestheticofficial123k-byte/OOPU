import api from "./axiosConfig"
export const getSuggestions         = ()         => api.get("/outfits/suggest")
export const getOccasionSuggestions = (occasion) => api.get(`/outfits/suggest/${occasion}`)
