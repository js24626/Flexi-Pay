import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

// Amount Creation Form Component for Agent
const AmountCreationForm = ({ onSubmit, agentInfo }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    wasoolAmount: '',
    bakayaAmount: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.date || !formData.wasoolAmount || !formData.bakayaAmount) {
      alert('Please fill in all fields')
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        username: agentInfo?.username
      })
      setFormData({ amount: '', date: '', wasoolAmount: '', bakayaAmount: '' })
    } catch (error) {
      console.error('Error creating amount:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create Amount Entry</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter amount"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wasool Amount *
            </label>
            <input
              type="number"
              name="wasoolAmount"
              value={formData.wasoolAmount}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter wasool amount"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bakaya Amount *
            </label>
            <input
              type="number"
              name="bakayaAmount"
              value={formData.bakayaAmount}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter bakaya amount"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isSubmitting ? 'Creating...' : 'Create Amount'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

// Agent Created Amounts Table Component with Date Filter
const AgentAmountsTable = ({ amounts }) => {
  const [dateFilter, setDateFilter] = useState('')

  // Filter amounts based on date
  const filteredAmounts = amounts.filter(amount => {
    return !dateFilter || amount.date === dateFilter
  })

  const clearDateFilter = () => {
    setDateFilter('')
  }

  if (amounts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <p className="text-lg font-medium mb-2">No amounts created yet</p>
          <p className="text-sm">Create your first amount using the form above</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Created Amounts</h3>
              <p className="text-sm text-gray-500 mt-1">Amounts you have created</p>
            </div>
            {/* Small Stats Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <div className="text-sm text-green-600 font-medium">Total Amounts</div>
              <div className="text-xl font-bold text-green-700">{amounts.length}</div>
            </div>
          </div>
          
          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-40"
            />
            {dateFilter && (
              <button
                onClick={clearDateFilter}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {dateFilter && (
          <p className="text-sm text-gray-600">
            Showing {filteredAmounts.length} of {amounts.length} amounts
            <span className="ml-1 text-green-600">for date: {dateFilter}</span>
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wasool Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bakaya Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAmounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  {dateFilter ? 'No amounts found for this date' : 'No amounts to display'}
                </td>
              </tr>
            ) : (
              filteredAmounts.map((amount, index) => (
                <tr key={amount.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Rs {parseFloat(amount.amount || 0).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Rs {parseFloat(amount.wasoolAmount || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Rs {parseFloat(amount.bakayaAmount || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{amount.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {amount.createdAt ? new Date(amount.createdAt).toLocaleDateString() : '-'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main Agent Dashboard Component
export default function AgentDashboard() {
  const [myAmounts, setMyAmounts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [agentInfo, setAgentInfo] = useState(null)
  const navigate = useNavigate()

  const loadMyAmounts = async () => {
    try {
      setIsLoading(true)
      
      // Get current agent info from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      setAgentInfo(currentUser)
      
      // Load agent's own amounts
      const allAmounts = await api('/agent-amounts/my-amounts')
      setMyAmounts(allAmounts || [])
      
    } catch (error) {
      console.error('Failed to load amounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAmount = async (formData) => {
    try {
      // Create amount entry for agent
      const created = await api('/agent-amounts', { 
        method: 'POST', 
        body: {
          ...formData,
          createdBy: agentInfo?.username,
          createdAt: new Date().toISOString()
        }
      })
      
      // Add to local state
      setMyAmounts(prev => [created, ...prev])
      alert('Amount created successfully!')
      
    } catch (error) {
      console.error('Failed to create amount:', error)
      alert('Failed to create amount. Please try again.')
    }
  }

  useEffect(() => {
    loadMyAmounts()
  }, [])

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

                localStorage.removeItem('token')
                localStorage.removeItem('user')
                sessionStorage.clear()
                window.location.replace('/')
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
        {/* Amount Creation Form */}
        <AmountCreationForm
          onSubmit={handleCreateAmount}
          agentInfo={agentInfo}
        />

        {/* My Amounts Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <AgentAmountsTable amounts={myAmounts} />
        )}
      </div>
    </div>
  )
}