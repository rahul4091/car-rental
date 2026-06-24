import api from './client'

export const getLocations = (params) => api.get('/locations', { params })
export const getCities = () => api.get('/locations/cities')
export const getLocationById = (id) => api.get(`/locations/${id}`)
