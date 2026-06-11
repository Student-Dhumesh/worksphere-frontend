import { Outlet } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import workspaceApi from "../api/workspaceApi"

function AppLayout() {

    const [workspaces, setWorkspaces] = useState([])
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(true)

    const fetchWorkspaces = useCallback(async () => {
        try {
            const response = await workspaceApi.getAll()
            setWorkspaces(response.data)
        } catch (error) {
            console.error('Failed to fetch workspaces:', error)
        } finally {
            setLoadingWorkspaces(false)
        }
    }, [])

    useEffect(() => {
        fetchWorkspaces()
    }, [fetchWorkspaces])

    const refreshWorkspaces = useCallback(() => {
        fetchWorkspaces()
    }, [fetchWorkspaces])

    return (
        <div className="flex min-h-screen bg-gray-950">

            <Sidebar 
                workspaces={workspaces}
                loading={loadingWorkspaces}
            />

            <div className="flex flex-col flex-1">
                <Navbar />

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet context={{ refreshWorkspaces }}/>
                </main>
            </div>

        </div>
    )
}

export default AppLayout