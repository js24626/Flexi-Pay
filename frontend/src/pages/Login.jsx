// frontend/src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Login({ onAuth }) {
  const [loginType, setLoginType] = useState('admin') // 'admin' or 'agent'
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleAdminLogin(e) {
    e?.preventDefault()
    try {
      setLoading(true)
      const data = await api('/auth/login', { method: 'POST', body: { email, password } })
      if (!data?.token || !data?.user) throw new Error('Invalid login response')
      
      // Store token + user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Notify App immediately
      if (onAuth) onAuth(data.user, data.token)
      setLoading(false)
      
      // Redirect to admin dashboard
      navigate('/admin')
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Admin login failed')
      console.error('admin login error', err)
    }
  }

  async function handleAgentLogin(e) {
    e?.preventDefault()
    try {
      setLoading(true)
      
      // Use server API for agent login
      const data = await api('/auth/agent-login', { 
        method: 'POST', 
        body: { username, password } 
      })
      
      if (!data?.token || !data?.user) throw new Error('Invalid login response')
      
      // Store token + user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Notify App immediately
      if (onAuth) onAuth(data.user, data.token)
      setLoading(false)
      
      // Redirect to agent dashboard
      navigate('/dashboard')
      
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Agent login failed')
      console.error('agent login error', err)
    }
  }

  const handleLogin = loginType === 'admin' ? handleAdminLogin : handleAgentLogin

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')`
        }}
      ></div>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/60 to-gray-900/40"></div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          
          {/* Tab Headers */}
          <div className="flex mb-8">
            <div className="flex-1 text-center py-3 text-white text-lg font-medium bg-blue-600/50 rounded-lg border-b-2 border-blue-400">
              SIGN IN
            </div>
          </div>

          {/* Login Type Selector */}
          <div className="mb-6">
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setLoginType('admin')
                  setEmail('')
                  setUsername('')
                  setPassword('')
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  loginType === 'admin'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Admin Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType('agent')
                  setEmail('')
                  setUsername('')
                  setPassword('')
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  loginType === 'agent'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Agent Login
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginType === 'admin' ? (
              // Admin Login Fields
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                  EMAIL
                </label>
                <input 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Enter admin email" 
                  type="email"
                  required
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
                />
              </div>
            ) : (
              // Agent Login Fields
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                  USERNAME
                </label>
                <input 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Enter agent username" 
                  type="text"
                  required
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300" 
                />
              </div>
            )}
            
            {/* Password Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                PASSWORD
              </label>
              <input 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                type="password" 
                placeholder={`Enter ${loginType} password`} 
                required
                className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  loginType === 'admin' ? 'focus:ring-blue-400' : 'focus:ring-green-400'
                } focus:border-transparent transition-all duration-300`} 
              />
            </div>

            {/* Agent Credentials Info */}
            {loginType === 'agent' && (
              <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-green-300 text-sm font-medium">Agent Login</p>
                    <p className="text-green-200 text-xs mt-1">
                      Use the username and password provided by your admin to access your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Sign In Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-white rounded-full font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none uppercase tracking-wide ${
                  loginType === 'admin' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in…
                  </div>
                ) : (
                  `SIGN IN AS ${loginType.toUpperCase()}`
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-400/30"></div>
              </div>
            </div>

            {/* Login Type Info */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                {loginType === 'admin' ? (
                  <>
                    Logging in as <span className="text-blue-400 font-medium">Administrator</span>
                    <br />
                    <span className="text-xs">Manage agents and view all installments</span>
                  </>
                ) : (
                  <>
                    Logging in as <span className="text-green-400 font-medium">Agent</span>
                    <br />
                    <span className="text-xs">View your assigned installments</span>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}