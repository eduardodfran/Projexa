import React, { useState, useContext, useEffect } from 'react'
import TaskContext from '../../context/TaskContext'
import ProjectContext from '../../context/ProjectContext'

const CreateTask = ({ projectId, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    project: projectId,
    assignedTo: '',
    deadline: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    createTask,
    error: taskError,
    setError: setTaskError,
  } = useContext(TaskContext)
  const { currentProject } = useContext(ProjectContext)

  const { title, description, status, priority, assignedTo, deadline } =
    formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTaskError(null)

    try {
      await createTask(formData)
      setFormData({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        project: projectId,
        assignedTo: '',
        deadline: '',
      })

      if (onTaskCreated) {
        onTaskCreated()
      }
    } catch (err) {
      console.error('Error creating task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-[#FFFFFF] mb-4">Add New Task</h3>

      {taskError && (
        <div className="mb-4 bg-red-100 border-l-4 border-[#E53E3E] text-red-700 p-4 rounded-md">
          <p>{taskError}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#E2E8F0] mb-1"
          >
            Task Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={onChange}
            className="appearance-none block w-full px-3 py-2 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#E2E8F0] mb-1"
          >
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            value={description}
            onChange={onChange}
            className="appearance-none block w-full px-3 py-2 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
            placeholder="Describe the task"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-[#E2E8F0] mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={onChange}
              className="appearance-none block w-full px-3 py-2 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-[#E2E8F0] mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={onChange}
              className="appearance-none block w-full px-3 py-2 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium text-[#E2E8F0] mb-1"
            >
              Assign To
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={assignedTo}
              onChange={onChange}
              className="appearance-none block w-full px-3 py-2 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
            >
              <option value="">Unassigned</option>
              <option value={currentProject.owner._id}>
                {currentProject.owner.name} (Owner)
              </option>
              {currentProject.team &&
                currentProject.team.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-[#E2E8F0] mb-1"
            >
              Deadline (optional)
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={deadline}
              onChange={onChange}
              className="appearance-none block w-full px-3 py-2 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#3182CE] hover:bg-[#2B6CB0] transition-colors duration-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Creating...
              </div>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTask
