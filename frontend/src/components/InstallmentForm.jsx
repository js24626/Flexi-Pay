import React, { useState } from 'react'

export default function InstallmentForm({ onSubmit, showUserField = false }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [userId, setUserId] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const payload = {
      title,
      amount: parseFloat(amount),
      due_date: dueDate || null,
      ...(showUserField && userId ? { userId } : {})
    }
    
    await onSubmit(payload)
    
    // Reset form
    setTitle('')
    setAmount('')
    setDueDate('')
    setUserId('')
  }

  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleAmountChange = (e) => setAmount(e.target.value)
  const handleDueDateChange = (e) => setDueDate(e.target.value)
  const handleUserIdChange = (e) => setUserId(e.target.value)

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
          className="p-2 border rounded col-span-2"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Amount"
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={handleDueDateChange}
          className="p-2 border rounded"
        />
      </div>
      
      {showUserField && (
        <input
          value={userId}
          onChange={handleUserIdChange}
          placeholder="User ID (optional)"
          className="w-full p-2 border rounded mt-2"
        />
      )}
      
      <div className="mt-3">
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </form>
  )
}