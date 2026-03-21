import api from './axios'

export const getTeams      = ()       => api.get('/teams')
export const getTeamById   = (id)     => api.get(`/teams/${id}`)
export const createTeam    = (data)   => api.post('/teams', data)
export const uploadLogo    = (id, file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post(`/teams/${id}/logo`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
