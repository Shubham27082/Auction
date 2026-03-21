import api from './axios'

export const getPlayers     = (status) => api.get('/players', { params: status ? { status } : {} })
export const getPlayerById  = (id)     => api.get(`/players/${id}`)
export const createPlayer   = (data)   => api.post('/players', data)
export const uploadImage    = (id, file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post(`/players/${id}/image`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export const importExcel    = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/players/import/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
