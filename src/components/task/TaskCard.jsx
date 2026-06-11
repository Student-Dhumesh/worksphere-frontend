import { useNavigate } from "react-router-dom"

const PRIORITY_COLORS = {
    LOW: "text-blue-400 bg-blue-400/10",
    MEDIUM: "text-yellow-400 bg-yellow-400/10",
    HIGH: "text-red-400 bg-red-400/10",
}

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"]

function TaskCard({
    task,
    workspaceId,
    projectId,
    isOwner,
    onEdit,
    onDelete,
    onStatusChange,
}) {

    const navigate = useNavigate()

    const handleDelete = async (e) => {
        e.stopPropagation()
        if (!confirm("Delete this task?")) return
        try {
            await onDelete(task.id)
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete")
        }
    }

    const handleEdit = (e) => {
        e.stopPropagation()
        onEdit(task)
    }

    const handleStatusChange = async (e) => {
        e.stopPropagation()
        try {
            await onStatusChange(task.id, e.target.value)
        } catch (err) {
            alert(err.response?.data?.message
                || "Failed to update status")
        }
    }

    return (
        <div
            onClick={() => navigate(
                `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`
            )}
            className="bg-gray-900
                border
                border-gray-800
                rounded-lg
                p-3
                cursor-pointer
                hover:border-indigo-500/50
                transition-all
                group"
        >

            <div className="flex items-start
                             justify-between gap-2 mb-2">
                <p className="text-white
                        text-sm
                        font-medium
                        leading-snug
                        group-hover:text-indigo-400
                        transition-colors
                        line-clamp-2">
                    {task.title}
                </p>

                {isOwner && (
                    <div className="flex
                            items-center gap-1
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            shrink-0">
                        <button
                            onClick={handleEdit}
                            className="p-1
                                rounded
                                text-gray-500
                                hover:text-white
                                hover:bg-gray-700
                                transition-colors"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2
                                       2v11a2 2 0 002 2h11a2
                                       2 0 002-2v-5m-1.414
                                       -9.414a2 2 0 112.828
                                       2.828L11.828 15H9
                                       v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-1
                                rounded
                                text-gray-500
                                hover:text-red-400
                                hover:bg-gray-700
                                transition-colors"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2
                                       2 0 0116.138 21H7.862a2
                                       2 0 01-1.995-1.858L5
                                       7m5 4v6m4-6v6m1-10V4a1
                                       1 0 00-1-1h-4a1 1 0
                                       00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {task.description && (
                <p className="text-gray-500 text-xs line-clamp-2 mb-2">
                    {task.description}
                </p>
            )}

            <div className="flex items-center
                             justify-between mt-2">

                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                   ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                </span>

                <select
                    value={task.status}
                    onChange={handleStatusChange}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs
                        bg-gray-800
                        border
                        border-gray-700
                        text-gray-300
                        rounded-md
                        px-2
                        py-0.5
                        focus:outline-none
                        focus:border-indigo-500
                        transition-colors"
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

            </div>
        </div>
    )
}

export default TaskCard