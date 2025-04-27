import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProjectContext from '../../context/ProjectContext'

const ProjectList = () => {
  const { projects, loading, error, getProjects } = useContext(ProjectContext)

  useEffect(() => {
    getProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3182CE]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-[#E53E3E] text-red-700 p-4 mb-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1A202C] rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 border-b border-[#4A5568] flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#FFFFFF]">Your Projects</h2>
        <Link
          to="/projects/create"
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
          New Project
        </Link>
      </div>
      {projects.length === 0 ? (
        <div className="p-6 text-center text-[#E2E8F0]">
          <p className="text-lg mb-4">You don't have any projects yet.</p>
          <Link
            to="/projects/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[#111827] bg-[#F6AD55] hover:bg-[#ED8936] transition-colors duration-200"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-[#4A5568]">
          {projects.map((project) => (
            <li
              key={project._id}
              className="hover:bg-[#2D3748] transition-colors duration-200"
            >
              <Link to={`/projects/${project._id}`} className="block p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-[#FFFFFF]">
                    {project.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${
                      project.status === 'Done'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {project.status || 'To Do'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#E2E8F0] line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-4 flex items-center text-xs text-[#E2E8F0]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
                  {project.deadline ? (
                    <span>
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  ) : (
                    <span>No deadline set</span>
                  )}

                  <span className="mx-4">•</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
                  <span>
                    {project.tasks?.length || 0}{' '}
                    {project.tasks?.length === 1 ? 'task' : 'tasks'}
                  </span>

                  <span className="mx-4">•</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
                  <span>{project.team?.length || 0} team members</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProjectList
