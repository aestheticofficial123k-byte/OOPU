/**
 * context/AuthContext.jsx
 * Global authentication state using React Context API.
 * Provides: user, token, login(), register(), phoneLogin(),
 * googleLogin(), updateProfile(), logout(), loading
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react"

import {
  login as loginApi,
  register as registerApi,
  phoneLogin as phoneLoginApi,
  googleLogin as googleLoginApi,
  updateProfile as updateProfileApi,
  getMe,
} from "../api/authApi"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on app boot
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setLoading(false)
        return
      }

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

  // Email registration
  const register = useCallback(async (credentials) => {
    const { data } = await registerApi(credentials)

    localStorage.setItem("token", data.token)
    setUser(data.user)

    return data
  }, [])

  // Email login
  const login = useCallback(async (credentials) => {
    const { data } = await loginApi(credentials)

    localStorage.setItem("token", data.token)
    setUser(data.user)

    return data
  }, [])

  // Phone login / registration
  const phoneLogin = useCallback(async (credentials) => {
    const { data } = await phoneLoginApi(credentials)

    localStorage.setItem("token", data.token)
    setUser(data.user)

    return data
  }, [])

  // Google login / registration
  const googleLogin = useCallback(async (idToken) => {
    const { data } = await googleLoginApi({ idToken })

    localStorage.setItem("token", data.token)
    setUser(data.user)

    return data
  }, [])

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    const { data } = await updateProfileApi(updates)

    setUser(data.user)
    localStorage.setItem("user", JSON.stringify(data.user))

    return data
  }, [])

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        phoneLogin,
        googleLogin,
        updateProfile,
        logout,
        isAuth: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>")
  }

  return ctx
}