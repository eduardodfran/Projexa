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
      // Ensure the team member data is properly populated
      const project = res.data.data
      setCurrentProject(project)
      setError(null)
      return project
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
      // Make sure we get the fully populated project data
      const createdProject = res.data.data
      setProjects([createdProject, ...projects])
      setError(null)
      return createdProject
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
      const updatedProject = res.data.data

      // Update projects list with the updated project
      setProjects(
        projects.map((project) =>
          project._id === id ? updatedProject : project
        )
      )

      // If this is the current project, update it
      if (currentProject && currentProject._id === id) {
        setCurrentProject(updatedProject)
      }

      setError(null)
      return updatedProject
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

  // Function to update a specific task AND project status within the projects state
  const updateTaskInProject = (projectId, updatedTask, updatedProjectData) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project._id === projectId) {
          // Found the project
          let newTasks = project.tasks || []
          if (project.tasks) {
            // Update the task in its list
            newTasks = project.tasks.map((task) =>
              task && typeof task === 'object' && task._id === updatedTask._id
                ? updatedTask
                : task
            )
          }

          // Merge updated project data (like status) if provided
          const finalProject = updatedProjectData
            ? { ...project, ...updatedProjectData, tasks: newTasks }
            : { ...project, tasks: newTasks }

          return finalProject
        }
        return project // Return project unchanged if no match
      })
    )

    // Also update currentProject if it's the one affected
    if (currentProject && currentProject._id === projectId) {
      setCurrentProject((prevCurrentProject) => {
        if (!prevCurrentProject) return null

        let newTasks = prevCurrentProject.tasks || []
        if (prevCurrentProject.tasks) {
          newTasks = prevCurrentProject.tasks.map((task) =>
            task && typeof task === 'object' && task._id === updatedTask._id
              ? updatedTask
              : task
          )
        }

        // Merge updated project data here too
        const finalProject = updatedProjectData
          ? { ...prevCurrentProject, ...updatedProjectData, tasks: newTasks }
          : { ...prevCurrentProject, tasks: newTasks }

        return finalProject
      })
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
        updateTaskInProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContext
