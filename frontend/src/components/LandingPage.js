import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="bg-[#1A202C]">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-[#111827] to-[#1A202C]">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="People working on laptops"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111827] to-[#1A202C] mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-40 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#FFFFFF] sm:text-6xl lg:text-7xl text-center">
            Projexa
          </h1>
          <p className="mt-8 text-xl text-[#E2E8F0] max-w-3xl mx-auto text-center">
            Your complete solution for project management and team
            collaboration. Streamline your workflow, track progress, and achieve
            your goals with ease.
          </p>
          <div className="mt-12 flex justify-center space-x-6">
            <Link
              to="/login"
              className="inline-block bg-[#3182CE] py-4 px-8 border border-transparent rounded-md text-base font-medium text-[#FFFFFF] hover:bg-[#2B6CB0] transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-block bg-[#F6AD55] py-4 px-8 border border-transparent rounded-md text-base font-medium text-[#111827] hover:bg-[#ED8936] transition-colors duration-200"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="py-20 bg-[#111827] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-[#F6AD55] tracking-wide uppercase">
              Powerful Features
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-[#FFFFFF] sm:text-5xl sm:tracking-tight">
              Everything you need for effective project management
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-[#E2E8F0]">
              Designed for teams of all sizes, Projexa helps you manage projects
              from start to finish.
            </p>
          </div>

          <div className="mt-20">
            <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Feature 1 */}
              <div className="p-8 bg-[#1A202C] rounded-lg border border-[#4A5568] shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center h-14 w-14 rounded-md bg-[#3182CE] text-[#FFFFFF] mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-medium text-[#FFFFFF]">
                    User Authentication & Security
                  </h3>
                  <p className="mt-3 text-base text-[#E2E8F0]">
                    Secure user authentication with role-based access control.
                    Protect your data and ensure only authorized team members
                    can access sensitive information.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-8 bg-[#1A202C] rounded-lg border border-[#4A5568] shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center h-14 w-14 rounded-md bg-[#3182CE] text-[#FFFFFF] mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                    />
                  </svg>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-medium text-[#FFFFFF]">
                    Kanban Board View
                  </h3>
                  <p className="mt-3 text-base text-[#E2E8F0]">
                    Visualize your workflow with intuitive Kanban boards.
                    Drag-and-drop tasks between columns to update status and
                    keep everyone aligned.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-8 bg-[#1A202C] rounded-lg border border-[#4A5568] shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center h-14 w-14 rounded-md bg-[#3182CE] text-[#FFFFFF] mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-medium text-[#FFFFFF]">
                    Team Collaboration
                  </h3>
                  <p className="mt-3 text-base text-[#E2E8F0]">
                    Collaborate with your team in real-time. Assign tasks, share
                    files, and communicate efficiently to boost productivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second feature section */}
      <div className="py-20 bg-[#1A202C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-[#FFFFFF] sm:text-4xl">
                Advanced Project Management
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-[#E2E8F0]">
                Keep your projects on track with comprehensive management
                features designed to enhance productivity and visibility.
              </p>
              <div className="mt-12 space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#3182CE] text-[#FFFFFF]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-4 text-lg font-medium text-[#FFFFFF]">
                    Deadlines and Milestones
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#3182CE] text-[#FFFFFF]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-4 text-lg font-medium text-[#FFFFFF]">
                    Progress Tracking
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#3182CE] text-[#FFFFFF]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-4 text-lg font-medium text-[#FFFFFF]">
                    Notifications and Reminders
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#3182CE] text-[#FFFFFF]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-4 text-lg font-medium text-[#FFFFFF]">
                    File Attachments
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <img
                className="rounded-lg shadow-2xl border border-[#4A5568] transform hover:rotate-2 transition-transform duration-300"
                src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                alt="Project management dashboard"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial section */}
      <div className="py-20 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-extrabold text-[#FFFFFF]">
                Trusted by teams worldwide
              </h2>
              <p className="mt-4 text-lg text-[#E2E8F0]">
                See how teams like yours are using Projexa to streamline their
                project workflows and boost productivity.
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-[#1A202C] rounded-lg shadow-xl p-8 border border-[#4A5568]">
                <div className="text-lg text-[#E2E8F0] italic">
                  "Projexa has completely transformed how we manage our
                  projects. The interface is intuitive, and the Kanban boards
                  make it easy to track progress. It's become an essential tool
                  for our team."
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-[#3182CE] flex items-center justify-center text-[#FFFFFF] font-bold text-lg">
                      JD
                    </div>
                  </div>
                  <div className="ml-4 text-left">
                    <div className="font-medium text-[#FFFFFF]">Jane Doe</div>
                    <div className="text-[#E2E8F0]">
                      Product Manager, Tech Inc.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="py-20 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-[#FFFFFF] sm:text-5xl">
              Ready to get started?
            </h2>
            <p className="mt-6 text-xl text-[#E2E8F0] max-w-3xl mx-auto">
              Join thousands of teams already using Projexa to manage their
              projects more effectively.
            </p>
            <div className="mt-10 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-md text-[#111827] bg-[#F6AD55] hover:bg-[#ED8936] transition-colors duration-200"
                >
                  Sign up for free
                </Link>
              </div>
              <div className="ml-4 inline-flex">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-4 border border-[#4A5568] text-lg font-medium rounded-md text-[#FFFFFF] bg-[#1A202C] hover:bg-[#2D3748] transition-colors duration-200"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#111827] border-t border-[#4A5568]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#E2E8F0] hover:text-[#FFFFFF]">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#E2E8F0] hover:text-[#FFFFFF]">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-[#E2E8F0] md:mt-0 md:order-1">
              &copy; 2025 Projexa. All rights reserved.
            </p>
            
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
