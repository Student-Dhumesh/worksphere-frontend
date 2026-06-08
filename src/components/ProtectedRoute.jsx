import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4
                        border-indigo-500
                        border-t-transparent
                        rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm">
                        Loading...
                    </p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute