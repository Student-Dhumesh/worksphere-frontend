import { createContext, useState, useEffect } from "react"
import authApi from "../api/authApi"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const restoreUser = async () => {
            const token = localStorage.getItem("accessToken")

            if (!token) {
                setLoading(false)
                return
            }

            try {
                const response = await authApi.getMe()
                setUser(response.data)
            } catch (error) {
                localStorage.clear()
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        restoreUser()
    }, [])

    const register = async(data) => {
        const response = await authApi.register(data)
        const { accessToken, refreshToken, user } = response.data

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
        setUser(user)

        return response.data
    }

    const login = async(data) => {
        const response = await authApi.login(data)
        const { accessToken, refreshToken, user } = response.data

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
        setUser(user)

        return response.data
    }

    const logout = ()  => {
        localStorage.clear()
        setUser(null)
    }

    const updateUser = (updateUser) => {
        setUser(updateUser)
    }

    const value = {
        user, 
        loading, 
        register,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}