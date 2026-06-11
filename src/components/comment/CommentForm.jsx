import { useState } from "react"
import commentApi from "../../api/commentApi"
import CommentList from "./CommentList"

function CommentForm({ taskId }) {

    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) return

        setLoading(true)
        setError(null)

        try {
            const response = await commentApi.create({
                content,
                taskId: Number(taskId),
            })

            CommentList.addComment(response.data)
            setContent('')
        } catch (err) {
            setError(
                err.response?.data?.message
                || "Failed to post comment."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {error && (
                <div
                    className="mb-3
                        px-4
                        py-3
                        rounded-lg
                        bg-red-500/10
                        border
                        border-red-500/20
                        text-red-400
                        text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}
                className="flex gap-3 items-end">
                <textarea
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value)
                        setError(null)
                    }}
                    placeholder="Write a comment..."
                    rows={2}
                    className="flex-1
                        px-4
                        py-2.5
                        bg-gray-800
                        border
                        border-gray-700
                        rounded-lg
                        text-white
                        placeholder-gray-500
                        text-sm
                        resize-none
                        focus:outline-none
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500
                        transition-colors"
                />
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="px-4 
                        py-2.5
                        bg-indigo-600
                        hover:bg-indigo-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        text-white
                        text-sm
                        font-medium
                        rounded-lg
                        transition-colors
                        shrink-0"
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </form>
        </div>
    )
}

export default CommentForm