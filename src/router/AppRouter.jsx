import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import ProtectedRoute from "../components/ProtectedRoute"
import AppLayout from "../layouts/AppLayout"
import useAuth from "../hooks/useAuth"

import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import DashboardPage from "../pages/DashboardPage"
import WorkspacePage from "../pages/WorkspacePage"
import ProjectPage from "../pages/ProjectPage"
import TaskPage from "../pages/TaskPage"

function AppRouter() {

    const { isAuthenticated } = useAuth()

    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={
                        isAuthenticated
                            ? <Navigate to="/dashboard" replace />
                            : <LoginPage />
                    }
                />

                <Route
                    path="/register"
                    element={
                        isAuthenticated
                            ? <Navigate to="/dashboard" replace />
                            : <RegisterPage />
                    }
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={<Navigate to="/dashboard" replace />}
                    />

                    <Route
                        path="dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="workspaces/:workspaceId"
                        element={<WorkspacePage />}
                    />

                    <Route
                        path="workspaces/:workspaceId/projects/:projectId"
                        element={<ProjectPage />}
                    />

                    <Route
                        path="workspaces/:workspaceId/projects/:projectId/tasks/:taskId"
                        element={<TaskPage />}
                    />

                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />

            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter