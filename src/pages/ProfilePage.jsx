import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import authApi from "../api/authApi"

function ProfilePage() {

    const { user, updateUser, logout } = useAuth()
    const navigate = useNavigate()

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
    })
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileError, setProfileError] = useState(null)
    const [profileSuccess, setProfileSuccess] = useState(false)

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState(null)
    const [passwordSuccess, setPasswordSuccess] = useState(false)

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        })
        setProfileError(null)
        setProfileSuccess(false)
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setProfileLoading(true)
        setProfileError(null)
        setProfileSuccess(false)

        try {
            const response = await authApi.updateProfile(profileData)
            updateUser(response.data.user)
            setProfileSuccess(true)
        } catch (err) {
            setProfileError(
                err.response?.data?.message
                || "Failed to update profile."
            )
        } finally {
            setProfileLoading(false)
        }
    }


    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
        setPasswordError(null)
        setPasswordSuccess(false)
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setPasswordError(null)
        setPasswordSuccess(false)

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match.")
            return
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError(
                "New password must be at least 8 characters."
            )
            return
        }

        setPasswordLoading(true)

        try {
            await authApi.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })
            setPasswordSuccess(true)
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
        } catch (err) {
            setPasswordError(
                err.response?.data?.message
                || "Failed to change password."
            )
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">

            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex
                        items-center
                        gap-2
                        text-gray-400
                        hover:text-white
                        text-sm
                        transition-colors">
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
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back
                </button>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white">
                    Profile Settings
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    Manage your account details
                </p>
            </div>

            <div
                className="bg-gray-900
                    border
                    border-gray-800
                    rounded-2xl
                    p-6
                    flex
                    items-center
                    gap-4">
                <div
                    className="w-16
                        h-16
                        rounded-full
                        bg-indigo-600/20
                        flex
                        items-center
                        justify-center
                        text-indigo-400
                        text-2xl
                        font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="text-white font-semibold text-lg">
                        {user?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
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
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">
                    Update Profile
                </h3>

                {profileError && (
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
                        {profileError}
                    </div>
                )}

                {profileSuccess && (
                    <div
                        className="mb-4
                            px-4
                            py-3
                            rounded-lg
                            bg-green-500/10
                            border
                            border-green-500/20
                            text-green-400
                            text-sm">
                        Profile updated successfully.
                    </div>
                )}

                <form onSubmit={handleProfileSubmit}
                    className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            required
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
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full
                                px-4
                                py-2.5
                                bg-gray-800/50
                                border
                                border-gray-700
                                rounded-lg
                                text-gray-500 text-sm
                                cursor-not-allowed"
                        />
                        <p className="text-gray-600 text-xs mt-1">
                            Email cannot be changed.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={profileLoading}
                        className="px-4
                            py-2.5
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
                        {profileLoading
                            ? 'Saving...'
                            : 'Save Changes'}
                    </button>
                </form>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">
                    Change Password
                </h3>

                {passwordError && (
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
                        {passwordError}
                    </div>
                )}

                {passwordSuccess && (
                    <div
                        className="mb-4
                            px-4
                            py-3
                            rounded-lg
                            bg-green-500/10
                            border
                            border-green-500/20
                            text-green-400
                            text-sm">
                        Password changed successfully.
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit}
                    className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Current Password
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="••••••••"
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
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="••••••••"
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
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="••••••••"
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

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="px-4
                            py-2.5
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
                        {passwordLoading
                            ? "Updating..."
                            : "Update Password"}
                    </button>
                </form>
            </div>

        </div>
    )
}

export default ProfilePage