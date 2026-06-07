import axiosInstance from "./axiosInstance"

const taskApi = {

    create: (data) =>
        axiosInstance.post("/tasks", data),

    getByProject: (projectId, status = null) => {
        const url = status
            ? `/tasks/project/${projectId}?status=${status}`
            : `/tasks/project/${projectId}`

        return axiosInstance.get(url)
    },

    getById: (taskId) => 
        axiosInstance.get(`/tasks/${taskId}`),

    update: (taskId, data) => 
        axiosInstance.put(`/tasks/${taskId}`, data),

    updateStatus: (taskId, data) => 
        axiosInstance.patch(`/tasks/${taskId}/status`, data),

    delete: (taskId) => 
        axiosInstance.delete(`/tasks/%{taskId}`),
}

export default taskApi