import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Players
export const fetchPlayers      = (params) => api.get('/players', { params })
export const fetchPlayerById   = (id)     => api.get(`/players/${id}`)
export const createPlayer      = (data)   => api.post('/players', data)
export const updatePlayer      = (id, data) => api.put(`/players/${id}`, data)
export const deletePlayer      = (id)       => api.delete(`/players/${id}`)
export const updatePlayerStatus = (id, status) => api.patch(`/players/${id}/status`, null, { params: { status } })
export const uploadPlayerImage = (id, file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post(`/players/${id}/image`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export const importPlayersExcel = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/players/import/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

// Teams
export const fetchTeams    = ()     => api.get('/teams')
export const fetchTeamById = (id)   => api.get(`/teams/${id}`)
export const createTeam    = (data) => api.post('/teams', data)
export const deleteTeam    = (id)   => api.delete(`/teams/${id}`)

// Auction
export const startAuction  = (playerId) => api.post('/auctions/start', { playerId })
export const placeBid      = (data)     => api.post('/auctions/bid', data)
export const markSold      = (id)       => api.post(`/auctions/${id}/sold`)
export const markUnsold    = (id)       => api.post(`/auctions/${id}/unsold`)
export const getActiveAuction = ()      => api.get('/auctions/active')
export const getBidHistory    = (id)    => api.get(`/auctions/${id}/bids`)

export default api
