import api from './client'

export const getCarReviews = (carId, params) => api.get(`/reviews/car/${carId}`, { params })
export const getMyReviews  = ()              => api.get('/reviews/my')
export const createReview  = (data)          => api.post('/reviews', data)
export const updateReview  = (id, data)      => api.patch(`/reviews/${id}`, data)
export const deleteReview  = (id)            => api.delete(`/reviews/${id}`)
export const voteHelpful   = (id)            => api.post(`/reviews/${id}/helpful`)
