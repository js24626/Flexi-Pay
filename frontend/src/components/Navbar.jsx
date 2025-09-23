// frontend/src/components/Navbar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

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
  src="/images/flexi.png"   // put your logo file inside `public/logo.png` 
  alt="App Logo"
  className="w-12 h-12 object-contain"
/>

                <span className="font-bold text-lg text-gray-100">FLEXYPAY</span>
              </Link>
            </div>

            {/* center (hidden on hero) */}
            {/* <div className="hidden md:flex md:ml-10 md:space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            </div> */}

            {/* right side: signup/login on home */}
            <div className="ml-auto flex items-center gap-3">
              <Link to="/signup" className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50">Sign up</Link>
              <Link to="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">Log in</Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Default navbar for logged-in users (or when not on home)
  return (
    <nav className="bg-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Brand */}
          <div className="flex items-center">
            <Link to="/" className="inline-flex items-center gap-3">
                <img 
  src="/images/flexi.png"   // put your logo file inside `public/logo.png` 
  alt="App Logo"
  className="w-12 h-12 object-contain"
/>
              <span className="font-bold text-lg text-gray-800">FlexyPay</span>
            </Link>
          </div>

          {/* center links */}
          {/* <div className="hidden md:flex md:ml-10 md:space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
          </div> */}

          {/* right side: user info or login/signup */}
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="px-3 py-1.5 border rounded text-sm">
                  {user.full_name ? user.full_name : user.email}
                </Link>
                <button onClick={onLogout} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/signup" className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50">Sign up</Link>
                <Link to="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">Log in</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
