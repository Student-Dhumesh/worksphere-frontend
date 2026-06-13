import { useNavigate } from 'react-router-dom'

function ProjectCard({
    project,
    workspaceId,
    isOwner,
    isOwnerOrManager,
    onEdit,
    onDelete
}) {

    const navigate = useNavigate()

    const handleDelete = async (e) => {
        e.stopPropagation()
        if (!confirm('Delete this project?')) return
        try {
            await onDelete(project.id)
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete')
        }
    }

    const handleEdit = (e) => {
        e.stopPropagation()
        onEdit(project)
    }

    return (
        <div
            onClick={() => navigate(
                `/workspaces/${workspaceId}/projects/${project.id}`
            )}
            className="bg-gray-900
                border
                border-gray-800
                rounded-xl
                p-5
                cursor-pointer
                hover:border-indigo-500/50
                transition-all
                group">

            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9
                            h-9
                            rounded-lg
                            bg-violet-600/20
                            flex
                            items-center
                            justify-center
                            text-violet-400
                            font-bold">
                        {project.name.charAt(0).toUpperCase()}
                    </div>
                    <h3
                        className="text-white
                            font-semibold
                            text-sm
                            group-hover:text-indigo-400
                            transition-colors">
                        {project.name}
                    </h3>
                </div>

                <div
                    className="flex
                            items-center
                            gap-1
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity">

                    {isOwnerOrManager && (
                        <button
                            onClick={handleEdit}
                            className="p-1.5
                                rounded-lg
                                text-gray-400
                                hover:text-white
                                hover:bg-gray-700
                                transition-colors"
                        >
                            <svg
                                className="w-3.5 h-3.5"
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
                                       2.828L11.828 15H9v-2.828
                                       l8.586-8.586z"
                                />
                            </svg>
                        </button>
                    )}

                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            className="p-1.5
                                rounded-lg
                                text-gray-400
                                hover:text-red-400
                                hover:bg-gray-700
                                transition-colors"
                        >
                            <svg
                                className="w-3.5 h-3.5"
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
                    )}
                </div>

            </div>

            {project.description && (
                <p className="text-gray-500 text-xs line-clamp-2">
                    {project.description}
                </p>
            )}

        </div>
    )
}

export default ProjectCard