import React, { useEffect, useState } from 'react'
import InstallmentTable from '../components/InstallmentTable'
import InstallmentForm from '../components/InstallmentForm'
import { api } from '../lib/api'

export default function UserDashboard({ user }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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

  const handleRefresh = () => {
    loadInstallments()
  }

  const getInstallmentStats = () => {
    const pending = items.filter(item => 
      !item.status || item.status.toLowerCase() === 'pending'
    ).length
    
    const approved = items.filter(item => 
      item.status && item.status.toLowerCase() === 'approved'
    ).length

    const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0)

    return { pending, approved, total: items.length, totalAmount }
  }

  const stats = getInstallmentStats()

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.full_name || user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your installment payments
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Installments</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending Approval</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">${stats.totalAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Amount</div>
        </div>
      </div>

      {/* Create Form */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Create New Installment
        </h2>
        <InstallmentForm onSubmit={handleCreateInstallment} />
      </div>

      {/* Installments Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Installments
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-500">Loading your installments...</div>
          </div>
        ) : (
          <InstallmentTable data={items} />
        )}
      </div>
    </div>
  )
}