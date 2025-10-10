// frontend/src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-[7fr_3fr] relative overflow-hidden">
      {/* Left Side (Text content with dark blue background) */}
      <div className="bg-[#0d2953] flex flex-col justify-center px-8">
        <div className="max-w-xl">
          {/* Logo + FlexiPay text */}
          <div className="flex items-center mb-6">
            <img 
              src="/images/flexi.png"  // your logo file in public/images/
              alt="FlexiPay Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-xl font-semibold text-white tracking-wide">
              FlexiPay
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
           Flexible installments, simplified for communities
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-200 mb-8">
           FlexyPay helps groups and committees collect, track and approve installment payments. Users submit instalments easily — admins review and approve. Secure auth, clear records, and a clean workflow.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              to="/login"
              className="bg-green-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition"
            >
              Login
            </Link>

           
          </div>
        </div>
      </div>

     <div className="bg-gray-200 flex items-center justify-center p-6">
  <img 
    src="/images/sideimg.png"   // replace with your illustration
    alt="Community illustration"
    className="w-full max-w-sm h-auto object-contain"  // increased from xs → sm
  />
</div>



      {/* Footer (bottom center, no scroll) */}
      <footer className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} FlexyPay — All rights reserved.
      </footer>
    </div>
  )
}
