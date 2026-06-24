import api from './client'

export const createPaymentIntent = (data) => api.post('/payments/create-intent', data)
export const confirmPayment = (data) => api.post('/payments/confirm', data)
export const getPaymentHistory = () => api.get('/payments/history')
export const refundPayment = (data) => api.post('/payments/refund', data)
