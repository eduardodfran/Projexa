import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ProjectContext from '../../context/ProjectContext'
import TaskContext from '../../context/TaskContext'
import AuthContext from '../../context/AuthContext'
import TaskList from '../tasks/TaskList'
import CreateTask from '../tasks/CreateTask'
import KanbanBoard from '../tasks/KanbanBoard'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { getProjectById, currentProject, loading, error, deleteProject } =
    useContext(ProjectContext)
  const { getProjectTasks, tasks } = useContext(TaskContext)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'kanban'
  const [showDescriptionModal, setShowDescriptionModal] = useState(false) // State for description modal

  const refreshProject = async () => {
    if (id) {
      const project = await getProjectById(id)
      if (project) {
        getProjectTasks(id)
      }
    }
  }

  useEffect(() => {
    refreshProject()
  }, [id])

  const handleDeleteClick = () => {
    setConfirmDelete(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(id)
      navigate('/dashboard')
    } catch (err) {
      console.error('Error deleting project:', err)
    }
  }

  const handleDeleteCancel = () => {
    setConfirmDelete(false)
  }

  const isOwner =
    currentProject && user && currentProject.owner._id === user._id

  return (
    <div className="min-h-screen bg-[#111827] py-8">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3182CE]"></div>
          </div>
        )}

        {error && (
          <div className="mb-8">
            <div className="bg-red-100 border-l-4 border-[#E53E3E] text-red-700 p-4 rounded-md shadow-md">
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#3182CE] hover:bg-[#2B6CB0] transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {!currentProject && !loading && !error && (
          <div className="mb-8">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md">
              <h3 className="font-bold">Project not found</h3>
              <p>
                The project you are looking for does not exist or you don't have
                access to it.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#3182CE] hover:bg-[#2B6CB0] transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {currentProject && !loading && !error && (
          <>
            <div className="bg-[#1A202C] rounded-lg shadow-xl border border-[#4A5568] mb-8 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-[#FFFFFF]">
                        {currentProject.title}
                      </h1>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${
                            // Use capitalize to make 'To Do' look like 'To do' if desired, or remove it
                            currentProject.status === 'Done' // Match 'Done' status from Task schema
                              ? 'bg-green-100 text-green-800'
                              : currentProject.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800' // Default to 'To Do' style (yellow)
                          }`}
                      >
                        {currentProject.status || 'To Do'}{' '}
                        {/* Display 'To Do' if status is missing */}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#E2E8F0] mt-2">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-[#3182CE] flex items-center justify-center text-white text-xs mr-2">
                          {/* Add check for owner and name */}
                          {currentProject.owner && currentProject.owner.name
                            ? currentProject.owner.name.charAt(0).toUpperCase()
                            : '?'}
                        </div>
                        {/* Add check for owner and name */}
                        <span>
                          Created by{' '}
                          {currentProject.owner && currentProject.owner.name
                            ? currentProject.owner.name
                            : 'Unknown User'}
                        </span>
                      </div>

                      {currentProject.deadline && (
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            Due{' '}
                            {new Date(
                              currentProject.deadline
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowDescriptionModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-[#4A5568] text-sm font-medium rounded-md text-[#E2E8F0] bg-[#111827] hover:bg-[#2D3748] transition-colors duration-200"
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      View Description
                    </button>
                    {isOwner && (
                      <>
                        <Link
                          to={`/projects/${id}/edit`}
                          className="inline-flex items-center px-4 py-2 border border-[#4A5568] text-sm font-medium rounded-md text-[#E2E8F0] hover:bg-[#2D3748] transition-colors duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={handleDeleteClick}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="inline-flex items-center px-4 py-2 border border-[#4A5568] text-sm font-medium rounded-md text-[#E2E8F0] hover:bg-[#2D3748] transition-colors duration-200"
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                </div>
              </div>
            </div>

            <div className="lg:grid lg:grid-cols-7 gap-8">
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-[#1A202C] rounded-lg shadow-xl border border-[#4A5568] overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-[#4A5568]">
                    <h2 className="text-xl font-semibold text-[#FFFFFF] flex items-center">
                      <svg
                        className="h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Tasks
                    </h2>
                    <div className="flex items-center space-x-3">
                      <div className="flex border border-[#4A5568] rounded-md overflow-hidden">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`px-3 py-1 text-sm ${
                            viewMode === 'list'
                              ? 'bg-[#3182CE] text-white'
                              : 'bg-[#111827] text-[#E2E8F0] hover:bg-[#2D3748]'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setViewMode('kanban')}
                          className={`px-3 py-1 text-sm ${
                            viewMode === 'kanban'
                              ? 'bg-[#3182CE] text-white'
                              : 'bg-[#111827] text-[#E2E8F0] hover:bg-[#2D3748]'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0-2 2"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => setShowCreateTask(!showCreateTask)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#3182CE] hover:bg-[#2B6CB0] transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {showCreateTask ? 'Cancel' : 'Add Task'}
                      </button>
                    </div>
                  </div>

                  {showCreateTask && (
                    <div className="p-6 border-b border-[#4A5568] bg-[#111827]/50">
                      <CreateTask
                        projectId={id}
                        onTaskCreated={() => {
                          setShowCreateTask(false)
                          refreshProject() // Refresh project data after task creation
                        }}
                        currentProject={currentProject} // Pass currentProject as a prop
                      />
                    </div>
                  )}

                  {viewMode === 'list' ? (
                    <TaskList tasks={tasks} projectId={id} />
                  ) : (
                    <div className="p-4">
                      <KanbanBoard projectId={id} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {confirmDelete && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-[#111827] opacity-75"></div>
                  </div>

                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <div className="inline-block align-bottom bg-[#1A202C] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-[#1A202C] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg
                            className="h-6 w-6 text-red-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3 className="text-lg font-medium text-[#FFFFFF]">
                            Delete Project
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-[#E2E8F0]">
                              Are you sure you want to delete this project? All
                              tasks and data associated with it will be
                              permanently removed. This action cannot be undone.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#111827] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={handleDeleteConfirm}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteCancel}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-[#4A5568] shadow-sm px-4 py-2 bg-[#1A202C] text-base font-medium text-[#E2E8F0] hover:bg-[#2D3748] focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showDescriptionModal && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                    onClick={() => setShowDescriptionModal(false)}
                  >
                    <div className="absolute inset-0 bg-[#111827] opacity-75"></div>
                  </div>

                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <div className="inline-block align-bottom bg-[#1A202C] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-[#4A5568]">
                    <div className="bg-[#1A202C] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                          <h3 className="text-lg leading-6 font-medium text-[#FFFFFF] mb-4">
                            Project Description
                          </h3>
                          <div className="mt-2 max-h-96 overflow-y-auto">
                            <p className="text-sm text-[#E2E8F0] whitespace-pre-line">
                              {currentProject.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#111827] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={() => setShowDescriptionModal(false)}
                        className="w-full inline-flex justify-center rounded-md border border-[#4A5568] shadow-sm px-4 py-2 bg-[#1A202C] text-base font-medium text-[#E2E8F0] hover:bg-[#2D3748] focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectDetails
