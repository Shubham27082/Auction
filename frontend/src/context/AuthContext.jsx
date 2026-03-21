import { createContext, useContext, useState, useCallback } from 'react'
import { login as loginApi } from '../api/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => JSON.parse(localStorage.getItem('user')  || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const login = useCallback(async (credentials) => {
    const res = await loginApi(credentials)
    const { token, username, role } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ username, role }))
    setToken(token)
    setUser({ username, role })
    toast.success(`Welcome, ${username}!`)
    return res
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
