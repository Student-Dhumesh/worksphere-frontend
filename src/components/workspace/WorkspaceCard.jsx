import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"


function WorkspaceCard({ workspace, onEdit, onDelete }) {

    const navigate = useNavigate()
    const { user } = useAuth()

    const isOwner = workspace.ownerEmail-- - user?.email

    const handleDelete = async (e) => {
        e.stopPropagation()
        if (!confirm("Delete this workspace?")) return

        try {
            await onDelete(workspace.id)
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete")
        }
    }

    const handleEdit = (e) => {
        e.stopPropagation()
        onEdit(workspace)
    }

    return (
        <div
            onClick={() => navigate(`/workspaces/${workspace.id}`)}
            className="bg-gray-900
            border
            border-gray-800
            rounded-xl
            p-5
            cursor-pointer
            hover:border-indigo-500/50
            hover:bg-gray-900/80
            transition-all
            group"
        >
            <div className="flex items-start justify-between mb-3">

                <div className="flex items-center gap-3">

                    <div className="w-10
                    h-10
                    rounded-lg
                    bg-indigo-600/20
                    flex
                    items-center
                    justify-center
                    text-indigo-400
                    font-bold
                    text-lg">
                        {workspace.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h3 className="text-white
                            font-semibold
                            text-sm
                            group-hover:text-indigo-400
                            transition-colors">
                            {workspace.name}
                        </h3>
                        <p className="text-gray-500 text-xs mt-0.5">
                            {isOwner ? "Owner" : "Member"}
                        </p>
                    </div>
                </div>

                {isOwner && (
                    <div
                        className="flex
                        items-center
                        gap-1
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity">

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
                                    d="M11 5H6a2 2 0
                                       00-2 2v11a2 2 0
                                       002 2h11a2 2 0
                                       002-2v-5m-1.414
                                       -9.414a2 2 0 112.828
                                       2.828L11.828
                                       15H9v-2.828l8.586
                                       -8.586z"
                                />
                            </svg>
                        </button>

                        <button
                            onClick={handleDelete}
                            className="p-1.5 rounded-lg
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
                    </div>
                )}
            </div>

            {workspace.description && (
                <p
                    className="text-gray-500
                        text-xs
                        line-clamp-2
                        mb-3">
                    {workspace.description}
                </p>
            )}

            <div
                className="flex
                    items-center
                    gap-1.5
                    text-gray-600
                    text-xs">
                
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
                        d="M17 20h5v-2a3 3 0
                           00-5.356-1.857M17 20H7m10
                           0v-2c0-.656-.126-1.283-.356
                           -1.857M7 20H2v-2a3 3 0
                           015.356-1.857M7 20v-2c0
                           -.656.126-1.283.356-1.857m0
                           0a5.002 5.002 0 019.288
                           0M15 7a3 3 0 11-6 0 3 3 0
                           016 0z"
                    />
                </svg>
                {workspace.members?.length || 0} members
            </div>

        </div>
    )
}

export default WorkspaceCard