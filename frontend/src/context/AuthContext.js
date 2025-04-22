import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Set axios defaults
  axios.defaults.baseURL = 'http://localhost:5000/api'

  // Set token in headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await axios.get('/auth/me')
        setUser(res.data.data)
        setIsAuthenticated(true)
        setLoading(false)
      } catch (err) {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
        setError(err.response?.data?.message || 'Authentication error')
        setLoading(false)
      }
    }

    loadUser()
  }, [token])

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true)
      const res = await axios.post('/auth/register', userData)
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
      setIsAuthenticated(true)
      setError(null)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true)
      const res = await axios.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
      setIsAuthenticated(true)
      setError(null)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
