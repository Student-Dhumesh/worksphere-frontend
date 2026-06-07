import axiosInstance from "./axiosInstance"

const projectApi = {

    create: (data) => 
        axiosInstance.post("/projects", data),

    getByWorkspace: (workspaceId) => 
        axiosInstance.get(`/projects/workspace/${workspaceId}`),

    getById: (projectId) => 
        axiosInstance.get(`/projects/${projectId}`),

    update: (projectId, data) => 
        axiosInstance.put(`/projects/${projectId}`, data),

    delete: (projectId) => 
        axiosInstance.delete(`/projects/${projectId}`),
}

export default projectApi