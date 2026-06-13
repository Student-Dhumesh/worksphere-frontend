import { NavLink, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function Sidebar({ workspaces, loading }) {

    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <aside
            className="w-64
                bg-gray-900
                border-r
                border-gray-800
                flex
                flex-col
                shrink-0 ">

            <div
                className="flex
                    items-center
                    justify-between
                    px-4
                    pt-6
                    pb-3 ">
                <span
                    className="text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                        tracking-wider ">
                    Workspaces
                </span>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="w-6
                        h-6
                        flex
                        items-center
                        justify-center
                        rounded
                        text-gray-400
                        hover:bg-gray-700
                        transition-colors"
                    title="Manage workspaces"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>
            </div>

            <nav
                className="flex-1
                    overflow-y-auto
                    px-2
                    pb-4" >
                {loading ? (
                    <div
                        className="px-2
                            py-4
                            space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-8
                                bg-gray-800
                                rounded
                                animate-pulse"
                            />
                        ))}
                    </div>
                ) : workspaces.length === 0 ? (
                    <p
                        className="text-gray-600
                            text-xs
                            px-2
                            py-4">
                        No workspaces yet.
                    </p>
                ) : (
                    workspaces.map((workspace) => (
                        <NavLink
                            key={workspace.id}
                            to={`/workspaces/${workspace.id}`}
                            className={({ isActive }) =>
                                `flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-lg
                                text-sm
                                transition-colors
                                ${isActive
                                    ? `bg-indigo-600/20
                                            text-indigo-400`
                                    : `text-gray-400
                                            hover:bg-gray-800
                                            hover:text-white`
                                }`
                            }
                        >
                            <div
                                className="w-5
                                    h-5
                                    rounded
                                    bg-indigo-600/30
                                    flex
                                    items-center
                                    justify-center
                                    text-indigo-400
                                    text-xs
                                    font-bold
                                    shrink-0">
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>

                            <span className="truncate">
                                {workspace.name}
                            </span>
                        </NavLink>
                    ))
                )}

            </nav>

            <div
                className="px-4
                        py-3
                        border-t
                        border-gray-800">
                <p
                    className="text-gray-600
                            text-xs
                            truncate">
                    Logged in as {" "}
                    <span
                        className="text-gray-400">
                        {user?.role}
                    </span>
                </p>
            </div>
        </aside>
    )
}

export default Sidebar