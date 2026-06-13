import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function Navbar() {

    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <header
            className="h-16
                bg-gray-900
                border-b
                border-gray-800
                flex
                items-center
                justify-between
                px-6
                shrink-0 ">

            <h1
                className="text-white
                    font-bold
                    text-lg
                    tracking-wide ">
                Work
                <span
                    className="text-indigo-500" >
                    Sphere
                </span>
            </h1>

            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex
                        items-center
                        gap-2
                        cursor-pointer"
                >

                    <div className="w-8
                            h-8
                            rounded-full
                            bg-indigo-600
                            flex
                            items-center
                            justify-center
                            text-white
                            text-sm
                            font-semibold" >
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <span className="text-gray-300 text-sm">
                        {user?.name}
                    </span>

                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />

                    </svg>

                </button>

                {dropdownOpen && (
                    <div className="absolute
                            right-0
                            mt-2
                            w-48
                            bg-gray-800
                            border
                            border-gray-700
                            rounded-lg
                            shadow-xl
                            z-50" >

                        <div className="px-4
                                py-3
                                border-b
                                border-gray-700">
                            <p className="text-white
                                    text-sm
                                    font-medium
                                    truncate">
                                {user?.name}
                            </p>

                            <p className="text-gray-400
                                    text-xs
                                    truncate">
                                {user?.email}
                            </p>

                            <span
                                className="inline-block
                                    mt-1
                                    text-xs
                                    px-2
                                    py-0.5
                                    rounded-full
                                    bg-indigo-600/20
                                    text-indigo-400">
                                {user?.role}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                navigate("/profile")
                                setDropdownOpen(false)
                            }}
                            className="w-full
                                text-left
                                px-4
                                py-2.5
                                text-sm
                                text-gray-300
                                hover:bg-gray-700
                                transition-colors"
                        >
                            Profile Settings
                        </button>

                        <div className="border-t border-gray-700" />

                        <button
                            onClick={handleLogout}
                            className="w-full
                                text-left
                                px-4
                                py-2.5
                                text-sm
                                text-red-400
                                hover:bg-gray-700
                                transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar