/**
 * context/AuthContext.jsx
 * Global authentication state using React Context API.
 * Provides: user, token, login(), register(), logout(), loading
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { login as loginApi, register as registerApi, getMe } from "../api/authApi"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)  // true while validating stored token

  // Restore session from localStorage on app boot
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("token")
      if (!token) { setLoading(false); return }
      try {
        const { data } = await getMe()
        setUser(data.user)
      } catch {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  const register = useCallback(async (credentials) => {
    const { data } = await registerApi(credentials)
    localStorage.setItem("token", data.token)
    setUser(data.user)
    return data
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await loginApi(credentials)
    localStorage.setItem("token", data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}
