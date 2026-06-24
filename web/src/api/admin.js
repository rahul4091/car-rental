import api from './client'

export const getDashboardStats = () => api.get('/admin/dashboard')
export const getFleetStats     = () => api.get('/admin/fleet-stats')

export const getAllUsers        = (params) => api.get('/admin/users', { params })
export const toggleUserStatus  = (id)     => api.patch(`/admin/users/${id}/toggle-status`)

export const getAllBookings     = (params) => api.get('/admin/bookings', { params })
export const updateBookingStatus = (id, data) => api.patch(`/admin/bookings/${id}/status`, data)

export const getAdminPayments  = (params) => api.get('/admin/payments', { params })

export const getAdminReviews   = (params) => api.get('/admin/reviews', { params })
export const approveReview     = (id, data) => api.patch(`/admin/reviews/${id}/moderate`, data)

export const getCoupons        = (params) => api.get('/admin/coupons', { params })
export const createCoupon      = (data)   => api.post('/admin/coupons', data)
export const updateCoupon      = (id, data) => api.patch(`/admin/coupons/${id}`, data)
export const deleteCoupon      = (id)     => api.delete(`/admin/coupons/${id}`)

// Cars (admin)
export const getAdminCars      = (params) => api.get('/cars', { params: { ...params, limit: 100 } })
export const createAdminCar    = (data)   => api.post('/cars', data)
export const updateAdminCar    = (id, data) => api.patch(`/cars/${id}`, data)
export const deleteAdminCar    = (id)     => api.delete(`/cars/${id}`)

// Locations (admin)
export const getAdminLocations    = ()          => api.get('/locations', { params: { active: 'false' } })
export const createAdminLocation  = (data)      => api.post('/locations', data)
export const updateAdminLocation  = (id, data)  => api.patch(`/locations/${id}`, data)
export const deleteAdminLocation  = (id)        => api.delete(`/locations/${id}`)
