import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectContext from '../../context/ProjectContext'
import AuthContext from '../../context/AuthContext'
import axios from 'axios'

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    team: [],
  })
  const [users, setUsers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  const { createProject, error, setError } = useContext(ProjectContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Fetch users for team selection
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true)
      try {
        const res = await axios.get('/auth/users')
        // Filter out current user from team selection
        const filteredUsers = res.data.data.filter((u) => u._id !== user._id)
        setUsers(filteredUsers)
      } catch (err) {
        console.error('Error fetching users:', err)
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [user._id])

  const { title, description, deadline, team } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTeamChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )
    setFormData({ ...formData, team: selectedOptions })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const project = await createProject(formData)
      navigate(`/projects/${project._id}`)
    } catch (err) {
      console.error('Error creating project:', err)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111827] py-8">
      {/* Changed max-w-4xl to max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FFFFFF]">
            Create New Project
          </h1>
          <p className="text-[#E2E8F0] mt-2">
            Start your new project by filling out the information below.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-[#E53E3E] text-red-700 p-4 mb-6 rounded-md shadow-md">
            <div className="flex">
              <div className="py-1">
                <svg
                  className="h-6 w-6 text-red-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>{error}</div>
            </div>
          </div>
        )}

        <div className="bg-[#1A202C] rounded-lg shadow-xl p-8 border border-[#4A5568]">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-lg font-medium text-[#E2E8F0] mb-2"
              >
                Project Title*
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={onChange}
                className="appearance-none block w-full px-4 py-3 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] transition-all duration-200"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-[#E2E8F0] mb-2"
              >
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                value={description}
                onChange={onChange}
                className="appearance-none block w-full px-4 py-3 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] transition-all duration-200"
                placeholder="Describe your project goals, scope, and other important details"
              />
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="block text-lg font-medium text-[#E2E8F0] mb-2"
              >
                Deadline (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                </div>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={deadline}
                  onChange={onChange}
                  className="appearance-none block w-full pl-10 px-4 py-3 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] transition-all duration-200"
                />
              </div>
              <p className="mt-1 text-sm text-[#E2E8F0]">
                Set a target completion date for your project
              </p>
            </div>

            <div>
              <label
                htmlFor="team"
                className="block text-lg font-medium text-[#E2E8F0] mb-2"
              >
                Team Members
              </label>
              {loadingUsers ? (
                <div className="flex items-center justify-center space-x-2 h-20 bg-[#111827] rounded-md border border-[#4A5568] px-4 py-3">
                  <div className="w-4 h-4 rounded-full animate-pulse bg-[#3182CE]"></div>
                  <div className="w-4 h-4 rounded-full animate-pulse bg-[#3182CE] animation-delay-200"></div>
                  <div className="w-4 h-4 rounded-full animate-pulse bg-[#3182CE] animation-delay-400"></div>
                  <span className="text-[#E2E8F0] ml-2">
                    Loading available team members...
                  </span>
                </div>
              ) : (
                <div className="border border-[#4A5568] rounded-md bg-[#111827]">
                  <select
                    id="team"
                    name="team"
                    multiple
                    value={team}
                    onChange={handleTeamChange}
                    className="appearance-none block w-full px-4 py-3 border-0 rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] sm:text-sm transition-all duration-200"
                    size={Math.min(5, users.length || 5)}
                  >
                    {users.map((user) => (
                      <option key={user._id} value={user._id} className="py-2">
                        {user.name} ({user.email}) - {user.role}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <p className="mt-2 text-sm text-[#E2E8F0]">
                <span className="inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1 text-[#F6AD55]"
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
                  Hold Ctrl/Cmd key to select multiple team members
                </span>
              </p>
              <p className="mt-1 text-sm text-[#E2E8F0]">
                You will be automatically added as the project owner
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-3 border border-[#4A5568] text-sm font-medium rounded-md text-[#E2E8F0] bg-transparent hover:bg-[#2D3748] transition-colors duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#3182CE] hover:bg-[#2B6CB0] transition-colors duration-200 flex items-center ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Project...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Project
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateProject
