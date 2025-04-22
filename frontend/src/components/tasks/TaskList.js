import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import TaskContext from '../../context/TaskContext'

const TaskList = ({ tasks, projectId }) => {
  const { loading, error } = useContext(TaskContext)

  // Priority color mapping
  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-blue-100 text-blue-800',
    High: 'bg-orange-100 text-orange-800',
    Urgent: 'bg-red-100 text-red-800',
  }

  // Status color mapping
  const statusColors = {
    'To Do': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Done: 'bg-green-100 text-green-800',
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3182CE]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-[#E53E3E] text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-6 text-center text-[#E2E8F0]">
        <p>No tasks have been created for this project yet.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-[#4A5568]">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="hover:bg-[#2D3748] transition-colors duration-200"
        >
          <Link
            to={`/projects/${projectId}/tasks/${task._id}`}
            className="block p-6"
          >
            <div className="flex flex-wrap justify-between items-start">
              <div className="mb-2 w-full sm:w-auto sm:mb-0">
                <h3 className="text-lg font-medium text-[#FFFFFF]">
                  {task.title}
                </h3>
                <p className="mt-1 text-sm text-[#E2E8F0] line-clamp-2">
                  {task.description}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[task.status]
                  }`}
                >
                  {task.status}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    priorityColors[task.priority]
                  }`}
                >
                  {task.priority} Priority
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-[#E2E8F0]">
              <div className="flex items-center mb-2 sm:mb-0">
                {task.assignedTo ? (
                  <div className="flex items-center">
                    <div className="h-6 w-6 bg-[#3182CE] rounded-full flex items-center justify-center text-white text-xs mr-2">
                      {task.assignedTo.name.charAt(0).toUpperCase()}
                    </div>
                    <span>Assigned to: {task.assignedTo.name}</span>
                  </div>
                ) : (
                  <span>Unassigned</span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {task.deadline && (
                  <div className="flex items-center">
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
                    <span>
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {task.comments && task.comments.length > 0 && (
                  <div className="flex items-center">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>
                      {task.comments.length} comment
                      {task.comments.length !== 1 && 's'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default TaskList
