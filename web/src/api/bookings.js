import api from './client'

export const createBooking = (data) => api.post('/bookings', data)
export const getMyBookings = () => api.get('/bookings')
export const getBookingById = (id) => api.get(`/bookings/${id}`)
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`)
export const applyCoupon = (data) => api.post('/bookings/apply-coupon', data)
export const rescheduleBooking = (id, data) => api.patch(`/bookings/${id}/reschedule`, data)
export const trackRental = (id) => api.get(`/bookings/${id}/track`)
