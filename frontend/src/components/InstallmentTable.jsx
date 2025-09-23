import React from 'react'

export default function InstallmentTable({ data = [], onDelete, onApprove }) {
  const isPending = (status) => {
    if (!status) return true
    try { 
      return String(status).toLowerCase() === 'pending' 
    } catch { 
      return false 
    }
  }

  const isApproved = (status) => {
    try {
      return String(status).toLowerCase() === 'approved'
    } catch {
      return false
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getStatusClassName = (status) => {
    const baseClasses = 'px-2 py-1 rounded text-sm font-medium'
    
    if (isApproved(status)) {
      return `${baseClasses} bg-green-100 text-green-800`
    }
    if (isPending(status)) {
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
    return `${baseClasses} bg-gray-100 text-gray-800`
  }

  const handleApprove = (id) => {
    if (onApprove) {
      onApprove(id)
    }
  }

  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id)
    }
  }

  if (data.length === 0) {
    return (
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                No installments found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => {
            const status = row.status ?? 'pending'
            const approved = isApproved(status)

            return (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.title}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  ${row.amount}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(row.due_date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={getStatusClassName(status)}>
                    {status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {row.userId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                  {onApprove && !approved && (
                    <button
                      onClick={() => handleApprove(row.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}