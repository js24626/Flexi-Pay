// frontend/src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/images/bg.jpg)`
        }}
      ></div>

      {/* Dark overlay (optional for readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-white"></div>

      {/* Page Content */}
      <div className="relative z-10">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Left: Text */}
              <div>
                <div className="inline-flex items-center mb-6">
                  <img 
                    src="/images/flexi.png"   // put your logo file inside public/images/
                    alt="App Logo"
                    className="w-16 h-16 object-contain"
                  />
                  <span className="text-md font-medium text-gray-200 uppercase tracking-wide">
                    FlexyPay
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
                  Flexible installments, simplified for communities
                </h1>

                <p className="text-xl text-gray-200 mb-8 max-w-xl">
                  FlexyPay helps groups and committees collect, track and approve installment payments.
                  Users submit instalments easily — admins review and approve. Secure auth, clear records, and a clean workflow.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition"
                  >
                    Get started (Sign up)
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition bg-white/80"
                  >
                    Log in
                  </Link>
                </div>

               
              </div>

              <div className="relative flex justify-center md:justify-end">
        <img 
          src="/images/pro.png" 
          alt="Community illustration"
          className="w-full max-w-md rounded-2xl  object-cover"
        />
      </div>


            </div>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="border-t border-black/20 mt-12 relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-gray-800">
            <div className="text-sm">© {new Date().getFullYear()} FlexyPay — Built for fair communities.</div>
            <div className="mt-3 md:mt-0 text-sm">Made with ❤️ — Simple, secure, transparent</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
