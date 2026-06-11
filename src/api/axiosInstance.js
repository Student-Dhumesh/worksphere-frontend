import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        'Content-Type': "application/json",
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        const isAuthEndpoint = 
        originalRequest.url.includes("/auth/login") || 
        originalRequest.url.includes("/auth/register") ||
        originalRequest.url.includes("/auth/refresh")

        if (error.response?.status == 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem("refreshToken")

                const response = await axios.post(
                    "http://localhost:8080/api/auth/refresh",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`
                        }
                    }
                )

                const { accessToken } = response.data

                localStorage.setItem("accessToken", accessToken)

                originalRequest.headers.Authorization = `Bearer ${accessToken}`

                return axiosInstance(originalRequest)
            } catch (refreshError) {
                localStorage.clear()
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance