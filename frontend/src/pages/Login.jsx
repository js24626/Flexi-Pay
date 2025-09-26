// frontend/src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Login({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e?.preventDefault()
    try {
      setLoading(true)
      const data = await api('/auth/login', { method: 'POST', body: { email, password } })
      if (!data?.token || !data?.user) throw new Error('Invalid login response')
      // store token + user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      // notify App immediately
      if (onAuth) onAuth(data.user, data.token)
      setLoading(false)
      // redirect based on role
      if (data.user.role === 'admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Login failed')
      console.error('login error', err)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image - matching the design */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')`
        }}
      ></div>
      
      {/* Dark overlay to match the design */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/60 to-gray-900/40"></div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          
          {/* Tab Headers */}
          <div className="flex mb-8">
            <div className="flex-1 text-center py-3 text-white text-lg font-medium bg-blue-600/50 rounded-lg border-b-2 border-blue-400">
              SIGN IN
            </div>
            <Link 
              to="/signup" 
              className="flex-1 text-center py-3 text-gray-300 text-lg font-medium transition-colors hover:text-white"
            >
              SIGN UP
            </Link>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                EMAIL
              </label>
              <input 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="" 
                type="email"
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                PASSWORD
              </label>
              <input 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                type="password" 
                placeholder="" 
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
              />
            </div>

            {/* Keep me signed in checkbox */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="keepSignedIn"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-transparent border-2 border-gray-400 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="keepSignedIn" className="ml-3 text-gray-300 text-sm">
                Keep me Signed in
              </label>
            </div>
            
            {/* Sign In Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none uppercase tracking-wide"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in…
                  </div>
                ) : (
                  'SIGN IN'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-400/30"></div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}