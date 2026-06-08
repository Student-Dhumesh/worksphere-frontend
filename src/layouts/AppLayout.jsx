import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

function AppLayout() {
    return (
        <div className="flex min-h-screen bg-gray-950">

            <Sidebar />

            <div className="flex flex-col flex-1">
                <Navbar />

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

        </div>
    )
}

export default AppLayout