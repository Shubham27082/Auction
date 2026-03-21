import api from './axios'

export const startAuction  = (playerId)          => api.post('/auctions/start', { playerId })
export const placeBid      = (data)              => api.post('/auctions/bid', data)
export const markSold      = (id)                => api.post(`/auctions/${id}/sold`)
export const markUnsold    = (id)                => api.post(`/auctions/${id}/unsold`)
export const getActive     = ()                  => api.get('/auctions/active')
export const getAuction    = (id)                => api.get(`/auctions/${id}`)
export const getBidHistory = (id)                => api.get(`/auctions/${id}/bids`)
