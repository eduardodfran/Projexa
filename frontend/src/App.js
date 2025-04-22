import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import { TaskProvider } from './context/TaskContext'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import ProjectDetails from './components/projects/ProjectDetails'
import CreateProject from './components/projects/CreateProject'
import './App.css'

// Private route component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Set LandingPage as the root route */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/projects/create"
                  element={
                    <PrivateRoute>
                      <CreateProject />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <PrivateRoute>
                      <ProjectDetails />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App
