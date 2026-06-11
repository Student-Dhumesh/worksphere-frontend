import { useState } from "react"

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"]

function TaskForm({ task, onSubmit, onClose }) {

    const [formData, setFormData] = useState({
        title: task?.title || "",
        description: task?.description || "",
        priority: task?.priority || "MEDIUM",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const isEditing = !!task

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await onSubmit(formData)
        } catch (err) {
            setError(
                err.response?.data?.message
                || "Something went wrong."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed
                inset-0
                bg-black/60
                backdrop-blur-sm
                flex
                items-center
                justify-center
                z-50
                p-4"
            onClick={onClose}
        >
            <div
                className="bg-gray-900
                    border
                    border-gray-800
                    rounded-2xl
                    p-6
                    w-full
                    max-w-md"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-semibold text-lg">
                        {isEditing ? "Edit Task" : "New Task"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5
                            rounded-lg
                            text-gray-400
                            hover:text-white
                            hover:bg-gray-700
                            transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div 
                        className="mb-4
                            px-4
                            py-3
                            rounded-lg
                            bg-red-500/10 border
                            border-red-500/20
                            text-red-400
                            text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}
                      className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Task title"
                            required
                            className="w-full
                                px-4
                                py-2.5
                                bg-gray-800
                                border
                                border-gray-700
                                rounded-lg
                                text-white
                                placeholder-gray-500
                                text-sm
                                focus:outline-none
                                focus:border-indigo-500
                                focus:ring-1
                                focus:ring-indigo-500
                                transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Description
                            <span className="text-gray-600 font-normal ml-1">
                                (optional)
                            </span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the task..."
                            rows={3}
                            className="w-full
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Priority
                        </label>
                        <div className="flex gap-2">
                            {PRIORITIES.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        priority: p
                                    })}
                                    className={`flex-1 py-2 rounded-lg
                                                text-xs font-medium
                                                border transition-colors
                                                ${formData.priority === p
                                        ? p === "LOW"
                                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                            : p === 'MEDIUM'
                                                ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                                                : "bg-red-500/20 border-red-500/50 text-red-400"
                                        : "bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1
                                py-2.5
                                px-4
                                bg-gray-800
                                hover:bg-gray-700
                                text-gray-300
                                font-medium
                                rounded-lg
                                text-sm
                                transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1
                                py-2.5
                                px-4
                                bg-indigo-600
                                hover:bg-indigo-700
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                text-white 
                                font-medium
                                rounded-lg
                                text-sm
                                transition-colors"
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Create"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default TaskForm