import api from './client'

export const getProfile          = ()       => api.get('/users/profile')
export const updateProfile       = (data)   => api.patch('/users/profile', data)
export const changePassword      = (data)   => api.patch('/users/change-password', data)
export const getRentalHistory    = (params) => api.get('/users/rental-history', { params })
export const saveCar             = (carId)  => api.post(`/users/save-car/${carId}`)
export const updateDrivingLicense = (data)  => api.patch('/users/driving-license', data)
