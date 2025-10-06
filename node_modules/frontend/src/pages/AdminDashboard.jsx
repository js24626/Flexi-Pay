import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

// Agent Signup Form Component
const AgentSignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password) {
      alert('Please fill in all fields')
      return
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({ username: '', email: '', password: '' })
    } catch (error) {
      console.error('Error creating agent:', error)
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
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create New Agent Account</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username for agent"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email for agent"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password for agent (min 6 characters)"
              required
              minLength={6}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isSubmitting ? 'Creating...' : 'Create Agent Account'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

// Admin Amount Creation Form Component with Auto-calculation
const AdminAmountCreationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    amount: '',
    date: '',
    wasoolAmount: '',
    bakayaAmount: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Initialize date to today (optional)
  useEffect(() => {
    if (!formData.date) {
      const today = new Date().toISOString().slice(0, 10)
      setFormData(f => ({ ...f, date: today }))
    }
  }, []) // run once

  // Live calculation for bakaya = total - wasool (same as user dashboard)
  useEffect(() => {
    const total = parseFloat(formData.amount || 0)
    const wasool = parseFloat(formData.wasoolAmount || 0)

    if (isNaN(total) || isNaN(wasool)) {
      setFormData(f => ({ ...f, bakayaAmount: '' }))
      return
    }

    const b = (total - wasool)
    // If negative, keep bakaya as 0 but set error handled below
    const bakaya = Number.isFinite(b) ? (Math.round((b + Number.EPSILON) * 100) / 100).toFixed(2) : ''
    setFormData(f => ({ ...f, bakayaAmount: bakaya }))
  }, [formData.amount, formData.wasoolAmount])

  const validate = () => {
    const total = parseFloat(formData.amount || 0)
    const wasool = parseFloat(formData.wasoolAmount || 0)

    if (!formData.username) return 'Username is required.'
    if (!formData.amount && formData.amount !== 0) return 'Total amount is required.'
    if (!formData.wasoolAmount && formData.wasoolAmount !== 0) return 'Wasool amount is required.'
    if (!formData.date) return 'Date is required.'
    if (isNaN(total) || total < 0) return 'Total must be a non-negative number.'
    if (isNaN(wasool) || wasool < 0) return 'Wasool must be a non-negative number.'
    if (wasool > total) return 'Wasool cannot exceed Total.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      // Build payload with auto-calculated bakaya
      const payload = {
        username: formData.username,
        amount: parseFloat(formData.amount || 0),
        wasoolAmount: parseFloat(formData.wasoolAmount || 0),
        // server should also recalculate bakaya; client includes it for convenience
        bakayaAmount: parseFloat(formData.bakayaAmount || 0),
        date: formData.date,
        createdAt: new Date().toISOString()
      }

      await onSubmit(payload)

      // Reset form (keep date as today)
      const today = new Date().toISOString().slice(0, 10)
      setFormData({ username: '', amount: '', date: today, wasoolAmount: '', bakayaAmount: '' })
    } catch (err) {
      console.error('Error creating amount:', err)
      setError(err?.message || 'Failed to create amount')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Prevent negative input on client for amount fields
    if ((name === 'amount' || name === 'wasoolAmount') && value !== '') {
      // allow only numbers and dot
      const numeric = value.replace(/[^0-9.]/g, '')
      setFormData(f => ({ ...f, [name]: numeric }))
    } else {
      setFormData(f => ({ ...f, [name]: value }))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create Amount</h3>
       
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent Name *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter Agent Name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
             Total Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter total amount"
              required
              min="0"
              step="0.01"
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
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bakaya Amount
            </label>
            <input
              type="text"
              name="bakayaAmount"
              value={formData.bakayaAmount}
              readOnly
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none"
              placeholder="Auto-calculated"
              disabled
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

        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isSubmitting ? 'Creating...' : 'Create Amount'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

// Edit Amount Modal Component with Auto-calculation
const EditAmountModal = ({ amount, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    amount: amount?.amount || '',
    wasoolAmount: amount?.wasoolAmount || '',
    bakayaAmount: amount?.bakayaAmount || '',
    date: amount?.date || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (amount) {
      setFormData({
        amount: amount.amount || '',
        wasoolAmount: amount.wasoolAmount || '',
        bakayaAmount: amount.bakayaAmount || '',
        date: amount.date || ''
      })
    }
  }, [amount])

  // Live calculation for bakaya = total - wasool (same as user dashboard)
  useEffect(() => {
    const total = parseFloat(formData.amount || 0)
    const wasool = parseFloat(formData.wasoolAmount || 0)

    if (isNaN(total) || isNaN(wasool)) {
      setFormData(f => ({ ...f, bakayaAmount: '' }))
      return
    }

    const b = (total - wasool)
    const bakaya = Number.isFinite(b) ? (Math.round((b + Number.EPSILON) * 100) / 100).toFixed(2) : ''
    setFormData(f => ({ ...f, bakayaAmount: bakaya }))
  }, [formData.amount, formData.wasoolAmount])

  const validate = () => {
    const total = parseFloat(formData.amount || 0)
    const wasool = parseFloat(formData.wasoolAmount || 0)

    if (!formData.amount && formData.amount !== 0) return 'Total amount is required.'
    if (!formData.wasoolAmount && formData.wasoolAmount !== 0) return 'Wasool amount is required.'
    if (!formData.date) return 'Date is required.'
    if (isNaN(total) || total < 0) return 'Total must be a non-negative number.'
    if (isNaN(wasool) || wasool < 0) return 'Wasool must be a non-negative number.'
    if (wasool > total) return 'Wasool cannot exceed Total.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    
    setError('')
    setIsSubmitting(true)
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        wasoolAmount: parseFloat(formData.wasoolAmount),
        bakayaAmount: parseFloat(formData.bakayaAmount),
        date: formData.date
      }
      await onSave(payload)
    } catch (error) {
      console.error('Error updating amount:', error)
      setError(error?.message || 'Failed to update amount')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Prevent negative input on client for amount fields
    if ((name === 'amount' || name === 'wasoolAmount') && value !== '') {
      // allow only numbers and dot
      const numeric = value.replace(/[^0-9.]/g, '')
      setFormData(f => ({ ...f, [name]: numeric }))
    } else {
      setFormData(f => ({ ...f, [name]: value }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Amount</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter total amount"
              required
              min="0"
              step="0.01"
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter wasool amount"
              required
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bakaya Amount
            </label>
            <input
              type="text"
              name="bakayaAmount"
              value={formData.bakayaAmount}
              readOnly
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none"
              placeholder="Auto-calculated"
              disabled
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isSubmitting ? 'Updating...' : 'Update Amount'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Agents Table Component - Updated to show Password instead of Status
const AgentsTable = ({ agents, onDelete }) => {
  if (agents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-lg font-medium mb-2">No agents created yet</p>
          <p className="text-sm">Create your first agent account using the form above</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Agent Accounts</h3>
          </div>
          <div className="bg-gray-100 border border-green-200 rounded-lg px-4 py-2">
            <div className="text-sm text-black font-medium">Total Agents: {agents.length}</div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agents.map((agent, index) => (
              <tr key={agent.id || index} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium text-sm">
                        {agent.username?.charAt(0).toUpperCase()}
                      </span>
                    </div> */}
                    <div className="text-sm font-medium text-gray-900">{agent.username}</div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{agent.email}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                    {agent.password || '••••••••'}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDelete(agent.id || index)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Delete Agent"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Admin Created Amounts Table Component
const AdminAmountsTable = ({ adminAmounts, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter amounts based on search term and date
  const filteredAmounts = adminAmounts.filter(amount => {
    const matchesSearch = amount.username?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || amount.date === dateFilter
    return matchesSearch && matchesDate
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredAmounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAmounts = filteredAmounts.slice(startIndex, endIndex)

  // Reset to first page when search or date filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, dateFilter])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const clearDateFilter = () => {
    setDateFilter('')
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>
    )

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 sm:px-3 py-2 text-sm font-medium border-t border-b border-r border-gray-300 ${
            currentPage === i
              ? 'bg-blue-50 text-blue-600 border-blue-300'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">Next</span>
      </button>
    )

    return (
      <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAmounts.length)} of {filteredAmounts.length} results
          </div>
          <div className="flex">{pages}</div>
        </div>
      </div>
    )
  }

  if (adminAmounts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center mb-6">
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
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Admin Created Amounts</h3>
             
            </div>
            <div className="bg-gray-100 border border-purple-200 rounded-lg px-4 py-2">
              <div className="text-sm text-black font-medium">Total: {adminAmounts.length}</div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            {/* Date Filter */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-40"
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
            
            {/* Search Filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {(searchTerm || dateFilter) && (
          <p className="text-sm text-gray-600">
            Showing {filteredAmounts.length} of {adminAmounts.length} amounts
            {dateFilter && <span className="ml-1 text-blue-600">for date: {dateFilter}</span>}
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wasool Amount
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bakaya Amount
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentAmounts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 sm:px-6 py-8 text-center text-gray-500">
                  {searchTerm || dateFilter ? 'No amounts found matching your filters' : 'No amounts to display'}
                </td>
              </tr>
            ) : (
              currentAmounts.map((amount, index) => (
                <tr key={amount.id || index} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-purple-600 font-medium text-xs">
                          {amount.username?.charAt(0).toUpperCase()}
                        </span>
                      </div> */}
                      <div className="text-sm text-gray-900">{amount.username}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {parseFloat(amount.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    Rs {parseFloat(amount.wasoolAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    Rs {parseFloat(amount.bakayaAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {amount.date}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {amount.createdAt ? new Date(amount.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(amount)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit Amount"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(amount.id || index)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Amount"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  )
}

// Agent Created Amounts Table Component - Only visible to Admin
const AgentAmountsTable = ({ agentAmounts, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter amounts based on search term and date
  const filteredAmounts = agentAmounts.filter(amount => {
    const matchesSearch = amount.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || amount.date === dateFilter
    return matchesSearch && matchesDate
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredAmounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAmounts = filteredAmounts.slice(startIndex, endIndex)

  // Reset to first page when search or date filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, dateFilter])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const clearDateFilter = () => {
    setDateFilter('')
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>
    )

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 sm:px-3 py-2 text-sm font-medium border-t border-b border-r border-gray-300 ${
            currentPage === i
              ? 'bg-blue-50 text-blue-600 border-blue-300'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">Next</span>
      </button>
    )

    return (
      <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAmounts.length)} of {filteredAmounts.length} results
          </div>
          <div className="flex">{pages}</div>
        </div>
      </div>
    )
  }

  if (agentAmounts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center mb-6">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <p className="text-lg font-medium mb-2">No agent amounts created </p>

        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Agent Created Amounts</h3>
             
            </div>
            <div className="bg-gray-100 border border-orange-200 rounded-lg px-4 py-2">
              <div className="text-sm text-black font-medium">Total: {agentAmounts.length}</div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            {/* Date Filter */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-40"
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
            
            {/* Search Filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by agent name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {(searchTerm || dateFilter) && (
          <p className="text-sm text-gray-600">
            Showing {filteredAmounts.length} of {agentAmounts.length} amounts
            {dateFilter && <span className="ml-1 text-blue-600">for date: {dateFilter}</span>}
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent Name
              </th>
             
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wasool Amount
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bakaya Amount
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentAmounts.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 sm:px-6 py-8 text-center text-gray-500">
                  {searchTerm || dateFilter ? 'No amounts found matching your filters' : 'No amounts to display'}
                </td>
              </tr>
            ) : (
              currentAmounts.map((amount, index) => (
                <tr key={amount.id || index} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-orange-600 font-medium text-xs">
                          {amount.createdBy?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900">{amount.createdBy}</div>
                    </div>
                  </td>
                  {/* <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {amount.username}
                  </td> */}
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {parseFloat(amount.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    Rs {parseFloat(amount.wasoolAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    Rs {parseFloat(amount.bakayaAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {amount.date}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {amount.createdAt ? new Date(amount.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(amount)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit Amount"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(amount.id || index)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Amount"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  )
}

// Main Dashboard Component
export default function AdminDashboard() {
  const [agents, setAgents] = useState([])
  const [adminAmounts, setAdminAmounts] = useState([])
  const [agentAmounts, setAgentAmounts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingAmount, setEditingAmount] = useState(null)
  const [editingAgentAmount, setEditingAgentAmount] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showEditAgentModal, setShowEditAgentModal] = useState(false)
  const [showAgentForm, setShowAgentForm] = useState(false)
  const navigate = useNavigate()

  // Admin profile
  const adminProfile = {
    name: 'Admin',
    logo: '/images/admin.png'
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load agents from server
      const agentsData = await api('/agents')
      setAgents(agentsData || [])

      // Load admin created amounts
      const adminAmountsData = await api('/admin-amounts')
      setAdminAmounts(adminAmountsData || [])

      // Load agent created amounts
      const agentAmountsData = await api('/agent-amounts')
      setAgentAmounts(agentAmountsData || [])
      
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateAgent = async (formData) => {
    try {
      const created = await api('/agents', { 
        method: 'POST', 
        body: formData 
      })
      
      // Add to agents list with password included for display
      setAgents(prev => [{ ...created, password: formData.password }, ...prev])
      
      alert(`Agent account created successfully!\n\nLogin Credentials:\nUsername: ${formData.username}\nPassword: ${formData.password}\n\nThe agent can now use these credentials to login.`)
      
    } catch (error) {
      console.error('Failed to create agent:', error)
      alert(error.message || 'Failed to create agent account. Please try again.')
    }
  }

  const handleCreateAmount = async (formData) => {
    try {
      const created = await api('/admin-amounts', { 
        method: 'POST', 
        body: {
          ...formData,
          createdBy: 'Admin',
          createdAt: new Date().toISOString()
        }
      })
      
      // Add to admin amounts list
      setAdminAmounts(prev => [created, ...prev])
      
      alert('Amount created successfully!')
      
    } catch (error) {
      console.error('Failed to create amount:', error)
      alert(error.message || 'Failed to create amount. Please try again.')
    }
  }

  const handleDeleteAgent = async (id) => {
    if (!confirm('Are you sure you want to delete this agent account?')) {
      return
    }

    try {
      await api(`/agents/${id}`, { method: 'DELETE' })
      setAgents(prev => prev.filter(agent => agent.id !== id))
      alert('Agent account deleted successfully.')
    } catch (error) {
      console.error('Failed to delete agent:', error)
      alert('Failed to delete agent account.')
    }
  }

  const handleDeleteAdminAmount = async (id) => {
    if (!confirm('Are you sure you want to delete this amount?')) {
      return
    }

    try {
      await api(`/admin-amounts/${id}`, { method: 'DELETE' })
      setAdminAmounts(prev => prev.filter(amount => String(amount.id) !== String(id)))
      alert('Amount deleted successfully.')
    } catch (error) {
      console.error('Failed to delete amount:', error)
      alert('Failed to delete amount.')
    }
  }

  const handleDeleteAgentAmount = async (id) => {
    if (!confirm('Are you sure you want to delete this agent amount?')) {
      return
    }

    try {
      await api(`/agent-amounts/${id}`, { method: 'DELETE' })
      setAgentAmounts(prev => prev.filter(amount => String(amount.id) !== String(id)))
      alert('Agent amount deleted successfully.')
    } catch (error) {
      console.error('Failed to delete agent amount:', error)
      alert('Failed to delete agent amount.')
    }
  }

  const handleEditAmount = (amount) => {
    setEditingAmount(amount)
    setShowEditModal(true)
  }

  const handleEditAgentAmount = (amount) => {
    setEditingAgentAmount(amount)
    setShowEditAgentModal(true)
  }

  const handleUpdateAmount = async (formData) => {
    try {
      const updated = await api(`/admin-amounts/${editingAmount.id}`, {
        method: 'PUT',
        body: formData
      })

      // Update the local state
      setAdminAmounts(prev => prev.map(amount => 
        amount.id === editingAmount.id ? { ...amount, ...updated } : amount
      ))
      
      setShowEditModal(false)
      setEditingAmount(null)
      alert('Amount updated successfully!')
    } catch (error) {
      console.error('Failed to update amount:', error)
      alert('Failed to update amount. Please try again.')
    }
  }

  const handleUpdateAgentAmount = async (formData) => {
    try {
      const updated = await api(`/agent-amounts/${editingAgentAmount.id}`, {
        method: 'PUT',
        body: formData
      })

      // Update the local state
      setAgentAmounts(prev => prev.map(amount => 
        amount.id === editingAgentAmount.id ? { ...amount, ...updated } : amount
      ))
      
      setShowEditAgentModal(false)
      setEditingAgentAmount(null)
      alert('Agent amount updated successfully!')
    } catch (error) {
      console.error('Failed to update agent amount:', error)
      alert('Failed to update agent amount. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Admin Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10">
                <img
                  src={adminProfile.logo}
                  alt="Admin Logo"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%236366f1'/%3E%3Ctext x='20' y='25' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3EA%3C/text%3E%3C/svg%3E"
                  }}
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{adminProfile.name}</h1>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!window.confirm('Are you sure you want to logout?')) return

                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.replace('/')
              }}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Overview Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Overview</h2>
          
          {/* Create Agent Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAgentForm(!showAgentForm)}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>{showAgentForm ? 'Hide Agent Form' : 'Create Agent Account'}</span>
            </button>
          </div>
        </div>

        {/* Agent Signup Form - Show/Hide based on state */}
        {showAgentForm && <AgentSignupForm onSubmit={handleCreateAgent} />}

        {/* Admin Amount Creation Form - Always Visible with Auto-calculation */}
        <AdminAmountCreationForm onSubmit={handleCreateAmount} />

        {/* Edit Amount Modal */}
        <EditAmountModal
          amount={editingAmount}
          onSave={handleUpdateAmount}
          onCancel={() => {
            setShowEditModal(false)
            setEditingAmount(null)
          }}
          isOpen={showEditModal}
        />

        {/* Edit Agent Amount Modal */}
        <EditAmountModal
          amount={editingAgentAmount}
          onSave={handleUpdateAgentAmount}
          onCancel={() => {
            setShowEditAgentModal(false)
            setEditingAgentAmount(null)
          }}
          isOpen={showEditAgentModal}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Agents Table - Updated to show passwords */}
            <AgentsTable
              agents={agents}
              onDelete={handleDeleteAgent}
            />

            {/* Admin Created Amounts Table */}
            <AdminAmountsTable
              adminAmounts={adminAmounts}
              onDelete={handleDeleteAdminAmount}
              onEdit={handleEditAmount}
            />

            {/* Agent Created Amounts Table */}
            <AgentAmountsTable
              agentAmounts={agentAmounts}
              onDelete={handleDeleteAgentAmount}
              onEdit={handleEditAgentAmount}
            />
          </>
        )}
      </div>
    </div>
  )
}