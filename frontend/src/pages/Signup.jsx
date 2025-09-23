// frontend/src/pages/Signup.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Signup(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

 async function handleSignup(e){
  e.preventDefault()

  if (password !== confirmPassword) {
    alert('Passwords do not match!')
    return
  }

  try {
    setLoading(true)
    const data = await api('/auth/signup', { 
      method: 'POST', 
      body: { email, password, full_name: fullName }
    })

    // ✅ check for token (since backend gives token + user)
    if (!data?.token) throw new Error('Signup failed')

    setLoading(false)
    alert('Signup successful! Please login.')
    nav('/login')

  } catch(err) {
    setLoading(false)
    alert(err.message || 'Signup failed')
    console.error('signup error', err)
  }
}


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
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/90 to-gray-900/80"></div>

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          
          {/* Tabs */}
          <div className="flex mb-8">
            <Link 
              to="/login" 
              className="flex-1 text-center py-3 text-gray-300 text-lg font-medium transition-colors hover:text-white"
            >
              SIGN IN
            </Link>
            <div className="flex-1 text-center py-3 text-white text-lg font-medium bg-blue-600/50 rounded-lg border-b-2 border-blue-400">
              SIGN UP
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                USERNAME
              </label>
              <input 
                value={fullName} 
                onChange={e=>setFullName(e.target.value)} 
                placeholder="" 
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
              />
            </div>
            
            {/* Password */}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                REPEAT PASSWORD
              </label>
              <input 
                value={confirmPassword} 
                onChange={e=>setConfirmPassword(e.target.value)} 
                type="password" 
                placeholder="" 
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
              />
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                EMAIL ADDRESS
              </label>
              <input 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="" 
                type="email"
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
              />
            </div>
            
            {/* Button */}
            <div className="pt-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none uppercase tracking-wide"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating…
                  </div>
                ) : (
                  'SIGN UP'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
