import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import workspaceApi from "../api/workspaceApi"
import projectApi from "../api/projectApi"
import ProjectCard from "../components/project/ProjectCard"
import ProjectForm from "../components/project/ProjectForm"

function WorkspacePage() {

    const { workspaceId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [workspace, setWorkspace] = useState(null)
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [editingProject, setEditingProject] = useState(null)
    const [activeTab, setActiveTab] = useState("projects")

    const [memberEmail, setMemberEmail] = useState('')
    const [memberRole, setMemberRole] = useState("MEMBER")
    const [memberLoading, setMemberLoading] = useState(false)
    const [memberError, setMemberError] = useState(null)

    useEffect(() => {
        fetchData()
    }, [workspaceId])

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const [workspaceRes, projectsRes] = await Promise.all([
                workspaceApi.getById(workspaceId),
                projectApi.getByWorkspace(workspaceId),
            ])
            setWorkspace(workspaceRes.data)
            setProjects(projectsRes.data)
        } catch (err) {
            setError("Failed to load workspace.")
        } finally {
            setLoading(false)
        }
    }

    const isOwner = workspace?.ownerEmail === user?.email

    const handleCreateProject = async (data) => {
        const response = await projectApi.create({
            ...data,
            workspaceId: Number(workspaceId),
        })
        setProjects([...projects, response.data])
        setShowProjectForm(false)
    }

    const handleUpdateProject = async (data) => {
        const response = await projectApi.update(
            editingProject.id,
            { ...data, workspaceId: Number(workspaceId) }
        )
        setProjects(projects.map(p =>
            p.id === editingProject.id ? response.data : p
        ))
        setEditingProject(null)
        setShowProjectForm(false)
    }

    const handleDeleteProject = async (projectId) => {
        await projectApi.delete(projectId)
        setProjects(projects.filter(p => p.id !== projectId))
    }

    const handleEditProject = (project) => {
        setEditingProject(project)
        setShowProjectForm(true)
    }

    const handleCloseProjectForm = () => {
        setShowProjectForm(false)
        setEditingProject(null)
    }

    const handleAddMember = async (e) => {
        e.preventDefault()
        setMemberLoading(true)
        setMemberError(null)

        try {
            const response = await workspaceApi.addMember(
                workspaceId,
                { email: memberEmail, role: memberRole }
            )
            setWorkspace({
                ...workspace,
                members: [...workspace.members, response.data],
            })
            setMemberEmail('')
            setMemberRole("MEMBER")
        } catch (err) {
            setMemberError(
                err.response?.data?.message || "Failed to add member."
            )
        } finally {
            setMemberLoading(false)
        }
    }

    const handleRemoveMember = async (userId) => {
        if (!confirm("Remove this member?")) return
        try {
            await workspaceApi.removeMember(workspaceId, userId)
            setWorkspace({
                ...workspace,
                members: workspace.members.filter(
                    m => m.id !== userId
                ),
            })
        } catch (err) {
            alert(err.response?.data?.message || "Failed to remove.")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div 
                    className="w-8
                        h-8
                        border-4
                        border-indigo-500
                        border-t-transparent
                        rounded-full
                        animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div 
                className="px-4
                    py-3
                    rounded-lg
                    bg-red-500/10
                    border
                    border-red-500/20
                    text-red-400
                    text-sm">
                {error}
            </div>
        )
    }

    return (
        <div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-500
                                hover:text-gray-300
                                text-sm
                                transition-colors"
                        >
                            Dashboard
                        </button>
                        <span className="text-gray-600">/</span>
                        <span className="text-gray-300 text-sm">
                            {workspace?.name}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {workspace?.name}
                    </h2>
                    {workspace?.description && (
                        <p className="text-gray-400 text-sm mt-1">
                            {workspace.description}
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setShowProjectForm(true)}
                    className="flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        bg-indigo-600
                        hover:bg-indigo-700
                        text-white
                        text-sm
                        font-medium
                        rounded-lg
                        transition-colors"
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
                    New Project
                </button>
            </div>

            <div 
                className="flex
                    gap-1
                    mb-6
                    bg-gray-900
                    border
                    border-gray-800
                    rounded-lg
                    p-1
                    w-fit">
                {["projects", "members"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-md
                                    text-sm font-medium
                                    capitalize transition-colors
                                    ${activeTab === tab
                                ? "bg-indigo-600 text-white"
                                : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "projects" && (
                <div>
                    {projects.length === 0 ? (
                        <div 
                            className="flex
                                flex-col
                                items-center
                                justify-center
                                py-20
                                text-center">
                            <div 
                                className="w-14
                                    h-14
                                    rounded-2xl
                                    bg-indigo-600/10
                                    flex items-center
                                    justify-center
                                    mb-4">
                                <svg
                                    className="w-7 h-7 text-indigo-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 7v10a2 2 0 002
                                           2h14a2 2 0 002-2V9a2
                                           2 0 00-2-2h-6l-2-2H5a2
                                           2 0 00-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-1">
                                No projects yet
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Create your first project
                            </p>
                            <button
                                onClick={() => setShowProjectForm(true)}
                                className="px-4
                                    py-2
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    text-white text-sm
                                    font-medium
                                    rounded-lg
                                    transition-colors"
                            >
                                Create Project
                            </button>
                        </div>
                    ) : (
                        <div 
                            className="grid
                                grid-cols-1
                                md:grid-cols-2
                                lg:grid-cols-3
                                gap-4">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    workspaceId={workspaceId}
                                    isOwner={isOwner}
                                    onEdit={handleEditProject}
                                    onDelete={handleDeleteProject}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'members' && (
                <div className="max-w-xl space-y-6">

                    {isOwner && (
                        <div 
                            className="bg-gray-900
                                border
                                border-gray-800
                                rounded-xl
                                p-5">
                            <h3 className="text-white font-semibold mb-4">
                                Add Member
                            </h3>

                            {memberError && (
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
                                    {memberError}
                                </div>
                            )}

                            <form
                                onSubmit={handleAddMember}
                                className="flex gap-3"
                            >
                                <input
                                    type="email"
                                    value={memberEmail}
                                    onChange={(e) => {
                                        setMemberEmail(e.target.value)
                                        setMemberError(null)
                                    }}
                                    placeholder="member@email.com"
                                    required
                                    className="flex-1
                                        px-4
                                        py-2
                                        bg-gray-800
                                        border
                                        border-gray-700
                                        rounded-lg
                                        text-white
                                        placeholder-gray-500
                                        text-sm
                                        focus:outline-none
                                        focus:border-indigo-500
                                        transition-colors"
                                />
                                <select
                                    value={memberRole}
                                    onChange={(e) =>
                                        setMemberRole(e.target.value)
                                    }
                                    className="px-3
                                        py-2
                                        bg-gray-800
                                        border border-gray-700
                                        rounded-lg 
                                        text-white
                                        text-sm
                                        focus:outline-none
                                        focus:border-indigo-500
                                        transition-colors"
                                >
                                    <option value="MEMBER">
                                        Member
                                    </option>
                                    <option value="MANAGER">
                                        Manager
                                    </option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={memberLoading}
                                    className="px-4
                                        py-2
                                        bg-indigo-600
                                        hover:bg-indigo-700
                                        disabled:opacity-50
                                        text-white
                                        text-sm
                                        font-medium
                                        rounded-lg
                                        transition-colors"
                                >
                                    {memberLoading ? 'Adding...' : 'Add'}
                                </button>
                            </form>
                        </div>
                    )}

                    <div 
                        className="bg-gray-900
                            border
                            border-gray-800
                            rounded-xl
                            overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-800">
                            <h3 className="text-white font-semibold">
                                Members ({workspace?.members?.length || 0})
                            </h3>
                        </div>

                        {workspace?.members?.length === 0 ? (
                            <p className="text-gray-500 text-sm px-5 py-4">
                                No members yet.
                            </p>
                        ) : (
                            <div className="divide-y divide-gray-800">
                                {workspace?.members?.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex
                                            items-center
                                            justify-between
                                            px-5
                                            py-3"
                                    >
                                        <div className="flex
                                                         items-center
                                                         gap-3">
                                            <div className="w-8
                                                    h-8
                                                    rounded-full
                                                    bg-indigo-600/20
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-indigo-400
                                                    text-sm
                                                    font-semibold">
                                                {member.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">
                                                    {member.name}
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    {member.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs
                                                    px-2
                                                    py-0.5
                                                    rounded-full
                                                    bg-gray-800
                                                    text-gray-400">
                                                {member.role}
                                            </span>
                                            {isOwner && (
                                                <button
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            member.id
                                                        )
                                                    }
                                                    className="p-1.5
                                                        rounded-lg
                                                        text-gray-600
                                                        hover:text-red-400
                                                        hover:bg-gray-800
                                                        transition-colors"
                                                >
                                                    <svg
                                                        className="w-3.5 h-3.5"
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
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showProjectForm && (
                <ProjectForm
                    project={editingProject}
                    onSubmit={
                        editingProject
                            ? handleUpdateProject
                            : handleCreateProject
                    }
                    onClose={handleCloseProjectForm}
                />
            )}

        </div>
    )
}

export default WorkspacePage