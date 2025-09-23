import React, { useEffect, useState } from 'react'
import InstallmentTable from '../components/InstallmentTable'
import InstallmentForm from '../components/InstallmentForm'
import { api } from '../lib/api'

export default function AdminDashboard() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'approved'

  const loadInstallments = async () => {
    try {
      setIsLoading(true)
      const data = await api('/installments')
      setItems(data || [])
    } catch (error) {
      alert(error.message || 'Failed to load installments')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInstallments()
  }, [])

  const handleCreateInstallment = async (payload) => {
    try {
      const created = await api('/installments', { 
        method: 'POST', 
        body: payload 
      })
      setItems(prev => [created, ...prev])
    } catch (error) {
      alert(error.message || 'Failed to create installment')
    }
  }

  const handleApproveInstallment = async (id) => {
    if (!confirm('Are you sure you want to approve this installment?')) {
      return
    }

    try {
      const updated = await api(`/installments/${id}`, { 
        method: 'PUT', 
        body: { status: 'approved' } 
      })
      
      setItems(prev => 
        prev.map(item => 
          String(item.id) === String(id) ? updated : item
        )
      )
      
      alert('Installment approved successfully.')
    } catch (error) {
      alert(error.message || 'Failed to approve installment')
    }
  }

  const handleDeleteInstallment = async (id) => {
    if (!confirm('Are you sure you want to delete this installment? This action cannot be undone.')) {
      return
    }

    try {
      await api(`/installments/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(item => String(item.id) !== String(id)))
      alert('Installment deleted successfully.')
    } catch (error) {
      alert(error.message || 'Failed to delete installment')
    }
  }

  const getFilteredItems = () => {
    switch (filter) {
      case 'pending':
        return items.filter(item => 
          !item.status || item.status.toLowerCase() === 'pending'
        )
      case 'approved':
        return items.filter(item => 
          item.status && item.status.toLowerCase() === 'approved'
        )
      default:
        return items
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  const filteredItems = getFilteredItems()
  const pendingCount = items.filter(item => 
    !item.status || item.status.toLowerCase() === 'pending'
  ).length

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all installments and approvals
          </p>
        </div>
        <button
          onClick={loadInstallments}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Create Form */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Create New Installment
        </h2>
        <InstallmentForm 
          onSubmit={handleCreateInstallment} 
          showUserField 
        />
      </div>

      {/* Filter Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Installments Overview
          </h2>
          {pendingCount > 0 && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => handleFilterChange('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => handleFilterChange('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved ({items.filter(item => 
              item.status && item.status.toLowerCase() === 'approved'
            ).length})
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Loading installments...</div>
        </div>
      ) : (
        <InstallmentTable
          data={filteredItems}
          onDelete={handleDeleteInstallment}
          onApprove={handleApproveInstallment}
        />
      )}
    </div>
  )
}