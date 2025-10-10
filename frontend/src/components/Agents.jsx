import React, { useState, useEffect } from 'react'
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

// Agents Table Component
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

// Agent Created Amounts Table Component
const AgentAmountsTable = ({ agentAmounts, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAmounts = agentAmounts.filter(amount => {
    const matchesSearch = amount.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || amount.date === dateFilter
    return matchesSearch && matchesDate
  })

  const totalPages = Math.ceil(filteredAmounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAmounts = filteredAmounts.slice(startIndex, endIndex)

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
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
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
      
      {renderPagination()}
    </div>
  )
}

// Edit Amount Modal Component
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
    if ((name === 'amount' || name === 'wasoolAmount') && value !== '') {
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

// Main Agents Component
export default function Agents({ 
  agents, 
  agentAmounts, 
  onCreateAgent, 
  onDeleteAgent, 
  onDeleteAgentAmount, 
  onEditAgentAmount 
}) {
  const [showAgentForm, setShowAgentForm] = useState(false)
  const [editingAgentAmount, setEditingAgentAmount] = useState(null)
  const [showEditAgentModal, setShowEditAgentModal] = useState(false)

  const handleEditAgentAmount = (amount) => {
    setEditingAgentAmount(amount)
    setShowEditAgentModal(true)
  }

  const handleUpdateAgentAmount = async (formData) => {
    await onEditAgentAmount(editingAgentAmount, formData)
    setShowEditAgentModal(false)
    setEditingAgentAmount(null)
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Agents Management</h2>
        
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

      {/* Agent Signup Form */}
      {showAgentForm && <AgentSignupForm onSubmit={onCreateAgent} />}

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

      {/* Agents Table */}
      <AgentsTable
        agents={agents}
        onDelete={onDeleteAgent}
      />

      {/* Agent Amounts Table */}
      <AgentAmountsTable
        agentAmounts={agentAmounts}
        onDelete={onDeleteAgentAmount}
        onEdit={handleEditAgentAmount}
      />
    </div>
  )
}