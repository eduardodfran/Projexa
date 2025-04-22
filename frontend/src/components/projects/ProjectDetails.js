import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ProjectContext from '../../context/ProjectContext'
import TaskContext from '../../context/TaskContext'
import AuthContext from '../../context/AuthContext'
import TaskList from '../tasks/TaskList'
import CreateTask from '../tasks/CreateTask'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { getProjectById, currentProject, loading, error, deleteProject } =
    useContext(ProjectContext)
  const { getProjectTasks, tasks } = useContext(TaskContext)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const loadProject = async () => {
      const project = await getProjectById(id)
      if (project) {
        getProjectTasks(id)
      }
    }

    loadProject()
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            currentProject.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : currentProject.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {currentProject.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#E2E8F0] mt-2">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-[#3182CE] flex items-center justify-center text-white text-xs mr-2">
                          {currentProject.owner.name.charAt(0).toUpperCase()}
                        </div>
                        <span>Created by {currentProject.owner.name}</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-[#1A202C] rounded-lg shadow-xl p-6 border border-[#4A5568]">
                  <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4 flex items-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Description
                  </h2>
                  <div className="prose prose-invert max-w-none text-[#E2E8F0] whitespace-pre-line">
                    {currentProject.description}
                  </div>
                </div>

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

                  {showCreateTask && (
                    <div className="p-6 border-b border-[#4A5568] bg-[#111827]/50">
                      <CreateTask
                        projectId={id}
                        onTaskCreated={() => setShowCreateTask(false)}
                      />
                    </div>
                  )}

                  <TaskList tasks={tasks} projectId={id} />
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-[#1A202C] rounded-lg shadow-xl p-6 border border-[#4A5568]">
                  <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4 flex items-center">
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Project Details
                  </h2>

                  <div className="space-y-4 divide-y divide-[#4A5568]">
                    <div className="pt-2">
                      <h3 className="text-sm font-medium text-[#E2E8F0]">
                        Status
                      </h3>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                            ${
                              currentProject.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : currentProject.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {currentProject.status}
                        </span>
                      </div>
                    </div>

                    {currentProject.deadline && (
                      <div className="pt-4">
                        <h3 className="text-sm font-medium text-[#E2E8F0]">
                          Deadline
                        </h3>
                        <p className="mt-2 text-sm text-[#FFFFFF] flex items-center">
                          <svg
                            className="h-4 w-4 mr-1 text-[#F6AD55]"
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
                          {new Date(
                            currentProject.deadline
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-[#E2E8F0]">
                        Created On
                      </h3>
                      <p className="mt-2 text-sm text-[#FFFFFF] flex items-center">
                        <svg
                          className="h-4 w-4 mr-1 text-[#E2E8F0]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {new Date(
                          currentProject.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-[#E2E8F0]">
                        Tasks
                      </h3>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-[#111827] p-2 rounded-md">
                          <div className="text-lg font-semibold text-[#FFFFFF]">
                            {
                              tasks.filter((task) => task.status === 'To Do')
                                .length
                            }
                          </div>
                          <div className="text-xs text-[#E2E8F0]">To Do</div>
                        </div>
                        <div className="bg-[#111827] p-2 rounded-md">
                          <div className="text-lg font-semibold text-[#FFFFFF]">
                            {
                              tasks.filter(
                                (task) => task.status === 'In Progress'
                              ).length
                            }
                          </div>
                          <div className="text-xs text-[#E2E8F0]">
                            In Progress
                          </div>
                        </div>
                        <div className="bg-[#111827] p-2 rounded-md">
                          <div className="text-lg font-semibold text-[#FFFFFF]">
                            {
                              tasks.filter((task) => task.status === 'Done')
                                .length
                            }
                          </div>
                          <div className="text-xs text-[#E2E8F0]">Done</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1A202C] rounded-lg shadow-xl p-6 border border-[#4A5568]">
                  <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4 flex items-center">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Team
                  </h2>

                  <div className="mb-4 bg-[#111827] p-3 rounded-md">
                    <h3 className="text-sm font-medium text-[#E2E8F0] mb-2">
                      Project Owner
                    </h3>
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-[#3182CE] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {currentProject.owner.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[#FFFFFF]">
                          {currentProject.owner.name}
                        </p>
                        <p className="text-xs text-[#E2E8F0]">
                          {currentProject.owner.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {currentProject.team && currentProject.team.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-[#E2E8F0] mb-2">
                        Team Members
                      </h3>
                      <ul className="space-y-2">
                        {currentProject.team.map((member) => (
                          <li
                            key={member._id}
                            className="flex items-center p-3 bg-[#111827] rounded-md"
                          >
                            <div className="h-8 w-8 bg-[#F6AD55] rounded-full flex items-center justify-center text-[#111827] font-semibold text-sm">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-[#FFFFFF]">
                                {member.name}
                              </p>
                              <p className="text-xs text-[#E2E8F0]">
                                {member.email}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(!currentProject.team ||
                    currentProject.team.length === 0) && (
                    <div className="text-center p-4 bg-[#111827] rounded-md">
                      <p className="text-sm text-[#E2E8F0]">
                        No team members yet
                      </p>
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
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectDetails
