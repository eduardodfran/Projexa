import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContext'

export const ProjectContext = createContext()

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useContext(AuthContext)

  // Get all projects
  const getProjects = async () => {
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.get('/projects')
      setProjects(res.data.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching projects')
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get project by ID
  const getProjectById = async (id) => {
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.get(`/projects/${id}`)
      setCurrentProject(res.data.data)
      setError(null)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching project')
      console.error('Error fetching project:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Create new project
  const createProject = async (projectData) => {
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.post('/projects', projectData)
      setProjects([res.data.data, ...projects])
      setError(null)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating project')
      console.error('Error creating project:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update project
  const updateProject = async (id, projectData) => {
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.put(`/projects/${id}`, projectData)
      setProjects(
        projects.map((project) =>
          project._id === id ? res.data.data : project
        )
      )

      if (currentProject && currentProject._id === id) {
        setCurrentProject(res.data.data)
      }

      setError(null)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating project')
      console.error('Error updating project:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete project
  const deleteProject = async (id) => {
    if (!token) return

    setLoading(true)
    try {
      await axios.delete(`/projects/${id}`)
      setProjects(projects.filter((project) => project._id !== id))

      if (currentProject && currentProject._id === id) {
        setCurrentProject(null)
      }

      setError(null)
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting project')
      console.error('Error deleting project:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Load projects when token changes
  useEffect(() => {
    if (token) {
      getProjects()
    }
  }, [token])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        error,
        getProjects,
        getProjectById,
        createProject,
        updateProject,
        deleteProject,
        setCurrentProject,
        setError,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContext
