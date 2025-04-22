import React, { createContext, useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContext'

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [currentTask, setCurrentTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useContext(AuthContext)

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
      setTasks([res.data.data, ...tasks])
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
      setTasks(tasks.map((task) => (task._id === id ? res.data.data : task)))

      if (currentTask && currentTask._id === id) {
        setCurrentTask(res.data.data)
      }

      setError(null)
      return res.data.data
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
