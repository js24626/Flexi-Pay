import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import InstallmentTable from '../components/InstallmentTable'
import InstallmentForm from '../components/InstallmentForm'
import { api } from '../lib/api'
import { BarChart3, PlusCircle } from "lucide-react";

// Sidebar Component for User
const UserSidebar = ({ activeModule, setActiveModule, userProfile, onLogout }) => {
 const menuItems = [
  { id: "overview", label: "Overview", icon: <BarChart3 size={20} /> },
  { id: "create", label: "Create Installment", icon: <PlusCircle size={20} /> },
];
  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12">
            <img
              src="/images/user.png"   
              alt="App Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{userProfile.name}</h3>
            <p className="text-slate-400 text-xs">{userProfile.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeModule === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

       {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

// Overview Module for User with Banking Style Cards
const UserOverviewModule = ({ items, stats, isLoading }) => {
  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const approvedAmount = items
    .filter(item => item.status?.toLowerCase() === 'approved')
    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const pendingAmount = totalAmount - approvedAmount

  const statCards = [
    { 
      label: 'Total Installments', 
      value: stats.total, 
      amount: totalAmount,
      bgClass: 'bg-gradient-to-r from-blue-500 to-blue-400',
      textColor: 'text-white',
      count: stats.total
    },
    { 
      label: 'Pending Approval', 
      value: stats.pending, 
      amount: pendingAmount,
      bgClass: 'bg-gradient-to-r from-gray-200 to-gray-200',
      textColor: 'text-gray-800',
      count: stats.pending
    },
    { 
      label: 'Approved', 
      value: stats.approved, 
      amount: approvedAmount,
      bgClass: 'bg-gradient-to-r from-gray-200 to-gray-200',
      textColor: 'text-gray-800',
      count: stats.approved
    }
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
      
      {/* Banking Style Stats Cards - Exact Same as Admin Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgClass} rounded-lg shadow-sm border p-6 relative overflow-hidden`}>
           
            
            {/* Card Content */}
            <div className={`${stat.textColor}`}>
              <h3 className="text-sm font-medium opacity-90 mb-2">{stat.label}</h3>
              <div className="text-left">
  <span className="text-2xl font-bold text-gray-600">
    {stat.count}
  </span>
</div>
              
              <div className="flex items-end justify-between mt-4">
                <div>
                
                  <p className="text-lg font-semibold">
                    <span className="text-xs opacity-75">TOTAL RECORDS</span><br />
                    Rs {stat.amount.toLocaleString()}
                  </p>
                </div>
               
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Installments - Professional Table Style */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Installments</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading your installments...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📝</div>
            <p className="text-gray-500">No installments yet</p>
            <p className="text-sm text-gray-400">Create your first installment to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status?.toLowerCase() === 'approved' 
                      ? 'bg-green-500' 
                      : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Installment #{item.id}</p>
                    <p className="text-sm text-gray-600">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">Rs {item.amount || 0}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status?.toLowerCase() === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Create Installment Module
const CreateInstallmentModule = ({ onCreateInstallment }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Installment</h2>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-4">
          <p className="text-gray-600">
            Fill out the form below to create a new installment request. 
            All requests will be reviewed and approved by an administrator.
          </p>
        </div>
        <InstallmentForm onSubmit={onCreateInstallment} />
      </div>
    </div>
  )
}

// Main User Dashboard Component
export default function UserDashboard({ user }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeModule, setActiveModule] = useState('overview')
  const navigate = useNavigate()

  // User profile
  const userProfile = {
    name: user?.full_name || user?.name || 'User',
    role: 'Customer'
  }

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
      alert('Installment created successfully! It will be reviewed by an administrator.')
      setActiveModule('overview') // Redirect to overview after creation
    } catch (error) {
      alert(error.message || 'Failed to create installment')
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Clear tokens/session
      localStorage.removeItem('token')
      sessionStorage.clear()

      // Optionally clear user state if stored globally
      // setUser(null)

      // Redirect to login page
      navigate('/login')
    }
  }

  const getInstallmentStats = () => {
    const pending = items.filter(item => 
      !item.status || item.status.toLowerCase() === 'pending'
    ).length
    
    const approved = items.filter(item => 
      item.status && item.status.toLowerCase() === 'approved'
    ).length

    const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)

    return { pending, approved, total: items.length, totalAmount }
  }

  const stats = getInstallmentStats()

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
        return (
          <UserOverviewModule 
            items={items} 
            stats={stats} 
            isLoading={isLoading}
          />
        )
      case 'create':
        return <CreateInstallmentModule onCreateInstallment={handleCreateInstallment} />
      default:
        return (
          <UserOverviewModule 
            items={items} 
            stats={stats} 
            isLoading={isLoading}
          />
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <UserSidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome back, {userProfile.name}!
              </h1>
              <p className="text-sm text-gray-600">Manage your installment payments</p>
            </div>
            <button
              onClick={loadInstallments}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderActiveModule()}
        </div>
      </div>
    </div>
  )
}