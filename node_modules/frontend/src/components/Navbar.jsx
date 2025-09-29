// frontend/src/components/Navbar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const { pathname } = location

  // Only show navbar on home, signup, and login pages
  const showNavbar = pathname === '/' || pathname === '/signup' || pathname === '/login'
  if (!showNavbar) return null

  const isHome = pathname === '/'

  // Show hero variant only when on home AND not logged in
  if (isHome && !user) {
    return (
      <nav className="bg-[#4b5b6a] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {/* Brand */}
            <div className="flex items-center">
              <Link to="/" className="inline-flex items-center ">
                <img
                  src="/images/flexi.png"
                  alt="App Logo"
                  className="w-12 h-12 object-contain"
                />
                <span className="font-bold text-lg text-gray-100">FLEXYPAY</span>
              </Link>
            </div>

            {/* right side: signup/login on home */}
            <div className="ml-auto flex items-center gap-3">
           
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Navbar for signup/login pages
  return (
    <nav className="bg-[#0a0c0e] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Brand */}
          <div className="flex items-center">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/images/flexi.png"
                alt="App Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="font-bold text-lg text-white">FLEXYPAY</span>
            </Link>
          </div>

          {/* right side: login/signup */}
          <div className="ml-auto flex items-center gap-3">
           
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
