import React, { createContext, useState, useContext, useEffect } from 'react'
// import axios from '../utils/axiosConfig' // Revert this change
import axios from 'axios' // Use standard axios import
import AuthContext from './AuthContext' // Correct import path if needed
import ProjectContext from './ProjectContext' // Correct import path if needed

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [currentTask, setCurrentTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useContext(AuthContext)
  const { updateTaskInProject, getProjects } = useContext(ProjectContext)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Get all tasks for a project
  const getProjectTasks = async (projectId) => {
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.get(`/tasks?projectId=${projectId}`)
      setTasks(res.data.data)
      setError(null)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tasks')
      console.error('Error fetching tasks:', err)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Get task by ID
  const getTaskById = async (id) => {
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.get(`/tasks/${id}`)
      setCurrentTask(res.data.data)
      setError(null)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching task')
      console.error('Error fetching task:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Create new task
  const createTask = async (taskData) => {
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.post('/tasks', taskData)

      if (getProjects) {
        await getProjects()
      }

      setError(null)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task')
      console.error('Error creating task:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update task
  const updateTask = async (id, taskData) => {
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.put(`/tasks/${id}`, taskData)
      const { task: updatedTaskData, project: updatedProjectData } =
        res.data.data

      setTasks(tasks.map((task) => (task._id === id ? updatedTaskData : task)))
      if (currentTask && currentTask._id === id) {
        setCurrentTask(updatedTaskData)
      }

      if (updateTaskInProject && updatedTaskData.project) {
        const projectId =
          typeof updatedTaskData.project === 'object'
            ? updatedTaskData.project._id
            : updatedTaskData.project

        if (projectId) {
          updateTaskInProject(projectId, updatedTaskData, updatedProjectData)
        } else {
          console.warn(
            'Project ID missing in updated task data, cannot update ProjectContext'
          )
        }
      } else if (!updateTaskInProject) {
        console.warn(
          'updateTaskInProject function not available from ProjectContext.'
        )
      }

      setError(null)
      return updatedTaskData
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating task')
      console.error('Error updating task:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete task
  const deleteTask = async (id) => {
    if (!token) return

    setLoading(true)
    try {
      await axios.delete(`/tasks/${id}`)
      setTasks(tasks.filter((task) => task._id !== id))

      if (currentTask && currentTask._id === id) {
        setCurrentTask(null)
      }

      if (getProjects) {
        await getProjects()
      }

      setError(null)
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting task')
      console.error('Error deleting task:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Add comment to task
  const addComment = async (taskId, text) => {
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.post(`/tasks/${taskId}/comment`, { text })

      if (currentTask && currentTask._id === taskId) {
        setCurrentTask({
          ...currentTask,
          comments: res.data.data,
        })
      }

      setError(null)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding comment')
      console.error('Error adding comment:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        currentTask,
        loading,
        error,
        getProjectTasks,
        getTaskById,
        createTask,
        updateTask,
        deleteTask,
        addComment,
        setCurrentTask,
        setError,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export default TaskContext
