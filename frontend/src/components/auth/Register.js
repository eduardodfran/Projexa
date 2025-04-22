import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'team member',
  })

  const { register, error, setError } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState('')

  const { name, email, password, password2, role } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    // Clear previous errors
    setError(null)
    setLocalError('')

    // Check if passwords match
    if (password !== password2) {
      setLocalError('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      await register({ name, email, password, role })
      // On successful registration, redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
      setIsSubmitting(false)
    }
  }

  const displayError = error || localError

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#111827] to-[#1A202C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-4xl font-extrabold text-[#FFFFFF]">
            Projexa
          </h1>
          <h2 className="mt-4 text-center text-2xl font-bold text-[#E2E8F0]">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-[#E2E8F0]">
            Join Projexa to manage your projects efficiently
          </p>
        </div>

        {displayError && (
          <div
            className="bg-red-100 border-l-4 border-[#E53E3E] text-red-700 p-4 rounded-md shadow-md"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-red-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">{displayError}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => {
                    setError(null)
                    setLocalError('')
                  }}
                >
                  <svg
                    className="fill-current h-6 w-6 text-red-500"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#1A202C] rounded-lg border border-[#4A5568] shadow-xl p-8">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#E2E8F0] mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none block w-full px-3 py-3 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
                placeholder="Enter your full name"
                value={name}
                onChange={onChange}
              />
            </div>

            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-[#E2E8F0] mb-1"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-3 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
                placeholder="Enter your email"
                value={email}
                onChange={onChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#E2E8F0] mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-3 py-3 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={onChange}
                minLength="6"
              />
            </div>

            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-[#E2E8F0] mb-1"
              >
                Confirm Password
              </label>
              <input
                id="password2"
                name="password2"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-3 py-3 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
                placeholder="Confirm your password"
                value={password2}
                onChange={onChange}
                minLength="6"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-[#E2E8F0] mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                className="appearance-none block w-full px-3 py-3 border border-[#4A5568] rounded-md shadow-sm placeholder-gray-400 bg-[#111827] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-[#3182CE] sm:text-sm transition-all duration-200"
                value={role}
                onChange={onChange}
              >
                <option value="team member">Team Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#111827] bg-gradient-to-r from-[#F6AD55] to-[#ED8936] hover:from-[#ED8936] hover:to-[#DD6B20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6AD55] transition-all duration-200 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#111827]"
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
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-[#E2E8F0]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-[#3182CE] hover:text-[#2B6CB0] transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
          <Link
            to="/"
            className="mt-4 inline-block font-medium text-sm text-[#E2E8F0] hover:text-[#FFFFFF] transition-colors duration-200"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
