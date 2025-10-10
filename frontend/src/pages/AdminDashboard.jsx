import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import Reports from '/src/components/Reports'
import Agents from '/src/components/Agents'

// Admin Amount Creation Form Component
const AdminAmountCreationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    wasoolAmount: '',
    bakayaAmount: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!formData.date) {
      const today = new Date().toISOString().slice(0, 10)
      setFormData(f => ({ ...f, date: today }))
    }
  }, [])

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
        amount: parseFloat(formData.amount || 0),
        wasoolAmount: parseFloat(formData.wasoolAmount || 0),
        bakayaAmount: parseFloat(formData.bakayaAmount || 0),
        date: formData.date,
        createdAt: new Date().toISOString()
      }

      await onSubmit(payload)

      const today = new Date().toISOString().slice(0, 10)
      setFormData({ amount: '', date: today, wasoolAmount: '', bakayaAmount: '' })
    } catch (err) {
      console.error('Error creating amount:', err)
      setError(err?.message || 'Failed to create amount')
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create Amount</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

// Admin Created Amounts Table Component
const AdminAmountsTable = ({ adminAmounts, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAmounts = adminAmounts.filter(amount => {
    const matchesDate = !dateFilter || amount.date === dateFilter
    return matchesDate
  })

  const totalPages = Math.ceil(filteredAmounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAmounts = filteredAmounts.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [dateFilter])

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
          </div>
        </div>
        
        {dateFilter && (
          <p className="text-sm text-gray-600">
            Showing {filteredAmounts.length} of {adminAmounts.length} amounts
            <span className="ml-1 text-blue-600">for date: {dateFilter}</span>
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                <td colSpan="6" className="px-4 sm:px-6 py-8 text-center text-gray-500">
                  {dateFilter ? 'No amounts found matching your filters' : 'No amounts to display'}
                </td>
              </tr>
            ) : (
              currentAmounts.map((amount, index) => (
                <tr key={amount.id || index} className="hover:bg-gray-50">
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

// Main Dashboard Component with Tab Navigation
export default function AdminDashboard() {
  const [agents, setAgents] = useState([])
  const [adminAmounts, setAdminAmounts] = useState([])
  const [agentAmounts, setAgentAmounts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingAmount, setEditingAmount] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard') // Dashboard, Reports, Agents
  const navigate = useNavigate()

  // Admin profile
  const adminProfile = {
    name: 'Admin',
    logo: '/images/admin.png'
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      const agentsData = await api('/agents')
      setAgents(agentsData || [])

      const adminAmountsData = await api('/admin-amounts')
      setAdminAmounts(adminAmountsData || [])

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

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.replace('/')
  }

  const handleCreateAgent = async (formData) => {
    try {
      const created = await api('/agents', { 
        method: 'POST', 
        body: formData 
      })
      
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
          username: 'Admin', // Set default username as Admin since we removed the input field
          createdBy: 'Admin',
          createdAt: new Date().toISOString()
        }
      })
      
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

  const handleUpdateAmount = async (formData) => {
    try {
      const updated = await api(`/admin-amounts/${editingAmount.id}`, {
        method: 'PUT',
        body: formData
      })

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

  const handleEditAgentAmount = async (editingAgentAmount, formData) => {
    try {
      const updated = await api(`/agent-amounts/${editingAgentAmount.id}`, {
        method: 'PUT',
        body: formData
      })

      setAgentAmounts(prev => prev.map(amount => 
        amount.id === editingAgentAmount.id ? { ...amount, ...updated } : amount
      ))
      
      alert('Agent amount updated successfully!')
    } catch (error) {
      console.error('Failed to update agent amount:', error)
      alert('Failed to update agent amount. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar with Tabs */}
     <nav className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16 relative">
      {/* Left side - Brand */}
      <div className="flex items-center space-x-2">
        <img
          src="/images/flexi.png"
          alt="App Logo"
          className="w-10 h-10 object-contain"
        />
        <span className="font-bold text-lg text-gray-900">FLEXYPAY</span>
      </div>

      {/* Center - Navigation Tabs */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'reports'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Reports
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'agents'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Agents
        </button>
      </div>

      {/* Right side - Admin Profile and Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <img
              src={adminProfile.logo}
              alt="Admin Logo"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%236366f1'/%3E%3Ctext x='16' y='20' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EA%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{adminProfile.name}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Logout"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3v1"
            />
          </svg>
          <span className="hidden sm:inline text-sm">Logout</span>
        </button>
      </div>
    </div>
  </div>
</nav>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Dashboard Content */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Dashboard Overview</h2>
            </div>

            {/* Admin Amount Creation Form */}
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

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Admin Amounts Table */}
                <AdminAmountsTable
                  adminAmounts={adminAmounts}
                  onDelete={handleDeleteAdminAmount}
                  onEdit={handleEditAmount}
                />
              </>
            )}
          </>
        )}

        {activeTab === 'reports' && (
          /* Reports Content */
          <Reports 
            adminAmounts={adminAmounts} 
            agentAmounts={agentAmounts} 
          />
        )}

        {activeTab === 'agents' && (
          /* Agents Content */
          <Agents
            agents={agents}
            agentAmounts={agentAmounts}
            onCreateAgent={handleCreateAgent}
            onDeleteAgent={handleDeleteAgent}
            onDeleteAgentAmount={handleDeleteAgentAmount}
            onEditAgentAmount={handleEditAgentAmount}
          />
        )}
      </div>
    </div>
  )
}