import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InstallmentTable from '../components/InstallmentTable'
import InstallmentForm from '../components/InstallmentForm'
import { api } from '../lib/api'
import { BarChart3, Users, UserPlus } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
 
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import {  Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

// Sidebar Component
const Sidebar = ({ activeModule, setActiveModule, adminProfile, onLogout }) => {
 const menuItems = [
  { id: "overview", label: "Overview", icon: <BarChart3 size={20} /> },
  { id: "users", label: "Users Management", icon: <Users size={20} /> },
  { id: "create", label: "Create User", icon: <UserPlus size={20} /> },
];


  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
            <div className="w-12 h-12">
            <img
              src="/images/admin.png"   // replace with your logo path
              alt="App Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{adminProfile.name}</h3>
            <p className="text-slate-400 text-xs">{adminProfile.role}</p>
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

// Overview Component with Banking Style Cards and Charts
const OverviewModule = ({ items, pendingCount }) => {
  const approvedCount = items.filter(item => item.status?.toLowerCase() === 'approved').length
  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const approvedAmount = items
    .filter(item => item.status?.toLowerCase() === 'approved')
    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const pendingAmount = totalAmount - approvedAmount

  const stats = [
    { 
      label: 'Total Installments', 
      value: items.length, 
      amount: totalAmount,
      bgClass: 'bg-gradient-to-r from-blue-500 to-blue-400',
      textColor: 'text-white',
      count: items.length,
      subLabel: 'TOTAL AMOUNT'
    },
    { 
      label: 'Pending Approvals', 
      value: pendingCount, 
      amount: pendingAmount,
      bgClass: 'bg-gradient-to-r from-gray-200 to-gray-200',
      textColor: 'text-gray-800',
      count: pendingCount,
      subLabel: 'PENDING AMOUNT'
    },
    { 
      label: 'Approved', 
      value: approvedCount, 
      amount: approvedAmount,
      bgClass: 'bg-gradient-to-r from-gray-200 to-gray-200',
      textColor: 'text-gray-800',
      count: approvedCount,
      subLabel: 'APPROVED AMOUNT'
    }
  ]

 

 

  // Line chart for trend
  const trendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Total Amount (Rs)',
        data: [15000, 23000, 18000, 32000, 28000, totalAmount || 35000],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Approved Amount (Rs)',
        data: [12000, 18000, 15000, 25000, 22000, approvedAmount || 28000],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }





  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: Rs ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          callback: function(value) {
            return 'Rs ' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Banking Style Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgClass} rounded-xl shadow-lg border p-6 relative overflow-hidden transform hover:scale-105 transition-all duration-200`}>
            
            
            {/* Card Content */}
            <div className={`${stat.textColor}`}>
              <h3 className="text-sm font-medium opacity-90 mb-1">{stat.label}</h3>
             <div className="text-left">
  <span className="text-2xl font-bold text-gray-600">
    {stat.count}
  </span>
</div>

              <div className="flex items-end justify-between mt-4">
                <div>
                  
                  <p className="text-lg font-semibold">
                    <span className="text-xs opacity-75 block">{stat.subLabel}</span>
                    Rs {stat.amount.toLocaleString()}
                  </p>
                </div>
               
              </div>
            </div>
          </div>
        ))}
      </div>

    

      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Amount Trend Analysis</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Total Amount</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Approved Amount</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <Line data={trendData} options={lineOptions} />
        </div>
      </div>

    
    </div>
  )
}

// Users Management Component
const UsersManagementModule = ({ 
  items, 
  onDelete, 
  onApprove, 
  isLoading, 
  filter, 
  setFilter 
}) => {
  const pendingCount = items.filter(item => 
    !item.status || item.status.toLowerCase() === 'pending'
  ).length

  const approvedCount = items.filter(item => 
    item.status && item.status.toLowerCase() === 'approved'
  ).length

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

  const filteredItems = getFilteredItems()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor user installments</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium animate-pulse">
              {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
            </span>
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">{approvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>All</span>
             
            </span>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>Pending</span>
             
            </span>
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'approved'
                ? 'bg-green-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>Approved</span>
             
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 mt-4">Loading installments...</div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <div className="text-gray-500 text-lg font-medium mb-2">No installments found</div>
          <div className="text-gray-400 text-sm">Try adjusting your filters or create a new installment</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <InstallmentTable
            data={filteredItems}
            onDelete={onDelete}
            onApprove={onApprove}
          />
        </div>
      )}
    </div>
  )
}

// Create User Component
const CreateUserModule = ({ onCreateInstallment }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create User</h2>
        <p className="text-sm text-gray-600 mt-1">Add a new user and their installment details</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">User Information</h3>
          <p className="text-sm text-gray-600 mt-1">Please fill in all required fields</p>
        </div>
        
        <div className="p-6">
          <InstallmentForm 
            onSubmit={onCreateInstallment} 
            showUserField 
          />
        </div>
      </div>
      
      {/* Help Section */}
      <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Need Help?</h4>
            <p className="text-sm text-blue-700 mt-1">
              Make sure to fill in all required fields. The user will be created with "pending" status by default.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function AdminDashboard() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [activeModule, setActiveModule] = useState('overview')
  const navigate = useNavigate()

  // Admin profile
  const adminProfile = {
    name: 'John Admin',
    role: 'Administrator'
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
      alert('User created successfully!')
      setActiveModule('users') // Switch to users management after creation
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

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token')
      sessionStorage.clear()
      navigate('/login')
    }
  }

  const pendingCount = items.filter(item => 
    !item.status || item.status.toLowerCase() === 'pending'
  ).length

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewModule items={items} pendingCount={pendingCount} />
      case 'users':
        return (
          <UsersManagementModule
            items={items}
            onDelete={handleDeleteInstallment}
            onApprove={handleApproveInstallment}
            isLoading={isLoading}
            filter={filter}
            setFilter={setFilter}
          />
        )
      case 'create':
        return <CreateUserModule onCreateInstallment={handleCreateInstallment} />
      default:
        return <OverviewModule items={items} pendingCount={pendingCount} />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        adminProfile={adminProfile}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your application and monitor performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadInstallments}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
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