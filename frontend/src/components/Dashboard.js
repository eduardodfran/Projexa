import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import ProjectContext from '../context/ProjectContext'
import ProjectList from './projects/ProjectList'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const { projects } = useContext(ProjectContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Count tasks by status
  const taskStats = {
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
  }

  projects.forEach((project) => {
    if (project.tasks && project.tasks.length > 0) {
      project.tasks.forEach((task) => {
        taskStats.total++
        if (task.status === 'To Do') taskStats.todo++
        else if (task.status === 'In Progress') taskStats.inProgress++
        else if (task.status === 'Done') taskStats.completed++
      })
    }
  })

  return (
    <div className="min-h-screen bg-[#111827]">
      <nav className="bg-[#1A202C] shadow-sm border-b border-[#4A5568]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  to="/dashboard"
                  className="text-xl font-bold text-[#FFFFFF]"
                >
                  Projexa
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="px-3 py-2 text-[#E2E8F0]">Dashboard</div>
                <Link
                  to="/projects/create"
                  className="px-3 py-2 text-[#E2E8F0] hover:text-[#FFFFFF]"
                >
                  New Project
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="hidden md:block mr-3 text-sm font-medium text-[#E2E8F0]">
                    Welcome, {user?.name || 'User'}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-[#FFFFFF]">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-[#E2E8F0]">
              Welcome to your project management dashboard
            </p>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {/* Projects stat card */}
              <div className="bg-[#1A202C] overflow-hidden shadow rounded-lg border border-[#4A5568]">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#3182CE] rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
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
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-[#E2E8F0] truncate">
                          Total Projects
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-[#FFFFFF]">
                            {projects.length}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-[#111827] px-5 py-3">
                  <div className="text-sm">
                    <Link
                      to="/projects/create"
                      className="font-medium text-[#3182CE] hover:text-[#2B6CB0]"
                    >
                      Create new project
                    </Link>
                  </div>
                </div>
              </div>

              {/* Total Tasks stat card */}
              <div className="bg-[#1A202C] overflow-hidden shadow rounded-lg border border-[#4A5568]">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#F6AD55] rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-[#E2E8F0] truncate">
                          Total Tasks
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-[#FFFFFF]">
                            {taskStats.total}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-[#111827] px-5 py-3">
                  <div className="text-sm text-[#E2E8F0]">
                    Across all projects
                  </div>
                </div>
              </div>

              {/* Tasks In Progress stat card */}
              <div className="bg-[#1A202C] overflow-hidden shadow rounded-lg border border-[#4A5568]">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-[#E2E8F0] truncate">
                          In Progress
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-[#FFFFFF]">
                            {taskStats.inProgress}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-[#111827] px-5 py-3">
                  <div className="text-sm text-[#E2E8F0]">
                    Tasks currently in progress
                  </div>
                </div>
              </div>

              {/* Completed Tasks stat card */}
              <div className="bg-[#1A202C] overflow-hidden shadow rounded-lg border border-[#4A5568]">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-[#E2E8F0] truncate">
                          Completed
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-[#FFFFFF]">
                            {taskStats.completed}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-[#111827] px-5 py-3">
                  <div className="text-sm text-[#E2E8F0]">
                    Tasks marked as done
                  </div>
                </div>
              </div>
            </div>

            {/* User Details and Project List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Details */}
              <div className="lg:col-span-1">
                <div className="bg-[#1A202C] rounded-lg shadow-xl p-6 border border-[#4A5568]">
                  <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">
                    Your Profile
                  </h2>

                  {user && (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-[#3182CE] flex items-center justify-center text-white text-xl font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-[#FFFFFF]">
                            {user.name}
                          </h3>
                          <p className="text-sm text-[#E2E8F0]">{user.email}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#4A5568]">
                        <h4 className="text-sm font-medium text-[#E2E8F0] mb-1">
                          Role
                        </h4>
                        <p className="text-[#FFFFFF]">{user.role}</p>
                      </div>

                      {user.createdProjects && (
                        <div className="pt-2 border-t border-[#4A5568]">
                          <h4 className="text-sm font-medium text-[#E2E8F0] mb-1">
                            Projects Created
                          </h4>
                          <p className="text-[#FFFFFF]">
                            {user.createdProjects.length}
                          </p>
                        </div>
                      )}

                      {user.assignedTasks && (
                        <div className="pt-2 border-t border-[#4A5568]">
                          <h4 className="text-sm font-medium text-[#E2E8F0] mb-1">
                            Tasks Assigned
                          </h4>
                          <p className="text-[#FFFFFF]">
                            {user.assignedTasks.length}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Projects List */}
              <div className="lg:col-span-2">
                <ProjectList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
