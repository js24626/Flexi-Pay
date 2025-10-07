import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

// User/Agent Amount Creation Form Component
const UserAmountCreationForm = ({ onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
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

  // Live calculation for bakaya = total - wasool
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
      // Build payload — use currentUser as creator (username not in form anymore)
      const payload = {
        username: currentUser?.username || 'unknown',
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
    // Prevent negative input on client
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
        <h3 className="text-lg font-semibold text-gray-900">Create Amount Entry</h3>
        <p className="text-sm text-gray-600 mt-1">Add a new amount record (you are recorded as the creator)</p>
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
              Bakaya Amount (auto)
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
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

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
            <span>{isSubmitting ? 'Creating...' : 'Create Amount'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

// My Amounts Table Component with Search Filter, Date Filter and Pagination
const MyAmountsTable = ({ myAmounts }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter amounts based on search term and date
  const filteredAmounts = myAmounts.filter(amount => {
    const matchesSearch = (amount.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || amount.date === dateFilter
    return matchesSearch && matchesDate
  })

  // Pagination
  const totalPages = Math.ceil(filteredAmounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAmounts = filteredAmounts.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, dateFilter])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const clearDateFilter = () => setDateFilter('')

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
      <button key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
        className="px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
        <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Prev</span>
      </button>
    )

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)}
          className={`px-2 sm:px-3 py-2 text-sm font-medium border-t border-b border-r border-gray-300 ${currentPage === i ? 'bg-blue-50 text-blue-600 border-blue-300' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
          {i}
        </button>
      )
    }

    pages.push(
      <button key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
        <span className="hidden sm:inline">Next</span><span className="sm:hidden">Next</span>
      </button>
    )

    return (
      <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-500">Showing {startIndex + 1} to {Math.min(endIndex, filteredAmounts.length)} of {filteredAmounts.length} results</div>
          <div className="flex">{pages}</div>
        </div>
      </div>
    )
  }

  if (myAmounts.length === 0) {
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
          <div>
            <h3 className="text-lg font-semibold text-gray-900">My Created Amounts</h3>
            <p className="text-sm text-gray-600">Amounts you have created</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <div className="relative">
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-40" />
              {dateFilter && (
                <button onClick={clearDateFilter} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="relative">
              <input type="text" placeholder="Search by username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64" />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {(searchTerm || dateFilter) && (
          <p className="text-sm text-gray-600">Showing {filteredAmounts.length} of {myAmounts.length} amounts {dateFilter && <span className="ml-1 text-blue-600">for date: {dateFilter}</span>}</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
             
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wasool Amount</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bakaya Amount</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentAmounts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 sm:px-6 py-8 text-center text-gray-500">
                  {searchTerm || dateFilter ? 'No amounts found matching your filters' : 'No amounts to display'}
                </td>
              </tr>
            ) : (
              currentAmounts.map((amount, index) => (
                <tr key={amount.id || index} className="hover:bg-gray-50">
                 
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {parseFloat(amount.amount || 0).toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">Rs {parseFloat(amount.wasoolAmount || 0).toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">Rs {parseFloat(amount.bakayaAmount || 0).toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{amount.date}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{amount.createdAt ? new Date(amount.createdAt).toLocaleDateString() : '-'}</td>
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

// Main User Dashboard Component
export default function UserDashboard() {
  const [myAmounts, setMyAmounts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const loadData = async () => {
    try {
      setIsLoading(true)
      // Load my amounts from server
      const myAmountsData = await api('/agent-amounts/my-amounts')
      setMyAmounts(myAmountsData || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateAmount = async (formData) => {
    try {
      // server endpoint should re-calculate bakaya = amount - wasool as authoritative
      const created = await api('/agent-amounts', {
        method: 'POST',
        body: {
          ...formData,
          createdBy: currentUser.username,
          createdAt: new Date().toISOString()
        }
      })

      // Add to my amounts list
      setMyAmounts(prev => [created, ...prev])

      alert('Amount created successfully!')
    } catch (error) {
      console.error('Failed to create amount:', error)
      alert(error.message || 'Failed to create amount. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - User Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-600">
  <img 
    src="/images/user.png" 
    alt="User Logo" 
    className="w-full h-full object-cover"
  />
</div>

              <div>
                <h1 className="text-lg font-semibold text-gray-900">{currentUser.username}</h1>
                <p className="text-sm text-gray-500">Agent</p>
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
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Dashboard</h2>
          <p className="text-sm text-gray-600">Create amounts and track records below.</p>
        </div>

        {/* User Amount Creation Form (username removed) */}
        <UserAmountCreationForm onSubmit={handleCreateAmount} currentUser={currentUser} />

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* My Amounts Table */}
            <MyAmountsTable myAmounts={myAmounts} />
          </>
        )}
      </div>
    </div>
  )
}
