import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff?: boolean
  profile: {
    phone_number: string
    address: string
  }
}

interface RegisterData {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to get token with consistent format
const getStoredToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  return token.startsWith('Token ') ? token : `Token ${token}`
}

// Helper function to set token with consistent format
const setStoredToken = (token: string) => {
  const formattedToken = token.startsWith('Token ') ? token : `Token ${token}`
  localStorage.setItem('token', formattedToken)
  axios.defaults.headers.common['Authorization'] = formattedToken
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = getStoredToken()
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = token

      // Verify the token is valid by making a request
      const response = await axios.get(`${API_BASE_URL}/users/me/`)
      setUser(response.data)
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid token
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        username,
        password
      })
      const token = response.data.token
      setStoredToken(token)
      await checkAuth()
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/`, data)
      await login(data.username, data.password)
    } catch (error: any) {
      console.error('Registration error:', error.response?.data)
      throw new Error(
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        'Registration failed'
      )
    }
  }

  const logout = async () => {
    try {
      const token = getStoredToken()
      if (token) {
        await axios.post(`${API_BASE_URL}/auth/logout/`, {}, {
          headers: { Authorization: token }
        })
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  const updateProfile = async (data: any) => {
    try {
      const token = getStoredToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await axios.put(
        `${API_BASE_URL}/users/update_profile/`,
        data,
        { headers: { Authorization: token } }
      )
      setUser(response.data)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 