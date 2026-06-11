import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import taskApi from "../api/taskApi"
import CommentList from "../components/comment/CommentList"
import CommentForm from "../components/comment/CommentForm"

const PRIORITY_COLORS = {
    LOW: "text-blue-400 bg-blue-400/10",
    MEDIUM: "text-yellow-400 bg-yellow-400/10",
    HIGH: "text-red-400 bg-red-400/10",
}

const STATUS_COLORS = {
    TODO: "text-gray-400 bg-gray-800",
    IN_PROGRESS: "text-yellow-400 bg-yellow-400/10",
    DONE: "text-green-400 bg-green-400/10",
}

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"]

function TaskPage() {

    const { workspaceId, projectId, taskId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [task, setTask] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchTask()
    }, [taskId])

    const fetchTask = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await taskApi.getById(taskId)
            setTask(response.data)
        } catch (err) {
            setError("Failed to load task.")
        } finally {
            setLoading(false)
        }
    }

    const isOwnerOrManager = user?.role === "ADMIN"
        || user?.role === "MANAGER"

    const handleStatusChange = async (e) => {
        try {
            const response = await taskApi.updateStatus(
                taskId, { status: e.target.value }
            )
            setTask(response.data)
        } catch (err) {
            alert(
                err.response?.data?.message
                || "Failed to update status"
            )
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div
                    className="w-8
                        h-8
                        border-4
                        border-indigo-500
                        border-t-transparent
                        rounded-full
                        animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div
                className="px-4
                    py-3
                    rounded-lg
                    bg-red-500/10
                    border
                    border-red-500/20
                    text-red-400
                    text-sm">
                {error}
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">

            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-500
                        hover:text-gray-300
                        text-sm
                        transition-colors"
                >
                    Dashboard
                </button>
                <span className="text-gray-600">/</span>
                <button
                    onClick={() => navigate(
                        `/workspaces/${workspaceId}`
                    )}
                    className="text-gray-500
                        hover:text-gray-300
                        text-sm
                        transition-colors"
                >
                    Workspace
                </button>
                <span className="text-gray-600">/</span>
                <button
                    onClick={() => navigate(
                        `/workspaces/${workspaceId}/projects/${projectId}`
                    )}
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                    Project
                </button>
                <span className="text-gray-600">/</span>
                <span className="text-gray-300 text-sm truncate max-w-32">
                    {task?.title}
                </span>
            </div>

            <div
                className="bg-gray-900
                    border
                    border-gray-800
                    rounded-2xl
                    p-6
                    mb-6">

                <div
                    className="flex
                        items-start
                        justify-between
                        gap-4
                        mb-4">
                    <h2 className="text-xl font-bold text-white leading-snug">
                        {task?.title}
                    </h2>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2.5 py-1
                                           rounded-full font-medium
                                           ${PRIORITY_COLORS[task?.priority]}`}>
                            {task?.priority}
                        </span>

                        <select
                            value={task?.status}
                            onChange={handleStatusChange}
                            className={`text-xs px-2.5 py-1
                                         rounded-full font-medium
                                         border-0 cursor-pointer
                                         focus:outline-none
                                         focus:ring-1
                                         focus:ring-indigo-500
                                         ${STATUS_COLORS[task?.status]}`}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option
                                    key={s}
                                    value={s}
                                    className="bg-gray-800 text-white"
                                >
                                    {s.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {task?.description ? (
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {task.description}
                    </p>
                ) : (
                    <p className="text-gray-600 text-sm italic mb-4">
                        No description provided.
                    </p>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-1.5">
                        <svg
                            className="w-3.5 h-3.5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5
                                   21h14a2 2 0 002-2V7a2 2 0
                                   00-2-2H5a2 2 0 00-2 2v12a2
                                   2 0 002 2z"
                            />
                        </svg>
                        <span className="text-gray-500 text-xs">
                            {task?.createdAt
                                ? new Date(task.createdAt)
                                    .toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })
                                : '—'
                            }
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <svg
                            className="w-3.5 h-3.5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2
                                   2 0 002-2V9a2 2 0 00-2-2
                                   h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                        </svg>
                        <span className="text-gray-500 text-xs">
                            {task?.projectName}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                <h3 className="text-white font-semibold mb-5">
                    Comments
                </h3>

                <CommentList
                    taskId={taskId}
                    currentUser={user}
                />

                <div className="mt-5 pt-5 border-t border-gray-800">
                    <CommentForm taskId={taskId} />
                </div>
            </div>

        </div>
    )
}

export default TaskPage