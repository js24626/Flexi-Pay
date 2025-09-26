// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

// Agent Signup Form Component
const AgentSignupForm = ({ onSubmit, onCancel }) => {
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
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create New Agent Account</h3>
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
        
        <div className="flex justify-end space-x-3 pt-4">
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
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

// Installment Assignment Form Component
const InstallmentForm = ({ onSubmit, editingInstallment, onCancel, agents }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    agentName: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingInstallment) {
      setFormData({
        title: editingInstallment.title || '',
        amount: editingInstallment.amount || '',
        date: editingInstallment.date || '',
        agentName: editingInstallment.agentName || ''
      })
    }
  }, [editingInstallment])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.amount || !formData.date || !formData.agentName) {
      alert('Please fill in all fields')
      return
    }
    
    // Check if agent exists
    const agentExists = agents.some(agent => 
      agent.username.toLowerCase() === formData.agentName.toLowerCase()
    )
    
    if (!agentExists) {
      alert('Agent not found. Please select a valid agent name from the list.')
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({ title: '', amount: '', date: '', agentName: '' })
    } catch (error) {
      console.error('Error with installment:', error)
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingInstallment ? 'Edit Installment' : 'Assign Installment to Agent'}
        </h3>
        {editingInstallment && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Available Agents List */}
      {agents.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm font-medium text-blue-900 mb-2">Available Agents:</p>
          <div className="flex flex-wrap gap-2">
            {agents.map((agent, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                onClick={() => setFormData(prev => ({ ...prev, agentName: agent.username }))}
              >
                {agent.username}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter installment title"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent Name *
            </label>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter agent username"
              required
              list="agents-list"
              disabled={isSubmitting}
            />
            <datalist id="agents-list">
              {agents.map((agent, index) => (
                <option key={index} value={agent.username} />
              ))}
            </datalist>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          {editingInstallment && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isSubmitting ? 'Processing...' : (editingInstallment ? 'Update Installment' : 'Assign Installment')}</span>
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
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
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
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Agent Accounts</h3>
        <p className="text-sm text-gray-500 mt-1">Agents can use these credentials to login</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agents.map((agent, index) => (
              <tr key={agent.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium text-sm">
                        {agent.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{agent.username}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{agent.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

// Installments Table Component
const InstallmentsTable = ({ installments, onEdit, onDelete }) => {
  if (installments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg font-medium mb-2">No installments assigned yet</p>
          <p className="text-sm">Assign installments to agents using the form above</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Assigned Installments</h3>
        <p className="text-sm text-gray-500 mt-1">Installments visible to agents in their dashboard</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
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
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-green-600 font-medium text-xs">
                        {installment.agentName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900">{installment.agentName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Rs {parseFloat(installment.amount || 0).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{installment.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(installment)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit Installment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(installment.id || index)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete Installment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function AdminDashboard() {
  const [agents, setAgents] = useState([])
  const [installments, setInstallments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAgentForm, setShowAgentForm] = useState(false)
  const [showInstallmentForm, setShowInstallmentForm] = useState(false)
  const [editingInstallment, setEditingInstallment] = useState(null)
  const navigate = useNavigate()

  // Admin profile
  const adminProfile = {
    name: 'John Admin',
    logo: '/images/admin.png'
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load installments
      const installmentsData = await api('/installments')
      setInstallments(installmentsData || [])
      
      // Load agents from server
      const agentsData = await api('/agents')
      setAgents(agentsData || [])
      
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
      
      // Add to agents list
      setAgents(prev => [created, ...prev])
      setShowAgentForm(false)
      
      alert(`Agent account created successfully!\n\nLogin Credentials:\nUsername: ${formData.username}\nPassword: ${formData.password}\n\nThe agent can now use these credentials to login.`)
      
    } catch (error) {
      console.error('Failed to create agent:', error)
      alert(error.message || 'Failed to create agent account. Please try again.')
    }
  }

  const handleCreateInstallment = async (formData) => {
    try {
      const created = await api('/installments', { 
        method: 'POST', 
        body: formData 
      })
      setInstallments(prev => [created, ...prev])
      setShowInstallmentForm(false)
      alert('Installment assigned successfully!')
    } catch (error) {
      console.error('Failed to assign installment:', error)
      alert('Failed to assign installment. Please try again.')
    }
  }

  const handleEditInstallment = async (formData) => {
    try {
      const updated = await api(`/installments/${editingInstallment.id}`, { 
        method: 'PUT', 
        body: formData 
      })
      setInstallments(prev => 
        prev.map(installment => 
          String(installment.id) === String(editingInstallment.id) ? updated : installment
        )
      )
      setEditingInstallment(null)
      alert('Installment updated successfully!')
    } catch (error) {
      console.error('Failed to update installment:', error)
      alert('Failed to update installment. Please try again.')
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

  const handleDeleteInstallment = async (id) => {
    if (!confirm('Are you sure you want to delete this installment?')) {
      return
    }

    try {
      await api(`/installments/${id}`, { method: 'DELETE' })
      setInstallments(prev => prev.filter(installment => String(installment.id) !== String(id)))
      alert('Installment deleted successfully.')
    } catch (error) {
      console.error('Failed to delete installment:', error)
      alert('Failed to delete installment.')
    }
  }

 

  const totalInstallments = installments.length

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

    if (typeof onLogout === 'function') {
      // preferred: call the App-level logout which does setUser(null) + navigate('/login')
      onLogout()
    } else {
      // fallback: clear storage and force a reload to ensure App reads no user
      localStorage.removeItem('token')
      localStorage.removeItem('user')
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
        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Total Installments Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Total Installments</h3>
                  <p className="text-3xl font-bold text-blue-600">{totalInstallments}</p>
                  <p className="text-sm text-gray-500 mt-1">Assigned to agents</p>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Agents Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Total Agents</h3>
                  <p className="text-3xl font-bold text-green-600">{agents.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Active agent accounts</p>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setShowAgentForm(!showAgentForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>{showAgentForm ? 'Hide Agent Form' : 'Create Agent'}</span>
            </button>

            <button
              onClick={() => setShowInstallmentForm(!showInstallmentForm)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
              disabled={agents.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{showInstallmentForm ? 'Hide Installment Form' : 'Assign Installment'}</span>
            </button>
          </div>

          {agents.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> Create at least one agent account before assigning installments. Agents will use their credentials to login and view their assigned installments.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Agent Signup Form */}
        {showAgentForm && (
          <AgentSignupForm
            onSubmit={handleCreateAgent}
            onCancel={() => setShowAgentForm(false)}
          />
        )}

        {/* Installment Assignment Form */}
        {(showInstallmentForm || editingInstallment) && (
          <InstallmentForm
            onSubmit={editingInstallment ? handleEditInstallment : handleCreateInstallment}
            editingInstallment={editingInstallment}
            onCancel={() => {
              setEditingInstallment(null)
              setShowInstallmentForm(false)
            }}
            agents={agents}
          />
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Agents Table */}
            <AgentsTable
              agents={agents}
              onDelete={handleDeleteAgent}
            />

            {/* Installments Table */}
            <InstallmentsTable
              installments={installments}
              onEdit={setEditingInstallment}
              onDelete={handleDeleteInstallment}
            />
          </>
        )}
      </div>
    </div>
  )
}