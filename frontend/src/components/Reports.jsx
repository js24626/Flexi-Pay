import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Reports({ adminAmounts = [], agentAmounts = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [chartData, setChartData] = useState(null)
  const [chartType, setChartType] = useState('line') // 'line' or 'bar'
  const [viewPeriod, setViewPeriod] = useState('week') // 'day', 'week', 'month'

  // Generate chart data based on selected date and view period
  useEffect(() => {
    generateChartData()
  }, [adminAmounts, agentAmounts, selectedDate, viewPeriod])

  const generateChartData = () => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    let dateRange = []
    let labels = []

    // Generate date range based on view period
    if (viewPeriod === 'day') {
      // Show hourly data for the selected day
      dateRange = [selectedDateStr]
      labels = Array.from({length: 24}, (_, i) => {
        const hour = i.toString().padStart(2, '0')
        return `${hour}:00`
      })
    } else if (viewPeriod === 'week') {
      // Show 7 days around selected date
      for (let i = -3; i <= 3; i++) {
        const date = new Date(selectedDate)
        date.setDate(date.getDate() + i)
        dateRange.push(date.toISOString().split('T')[0])
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
      }
    } else if (viewPeriod === 'month') {
      // Show 30 days around selected date
      for (let i = -15; i <= 14; i++) {
        const date = new Date(selectedDate)
        date.setDate(date.getDate() + i)
        dateRange.push(date.toISOString().split('T')[0])
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }
    }

    // Filter and aggregate data for the date range
    const adminDataByDate = {}
    const agentDataByDate = {}

    // Initialize all dates with zero values
    dateRange.forEach(date => {
      adminDataByDate[date] = { total: 0, wasool: 0, bakaya: 0, count: 0 }
      agentDataByDate[date] = { total: 0, wasool: 0, bakaya: 0, count: 0 }
    })

    // Aggregate admin amounts
    adminAmounts.forEach(amount => {
      const date = amount.date
      if (adminDataByDate[date]) {
        adminDataByDate[date].total += parseFloat(amount.amount || 0)
        adminDataByDate[date].wasool += parseFloat(amount.wasoolAmount || 0)
        adminDataByDate[date].bakaya += parseFloat(amount.bakayaAmount || 0)
        adminDataByDate[date].count += 1
      }
    })

    // Aggregate agent amounts
    agentAmounts.forEach(amount => {
      const date = amount.date
      if (agentDataByDate[date]) {
        agentDataByDate[date].total += parseFloat(amount.amount || 0)
        agentDataByDate[date].wasool += parseFloat(amount.wasoolAmount || 0)
        agentDataByDate[date].bakaya += parseFloat(amount.bakayaAmount || 0)
        agentDataByDate[date].count += 1
      }
    })

    // Prepare chart datasets
    const adminTotalData = dateRange.map(date => adminDataByDate[date].total)
    const agentTotalData = dateRange.map(date => agentDataByDate[date].total)
    const adminWasoolData = dateRange.map(date => adminDataByDate[date].wasool)
    const agentWasoolData = dateRange.map(date => agentDataByDate[date].wasool)

    setChartData({
      labels,
      datasets: [
        {
          label: 'Admin Total Amount',
          data: adminTotalData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.1)',
          fill: chartType === 'line',
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          borderWidth: 3,
        },
        {
          label: 'Agent Total Amount',
          data: agentTotalData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: chartType === 'bar' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.1)',
          fill: chartType === 'line',
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          borderWidth: 3,
        },
        {
          label: 'Admin Wasool',
          data: adminWasoolData,
          borderColor: 'rgb(139, 69, 19)',
          backgroundColor: chartType === 'bar' ? 'rgba(139, 69, 19, 0.8)' : 'rgba(139, 69, 19, 0.1)',
          fill: chartType === 'line',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          borderDash: [5, 5],
        },
        {
          label: 'Agent Wasool',
          data: agentWasoolData,
          borderColor: 'rgb(220, 38, 127)',
          backgroundColor: chartType === 'bar' ? 'rgba(220, 38, 127, 0.8)' : 'rgba(220, 38, 127, 0.1)',
          fill: chartType === 'line',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          borderDash: [5, 5],
        }
      ]
    })
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: '600'
          },
          boxWidth: 12,
          boxHeight: 12
        }
      },
      title: {
        display: true,
        text: `Financial Performance - ${viewPeriod.charAt(0).toUpperCase() + viewPeriod.slice(1)} View`,
        font: {
          size: 20,
          weight: '700'
        },
        padding: {
          top: 10,
          bottom: 30
        },
        color: '#1f2937'
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: 'rgba(75, 85, 99, 0.4)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13,
          weight: '500'
        },
        callbacks: {
          title: function(context) {
            return `${context[0].label} - ${selectedDate.toLocaleDateString()}`
          },
          label: function(context) {
            return `${context.dataset.label}: Rs ${context.parsed.y.toLocaleString()}`
          },
          afterBody: function(context) {
            const total = context.reduce((sum, item) => sum + item.parsed.y, 0)
            return [``, `Total: Rs ${total.toLocaleString()}`]
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(75, 85, 99, 0.1)',
          lineWidth: 1
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 12,
            weight: '500'
          },
          color: '#6b7280'
        },
        title: {
          display: true,
          text: viewPeriod === 'day' ? 'Hours' : 'Date',
          font: {
            size: 14,
            weight: '600'
          },
          color: '#374151'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(75, 85, 99, 0.1)',
          lineWidth: 1
        },
        ticks: {
          callback: function(value) {
            return 'Rs ' + (value / 1000).toFixed(0) + 'K'
          },
          font: {
            size: 12,
            weight: '500'
          },
          color: '#6b7280'
        },
        title: {
          display: true,
          text: 'Amount (Rs)',
          font: {
            size: 14,
            weight: '600'
          },
          color: '#374151'
        }
      }
    },
    elements: {
      point: {
        hoverBorderWidth: 4,
        hoverBorderColor: '#ffffff'
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  // Calculate statistics for agent amounts only
  const getFilteredAmounts = () => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    let dateRange = []
    
    if (viewPeriod === 'day') {
      dateRange = [selectedDateStr]
    } else if (viewPeriod === 'week') {
      for (let i = -3; i <= 3; i++) {
        const date = new Date(selectedDate)
        date.setDate(date.getDate() + i)
        dateRange.push(date.toISOString().split('T')[0])
      }
    } else if (viewPeriod === 'month') {
      for (let i = -15; i <= 14; i++) {
        const date = new Date(selectedDate)
        date.setDate(date.getDate() + i)
        dateRange.push(date.toISOString().split('T')[0])
      }
    }
    
    const filteredAgent = agentAmounts.filter(amount => dateRange.includes(amount.date))
    
    return { filteredAgent }
  }

  const { filteredAgent } = getFilteredAmounts()
  
  const totalAgentAmount = filteredAgent.reduce((sum, amount) => sum + parseFloat(amount.amount || 0), 0)
  const totalAgentWasool = filteredAgent.reduce((sum, amount) => sum + parseFloat(amount.wasoolAmount || 0), 0)
  const totalAgentBakaya = totalAgentAmount - totalAgentWasool

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Financial Analytics
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Professional insights into admin and agent performance</p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Date Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </button>
                
                {showCalendar && (
                  <div className="absolute top-full mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
                    <Calendar
                      onChange={(date) => {
                        setSelectedDate(date)
                        setShowCalendar(false)
                      }}
                      value={selectedDate}
                      className="react-calendar-custom"
                      tileClassName={({ date, view }) => {
                        if (view === 'month') {
                          const dateStr = date.toISOString().split('T')[0]
                          const hasData = adminAmounts.some(a => a.date === dateStr) || 
                                         agentAmounts.some(a => a.date === dateStr)
                          return hasData ? 'has-data' : null
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* View Period Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {['day', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setViewPeriod(period)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium capitalize ${
                      viewPeriod === period
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* Chart Type Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {['line', 'bar'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium capitalize ${
                      chartType === type
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      {/* Dashboard Summary Cards */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
  {/* Total Amounts */}
  <div className="bg-gradient-to-br from-gray-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-blue-700 mb-1">Total Amounts</p>
        <p className="text-3xl font-bold text-blue-900">
          Rs {totalAgentAmount.toLocaleString()}
        </p>
      </div>
      <div className="bg-blue-600/10 p-3 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" 
             fill="none" viewBox="0 0 24 24" 
             strokeWidth={2} stroke="currentColor" 
             className="w-6 h-6 text-blue-700">
          <path strokeLinecap="round" strokeLinejoin="round" 
                d="M12 8c-1.657 0-3 1.343-3 3m6 0a3 3 0 01-3 3m0 0v6m0-6a3 3 0 003-3m-3 3a3 3 0 01-3-3" />
        </svg>
      </div>
    </div>
  </div>

  {/* Total Wasool */}
  <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-emerald-700 mb-1">Total Wasool</p>
        <p className="text-3xl font-bold text-emerald-900">
          Rs {totalAgentWasool.toLocaleString()}
        </p>
      </div>
      <div className="bg-emerald-600/10 p-3 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 24 24"
             strokeWidth={2} stroke="currentColor"
             className="w-6 h-6 text-emerald-700">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 8v8m0 0l-3-3m3 3l3-3m-9 7a9 9 0 1118 0A9 9 0 013 20z" />
        </svg>
      </div>
    </div>
  </div>

  {/* Total Bakaya */}
  <div className="bg-gradient-to-br from-rose-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-red-700 mb-1">Total Bakaya</p>
        <p className="text-3xl font-bold text-red-900">
          Rs {totalAgentBakaya.toLocaleString()}
        </p>
      </div>
      <div className="bg-red-600/10 p-3 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 24 24"
             strokeWidth={2} stroke="currentColor"
             className="w-6 h-6 text-red-700">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 14v-4m0 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  </div>
</div>


        {/* Professional Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="h-[500px]">
            {chartData ? (
              chartType === 'line' ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading chart data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Calendar Styles */}
      <style jsx>{`
        .react-calendar-custom {
          width: 300px;
          border: none;
          font-family: inherit;
        }
        
        .react-calendar-custom .react-calendar__tile {
          position: relative;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .react-calendar-custom .react-calendar__tile:hover {
          background-color: #eff6ff;
          color: #2563eb;
        }
        
        .react-calendar-custom .react-calendar__tile--active {
          background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
          color: white !important;
        }
        
        .react-calendar-custom .has-data::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background-color: #10b981;
          border-radius: 50%;
        }
        
        .react-calendar-custom .react-calendar__tile--active.has-data::after {
          background-color: #34d399;
        }
      `}</style>
    </div>
  )
}