import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function RegisterPage() {

    const { register } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "MEMBER",
    })

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await register(formData)
            navigate("/dashboard")
        } catch (error) {
            setError(
                error.response?.data?.message
                || 
                "Something went wrong. Please try again."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen
            bg-gray-950
            flex
            items-center
            justify-center
            px-4">

            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Work
                        <span className="text-indigo-500">
                            Sphere
                        </span>
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Create your account
                    </p>
                </div>

                <div
                    className="bg-gray-900
                    border
                    border-bs-gray-800
                    rounded-2xl
                    p-8">
                    {error && (
                        <div
                            className="mb-4
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

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5">

                        <div>
                            <label
                                className="block
                                    text-sm
                                    font-medium
                                    text-gray-300
                                    mb-1.5">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
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
                            <label
                                className="block
                                    text-sm
                                    font-medium
                                    text-gray-300
                                    mb-1.5">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="John@gmail.com"
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
                            <label
                                className="block
                                    text-sm
                                    font-medium
                                    text-gray-300
                                    mb-1.5">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
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
                            <label
                                className="block
                                    text-sm
                                    font-medium
                                    text-gray-300
                                    mb-1.5">
                                Role
                            </label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full
                                    px-4
                                    py-2.5
                                    bg-gray-800
                                    border
                                    border-gray-700
                                    rounded-lg
                                    text-white
                                    text-sm
                                    focus:outline-none
                                    focus:border-indigo-500
                                    focus:ring-1
                                    focus:ring-indigo-500
                                    transition-colors"
                            >
                                <option value="MEMBER">Member</option>
                                <option value="MANAGER">Manager</option>
                                <option value="ADMIN">Admin</option>

                            </select>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full
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
                                ? "Creating account..."
                                : "Create account"
                            }

                        </button>
                    </form>

                    <p
                        className="text-center
                        text-gray-500
                        text-sm
                        mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-indigo-400
                            hover:text-indigo-300
                            font-medium
                            transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default RegisterPage
