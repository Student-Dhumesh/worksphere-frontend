import axiosInstance from "./axiosInstance"

const commentApi = {

    create: (data) =>
        axiosInstance.post("/comments", data),

    getByTask: (taskId) => 
        axiosInstance.get(`/comments/task/${taskId}`),

    update: (commentId, data) => 
        axiosInstance.patch(`/comments/${commentId}`, data),

    delete: (commentId) =>
        axiosInstance.delete(`/comments/${commentId}`),
}

export default commentApi