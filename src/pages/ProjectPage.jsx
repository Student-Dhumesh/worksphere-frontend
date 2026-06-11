import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import projectApi from "../api/projectApi"
import taskApi from "../api/taskApi"
import TaskCard from "../components/task/TaskCard"
import TaskForm from "../components/task/TaskForm"

const STATUS_COLUMNS = ["TODO", "IN_PROGRESS", "DONE"]

const STATUS_LABELS = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
}

const STATUS_COLORS = {
    TODO: "text-gray-400 bg-gray-800",
    IN_PROGRESS: "text-yellow-400 bg-yellow-400/10",
    DONE: "text-green-400 bg-green-400/10",
}

function ProjectPage() {

    const { workspaceId, projectId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [editingTask, setEditingTask] = useState(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const [projectRes, tasksRes] = await Promise.all([
                projectApi.getById(projectId),
                taskApi.getByProject(projectId),
            ])
            setProject(projectRes.data)
            setTasks(tasksRes.data)
        } catch (err) {
            setError("Failed to load project.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [projectId])

    const isOwner = user?.role === "ADMIN"
        || user?.role === "MANAGER"


    const handleCreateTask = async (data) => {
        const response = await taskApi.create({
            ...data,
            projectId: Number(projectId),
        })
        setTasks([...tasks, response.data])
        setShowTaskForm(false)
    }

    const handleUpdateTask = async (data) => {
        const response = await taskApi.update(
            editingTask.id, data
        )
        setTasks(tasks.map(t =>
            t.id === editingTask.id ? response.data : t
        ))
        setEditingTask(null)
        setShowTaskForm(false)
    }

    const handleUpdateStatus = async (taskId, status) => {
        const response = await taskApi.updateStatus(
            taskId, { status }
        )
        setTasks(tasks.map(t =>
            t.id === taskId ? response.data : t
        ))
    }

    const handleDeleteTask = async (taskId) => {
        await taskApi.delete(taskId)
        setTasks(tasks.filter(t => t.id !== taskId))
    }

    const handleEditTask = (task) => {
        setEditingTask(task)
        setShowTaskForm(true)
    }

    const handleCloseTaskForm = () => {
        setShowTaskForm(false)
        setEditingTask(null)
    }


    const getTasksByStatus = (status) =>
        tasks.filter(t => t.status === status)


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
            <div className="px-4
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
        <div className="flex flex-col h-full">

            <div className="flex
                    items-center
                    justify-between
                    mb-6">
                <div>

                    <div className="flex items-center gap-2 mb-1">
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
                        <span className="text-gray-300 text-sm">
                            {project?.name}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {project?.name}
                    </h2>
                    {project?.description && (
                        <p className="text-gray-400 text-sm mt-1">
                            {project.description}
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setShowTaskForm(true)}
                    className="flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        bg-indigo-600
                        hover:bg-indigo-700
                        text-white
                        text-sm
                        font-medium
                        rounded-lg
                        transition-colors"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    New Task
                </button>
            </div>

            <div className="flex gap-3 mb-6">
                {STATUS_COLUMNS.map((status) => (
                    <div
                        key={status}
                        className="flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-lg
                            bg-gray-900 border
                            border-gray-800
                            text-sm"
                    >
                        <span className={`text-xs font-medium
                                          px-2 py-0.5 rounded-full
                                          ${STATUS_COLORS[status]}`}>
                            {STATUS_LABELS[status]}
                        </span>
                        <span className="text-gray-400 font-medium">
                            {getTasksByStatus(status).length}
                        </span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
                {STATUS_COLUMNS.map((status) => (
                    <div
                        key={status}
                        className="flex
                            flex-col
                            bg-gray-900/50
                            border
                            border-gray-800
                            rounded-xl
                            overflow-hidden"
                    >
                        <div
                            className="flex
                                items-center
                                justify-between
                                px-4
                                py-3
                                border-b
                                border-gray-800">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold
                                                  px-2 py-0.5
                                                  rounded-full
                                                  ${STATUS_COLORS[status]}`}>
                                    {STATUS_LABELS[status]}
                                </span>
                            </div>
                            <span className="text-gray-600 text-xs font-medium">
                                {getTasksByStatus(status).length}
                            </span>
                        </div>

                        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                            {getTasksByStatus(status).length === 0 ? (
                                <div className="flex items-center justify-center py-8">
                                    <p className="text-gray-700 text-xs">
                                        No tasks
                                    </p>
                                </div>
                            ) : (
                                getTasksByStatus(status).map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        workspaceId={workspaceId}
                                        projectId={projectId}
                                        isOwner={isOwner}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onStatusChange={
                                            handleUpdateStatus
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showTaskForm && (
                <TaskForm
                    task={editingTask}
                    onSubmit={
                        editingTask
                            ? handleUpdateTask
                            : handleCreateTask
                    }
                    onClose={handleCloseTaskForm}
                />
            )}

        </div>
    )
}

export default ProjectPage