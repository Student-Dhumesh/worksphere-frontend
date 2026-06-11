import { useState, useEffect } from "react"
import commentApi from "../../api/commentApi"

function CommentList({ taskId, currentUser }) {

    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)
    const [editContent, setEditContent] = useState('')

    useEffect(() => {
        fetchComments()
    }, [taskId])

    const fetchComments = async () => {
        setLoading(true)
        try {
            const response = await commentApi.getByTask(taskId)
            setComments(response.data)
        } catch (err) {
            console.error("Failed to load comments:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (commentId) => {
        if (!confirm("Delete this comment?")) return
        try {
            await commentApi.delete(commentId)
            setComments(comments.filter(c => c.id !== commentId))
        } catch (err) {
            alert(
                err.response?.data?.message
                || "Failed to delete comment"
            )
        }
    }

    const handleEditStart = (comment) => {
        setEditingId(comment.id)
        setEditContent(comment.content)
    }

    const handleEditCancel = () => {
        setEditingId(null)
        setEditContent('')
    }

    const handleEditSave = async (commentId) => {
        if (!editContent.trim()) return
        try {
            const response = await commentApi.update(
                commentId,
                { content: editContent }
            )
            setComments(comments.map(c =>
                c.id === commentId ? response.data : c
            ))
            setEditingId(null)
            setEditContent('')
        } catch (err) {
            alert(
                err.response?.data?.message
                ||
                "Failed to update comment"
            )
        }
    }

    CommentList.addComment = (comment) => {
        setComments(prev => [...prev, comment])
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className="h-16
                            bg-gray-800
                            rounded-lg
                            animate-pulse"
                    />
                ))}
            </div>
        )
    }

    if (comments.length === 0) {
        return (
            <p
                className="text-gray-600
                    text-sm
                    text-center
                    py-6">
                No comments yet. Be the first to comment.
            </p>
        )
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => {

                const isAuthor =
                    comment.authorEmail === currentUser?.email

                return (
                    <div key={comment.id}
                        className="flex gap-3">

                        <div
                            className="w-8
                                h-8
                                rounded-full
                                bg-indigo-600/20
                                flex
                                items-center
                                justify-center
                                text-indigo-400
                                text-xs
                                font-semibold
                                shrink-0
                                mt-0.5">
                            {comment.authorName
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="flex-1">

                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-white text-xs font-medium">
                                    {comment.authorName}
                                </span>
                                <span className="text-gray-600 text-xs">
                                    {new Date(comment.createdAt)
                                        .toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                </span>
                            </div>

                            {editingId === comment.id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(
                                                e.target.value
                                            )
                                        }
                                        rows={2}
                                        className="w-full
                                            px-3
                                            py-2
                                            bg-gray-800
                                            border
                                            border-indigo-500
                                            rounded-lg
                                            text-white
                                            text-sm
                                            resize-none
                                            focus:outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleEditSave(
                                                    comment.id
                                                )
                                            }
                                            className="px-3
                                                py-1
                                                bg-indigo-600
                                                hover:bg-indigo-700
                                                text-white
                                                text-xs
                                                rounded-lg
                                                transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleEditCancel}
                                            className="px-3
                                                py-1
                                                bg-gray-800
                                                hover:bg-gray-700
                                                text-gray-300
                                                text-xs
                                                rounded-lg
                                                transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="group/comment
                                        flex
                                        items-start
                                        justify-between
                                        gap-2">
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {comment.content}
                                    </p>

                                    {isAuthor && (
                                        <div className="flex
                                            items-center
                                            gap-1
                                            opacity-0
                                            group-hover/comment:opacity-100
                                            transition-opacity
                                            shrink-0">
                                            <button
                                                onClick={() =>
                                                    handleEditStart(
                                                        comment
                                                    )
                                                }
                                                className="p-1
                                                    rounded
                                                    text-gray-600
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
                                                        d="M11 5H6a2 2
                                                           0 00-2 2v11a2
                                                           2 0 002 2h11a2
                                                           2 0 002-2v-5
                                                           m-1.414-9.414a2
                                                           2 0 112.828
                                                           2.828L11.828
                                                           15H9v-2.828
                                                           l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        comment.id
                                                    )
                                                }
                                                className="p-1
                                                    rounded
                                                    text-gray-600
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
                                                        d="M19 7l-.867
                                                           12.142A2 2 0
                                                           0116.138 21
                                                           H7.862a2 2 0
                                                           01-1.995-1.858
                                                           L5 7m5 4v6m4
                                                           -6v6m1-10V4a1
                                                           1 0 00-1-1h-4a1
                                                           1 0 00-1 1v3
                                                           M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CommentList