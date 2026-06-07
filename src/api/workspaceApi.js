import axiosInstance from "./axiosInstance"

const workspaceApi = {

    create: (data) => 
        axiosInstance.post("/workspaces", data),

    getAll: () => 
        axiosInstance.get("/workspaces"),

    getJoined: () => 
        axiosInstance.get("/workspaces/joined"),

    getById: (workspaceId) => 
        axiosInstance.get(`/workspaces/${workspaceId}`),

    update: (workspaceId, data) => 
        axiosInstance.put(`/workspaces/${workspaceId}`, data),

    delete: (workspaceId) => 
        axiosInstance.delete(`/workspaces/${workspaceId}`),

    addMember: (workspaceId, data) => 
        axiosInstance.post(`/workspaces/${workspaceId}/members`, data),

    updateMemberRole: (workspaceId, userId, data) => 
        axiosInstance.post(`/workspaces/${workspaceId}/members/${userId}`, data),

    removeMember: (workspaceId, userId) => 
        axiosInstance.delete(`workspaces/${workspaceId}/members/${userId}`),
}

export default workspaceApi