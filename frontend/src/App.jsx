// frontend/src/App.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'

function readStoredUser() {
  try {
    const token = localStorage.getItem('token')
    const raw = localStorage.getItem('user')
    if (!token || !raw) return null
    const parsed = JSON.parse(raw)
    // basic sanity check: must have id and email
    if (!parsed?.id || !parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

export default function App() {
  const navigate = useNavigate()

  // initialize only if both token + user exist and look valid
  const [user, setUser] = useState(() => readStoredUser())

  // logout helper
  const onLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  // listen to storage events (other tabs or direct localStorage writes)
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === 'user' || e.key === 'token') {
        setUser(readStoredUser())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // fallback poll for same-tab writes (optional, keeps UI in sync)
  useEffect(() => {
    const interval = setInterval(() => {
      setUser(readStoredUser())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // called by Login/Signup after successful auth
  const onAuth = useCallback((userObj, token) => {
    if (!userObj || !token) return
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userObj))
    setUser(userObj)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login onAuth={onAuth} />
          }
        />
        <Route
          path="/signup"
          element={
            user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Signup onAuth={onAuth} />
          }
        />
        <Route path="/dashboard" element={user ? <UserDashboard user={user} /> : <Navigate to="/login" />} />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
