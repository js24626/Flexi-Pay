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
  <div className="h-screen flex flex-col relative overflow-hidden">
    {/* Background Image */}
    <img
      src="/images/FlexyPay.png"
      alt="FlexiPay background"
      className="absolute bottom-0 right-0 w-full h-auto object-contain"
    />

    {/* Login Form Container (centered) */}
    <div className="flex-grow flex items-center justify-center relative z-10">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-xl">
          {/* Tab Header */}
        <div className="flex items-center justify-center mb-8">
  <img
    src="/images/flexi.png"
    alt="App Logo"
    className="w-12 h-12 object-contain"
  />
  <span className=" font-bold text-lg text-gray-600">FLEXYPAY</span>
</div>


          {/* Login Type Selector */}
          <div className="mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
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
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
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
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
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
                <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                  EMAIL
                </label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  type="email"
                  required
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ) : (
              // Agent Login Fields
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                  USERNAME
                </label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter agent username"
                  type="text"
                  required
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                PASSWORD
              </label>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder={`Enter ${loginType} password`}
                required
                className={`w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  loginType === 'admin'
                    ? 'focus:ring-blue-400'
                    : 'focus:ring-emerald-400'
                }`}
              />
            </div>

        

            {/* Sign In Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white rounded-lg font-semibold text-lg shadow-md transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none ${
                  loginType === 'admin'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
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
                <div className="w-full border-t border-gray-200"></div>
              </div>
            </div>

            {/* Login Type Info */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                {loginType === 'admin' ? (
                  <>
                    Logging in as{' '}
                    <span className="text-blue-600 font-medium">
                      Administrator
                    </span>
                    <br />
                    <span className="text-xs">
                      Manage agents and view all installments
                    </span>
                  </>
                ) : (
                  <>
                    Logging in as{' '}
                    <span className="text-emerald-600 font-medium">
                      Agent
                    </span>
                    <br />
                    <span className="text-xs">
                      View your assigned installments
                    </span>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>

    {/* Footer Section */}
    <footer className="relative z-10 pb-4 ">
      <div className="max-w-md mx-auto ">
        <div className="text-center text-sm text-gray-500">
          © 2025 FlexiPay. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
)

}