import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

// Simple Installment Table Component for Agent
const AgentInstallmentTable = ({ installments }) => {
  if (installments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg font-medium mb-2">No installments assigned yet</p>
          <p className="text-sm">Your admin will assign installments to you soon</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">My Assigned Installments</h3>
        <p className="text-sm text-gray-500 mt-1">Installments assigned to you by admin</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {installments.map((installment, index) => (
              <tr key={installment.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{installment.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Rs {parseFloat(installment.amount || 0).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{installment.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main Agent Dashboard Component
export default function AgentDashboard() {
  const [myInstallments, setMyInstallments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [agentInfo, setAgentInfo] = useState(null)
  const navigate = useNavigate()

  const loadMyInstallments = async () => {
    try {
      setIsLoading(true)
      
      // Get current agent info from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      setAgentInfo(currentUser)
      
      // Load all installments
      const allInstallments = await api('/installments')
      
      // Filter installments assigned to current agent
      const myAssignedInstallments = (allInstallments || []).filter(
        installment => installment.agentName && 
        installment.agentName.toLowerCase() === currentUser.username?.toLowerCase()
      )
      
      setMyInstallments(myAssignedInstallments)
      
    } catch (error) {
      console.error('Failed to load installments:', error)
      // Don't show alert for loading errors, just log them
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMyInstallments()
  }, [])

 

  const totalInstallments = myInstallments.length
  const totalAmount = myInstallments.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Agent Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10">
                <div className="w-full h-full bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">
                    {agentInfo?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {agentInfo?.username || 'Agent'}
                </h1>
                <p className="text-sm text-gray-500">Agent Dashboard</p>
              </div>
            </div>

            {/* Right side - Logout */}
           <button
  onClick={() => {
    if (!window.confirm('Are you sure you want to logout?')) return

    if (typeof onLogout === 'function') {
      // preferred: call the App-level logout which does setUser(null) + navigate('/login')
      onLogout()
    } else {
      // fallback: clear storage and force a safe navigation
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.clear()
      // use replace to avoid back-button exposing a protected route
      window.location.replace('/login')
    }
  }}
  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
  title="Logout"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
  <span>Logout</span>
</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {agentInfo?.username || 'Agent'}!
          </h2>
          <p className="text-gray-600">
            Here are the installments assigned to you by your admin.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* My Installments Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">My Installments</h3>
                <p className="text-3xl font-bold text-green-600">{totalInstallments}</p>
                <p className="text-sm text-gray-500 mt-1">Assigned by admin</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Amount</h3>
                <p className="text-3xl font-bold text-blue-600">Rs {totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Sum of all installments</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <button
            onClick={loadMyInstallments}
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
          >
            <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isLoading ? 'Loading...' : 'Refresh Data'}</span>
          </button>
        </div>

        {/* Agent Info Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-green-800 text-sm">
                <strong>Agent Account:</strong> You are logged in as <strong>{agentInfo?.username}</strong>
              </p>
              <p className="text-green-700 text-xs mt-1">
                You can only view installments that have been assigned to you by your admin.
              </p>
            </div>
          </div>
        </div>

        {/* Installments Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <AgentInstallmentTable installments={myInstallments} />
        )}
      </div>
    </div>
  )
}