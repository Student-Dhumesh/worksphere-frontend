import axiosInstance from "./axiosInstance"

const authApi = {

    register: (data) => 
        axiosInstance.post("/auth/register", data),

    login: (data) => 
        axiosInstance.post("/auth/login", data),

    refresh: () => 
        axiosInstance.post("/auth/refresh"),

    getMe: () => 
        axiosInstance.get("/auth/me"),

    updateProfile: (data) => 
        axiosInstance.put("/auth/me", data),

    changePassword: (data) => 
        axiosInstance.patch("/auth/me/password", data),
}

export default authApi