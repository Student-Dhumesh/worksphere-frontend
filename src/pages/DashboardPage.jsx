import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import workspaceApi from "../api/workspaceApi"
import WorkspaceCard from "../components/workspace/WorkspaceCard"
import WorkspaceForm from "../components/workspace/WorkspaceForm"

function DashboardPage() {

  const { user } = useAuth()
  const { refreshWorkspaces } = useOutletContext()

  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingWorkspace, setEditingWorkspace] = useState(null)

  const fetchWorkspaces = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await workspaceApi.getAll()
      setWorkspaces(response.data)
    } catch (error) {
      setError("Failed to load workspaces.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const handleCreate = async (data) => {
    const response = await workspaceApi.create(data)
    setWorkspaces([...workspaces, response.data])
    setShowForm(false)
    refreshWorkspaces()
  }

  const handleUpdate = async (data) => {
    const response = await workspaceApi.update(
      editingWorkspace.id, data
    )

    setWorkspaces(workspaces.map(w =>
      w.id === editingWorkspace.id ? response.data : w
    ))

    setEditingWorkspace(null)
    setShowForm(false)
    refreshWorkspaces()
  }

  const handleDelete = async (workspaceId) => {
    await workspaceApi.delete(workspaceId)
    setWorkspaces(workspaces.filter(w => w.id !== workspaceId))
    refreshWorkspaces()
  }

  const handleEdit = (workspace) => {
    setEditingWorkspace(workspace)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingWorkspace(null)
  }

  return (

    <div>
      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Dashboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, {" "}
            <span className="text-indigo-400">
              {user?.name}
            </span>
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
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
          New Workspace
        </button>
      </div>

      {error && (
        <div
          className="mb-6
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

      {loading ? (
        <div
          className="grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-4">

          {[...Array(3)].map((_, i) =>
            <div
              key={i}
              className="h-40
                    bg-gray-900
                    border
                    border-gray-800
                    rounded-xl
                    animate-pulse"
            />
          )}
        </div>

      ) : workspaces.length === 0 ? (

        <div
          className="flex
            flex-col
            items-center
            justify-center
            py-20
            text-center">

          <div
            className="w-16
                  h-16
                  rounded-2xl
                  bg-indigo-600/10
                  flex
                  items-center
                  justify-center
                  mb-4">

            <svg
              className="w-8 h-8 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0
                                   012 2v6a2 2 0 01-2
                                   2H5a2 2 0 01-2-2v-6a2
                                   2 0 012-2m14 0V9a2 2
                                   0 00-2-2M5 11V9a2 2 0
                                   012-2m0 0V5a2 2 0
                                   012-2h6a2 2 0 012
                                   2v2M7 7h10"
              />
            </svg>
          </div>

          <h3 className="text-white font-semibold text-lg mb-1">
            No workspaces yet
          </h3>

          <p className="text-gray-500 text-sm mb-6">
            Create your first workspace to get started
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="px-4
              py-2
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              text-sm
              font-medium
              rounded-lg
              transition-colors"
          >
            Create Workspace
          </button>
        </div>

      ) : (

        <div
          className="grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-4">

          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <WorkspaceForm
          workspace={editingWorkspace}
          onSubmit={
            editingWorkspace
              ? handleUpdate
              : handleCreate
          }
          onClose={handleCloseForm}
        />
      )}

    </div>
  )
}

export default DashboardPage
