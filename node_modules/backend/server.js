import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

dotenv.config()
console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
console.log("SUPABASE_KEY exists:", !!process.env.SUPABASE_KEY)
console.log("JWT_SECRET:", process.env.JWT_SECRET)

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// Helper function to generate UUID
function generateUUID() {
  return crypto.randomUUID()
}

// Helper function to convert snake_case to camelCase for frontend
function convertToCamelCase(obj) {
  if (!obj) return obj;
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    converted[camelKey] = value;
  }
  return converted;
}

// Helper function to convert array of objects
function convertArrayToCamelCase(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(convertToCamelCase);
}

// Create initial admin if env vars provided (optional)
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('email', process.env.ADMIN_EMAIL)
    .single()
  
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    const admin = {
      id: generateUUID(),
      email: process.env.ADMIN_EMAIL,
      password: hashed,
      role: 'admin',
      full_name: 'Admin',
      created_at: new Date().toISOString()
    }
    
    const { error } = await supabase.from('users').insert([admin])
    if (!error) {
      console.log('Admin created:', process.env.ADMIN_EMAIL)
    } else {
      console.error('Error creating admin:', error)
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'please_change_this'

// helpers
function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  next()
}

app.get("/",(req,res)=>{
  res.send("Server is working ");
})

// ADMIN LOGIN
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) return res.status(400).json({ error: 'Invalid credentials' })
  
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  
  const token = createToken(user)
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name } })
})

// AGENT LOGIN
app.post('/auth/agent-login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' })
  
  const { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .ilike('username', username)
    .single()

  if (error || !agent) return res.status(400).json({ error: 'Invalid credentials' })
  
  const ok = await bcrypt.compare(password, agent.password)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  
  const token = createToken({ id: agent.id, role: 'agent', email: agent.email })
  res.json({ 
    token, 
    user: { 
      id: agent.id, 
      username: agent.username,
      email: agent.email, 
      role: 'agent' 
    } 
  })
})

// AGENTS CRUD - Admin only
// GET all agents
app.get('/agents', authMiddleware, adminMiddleware, async (req, res) => {
  const { data: agents, error } = await supabase
    .from('agents')
    .select('id, username, email, created_at')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching agents:', error)
    return res.status(500).json({ error: 'Failed to fetch agents' })
  }
  
  // Return agents with masked password for security
  const agentsWithMaskedPassword = agents.map(a => ({ 
    ...a,
    password: '••••••••' // Placeholder for security
  }))
  
  res.json(agentsWithMaskedPassword)
})

// CREATE agent
app.post('/agents', authMiddleware, adminMiddleware, async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password required' })
  }
  
  // Check if username already exists
  const { data: existingUsername } = await supabase
    .from('agents')
    .select('id')
    .ilike('username', username)
    .single()
  
  if (existingUsername) {
    return res.status(400).json({ error: 'Username already exists' })
  }
  
  // Check if email already exists
  const { data: existingEmail } = await supabase
    .from('agents')
    .select('id')
    .ilike('email', email)
    .single()
  
  if (existingEmail) {
    return res.status(400).json({ error: 'Email already exists' })
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)
  const agent = {
    id: generateUUID(),
    username,
    email,
    password: hashedPassword,
    created_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('agents')
    .insert([agent])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating agent:', error)
    return res.status(500).json({ error: 'Failed to create agent' })
  }
  
  // Return agent with plain text password for admin display (frontend will handle this)
  res.json({ 
    id: agent.id, 
    username: agent.username, 
    email: agent.email, 
    password: password, // Return plain password for admin display
    created_at: agent.created_at 
  })
})

// DELETE agent
app.delete('/agents/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', req.params.id)
  
  if (error) {
    console.error('Error deleting agent:', error)
    return res.status(500).json({ error: 'Failed to delete agent' })
  }
  
  res.json({ success: true })
})

// ADMIN AMOUNTS CRUD - Admin creates amounts to remember user debts/payments
// GET all admin amounts (admin only) - FIXED
app.get('/admin-amounts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_amounts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading admin amounts:', error)
      return res.status(500).json({ error: 'Failed to load admin amounts' })
    }
    
    // Convert snake_case to camelCase for frontend
    const convertedData = convertArrayToCamelCase(data || [])
    res.json(convertedData)
  } catch (error) {
    console.error('Error loading admin amounts:', error)
    res.status(500).json({ error: 'Failed to load admin amounts' })
  }
})

// CREATE admin amount (admin only) - FIXED
app.post('/admin-amounts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, amount, date, wasoolAmount } = req.body
    
    if (!username || !amount || !date || wasoolAmount === undefined || wasoolAmount === null) {
      return res.status(400).json({ error: 'Username, amount, date, and wasool amount are required' })
    }

    const totalAmount = parseFloat(amount)
    const wasoolAmountFloat = parseFloat(wasoolAmount)

    // Validate amounts
    if (isNaN(totalAmount) || totalAmount < 0) {
      return res.status(400).json({ error: 'Total amount must be a non-negative number' })
    }
    
    if (isNaN(wasoolAmountFloat) || wasoolAmountFloat < 0) {
      return res.status(400).json({ error: 'Wasool amount must be a non-negative number' })
    }

    if (wasoolAmountFloat > totalAmount) {
      return res.status(400).json({ error: 'Wasool amount cannot exceed total amount' })
    }

    // Server-side calculation of bakaya (authoritative)
    const bakayaAmount = Math.round((totalAmount - wasoolAmountFloat + Number.EPSILON) * 100) / 100

    const adminAmount = {
      id: generateUUID(),
      username,
      amount: totalAmount,
      wasool_amount: wasoolAmountFloat,  // Note: snake_case for database
      bakaya_amount: bakayaAmount,       // Note: snake_case for database
      date,
      created_by: 'Admin',
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('admin_amounts')
      .insert([adminAmount])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating admin amount:', error)
      return res.status(500).json({ error: 'Failed to create admin amount' })
    }
    
    // Convert to camelCase for frontend response
    const convertedData = convertToCamelCase(data)
    res.json(convertedData)
  } catch (error) {
    console.error('Error creating admin amount:', error)
    res.status(500).json({ error: 'Failed to create admin amount' })
  }
})

// UPDATE admin amount (admin only) - FIXED
app.put('/admin-amounts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { amount, wasoolAmount, date } = req.body
    
    if (!amount || !date || wasoolAmount === undefined || wasoolAmount === null) {
      return res.status(400).json({ error: 'Amount, date, and wasool amount are required' })
    }

    const totalAmount = parseFloat(amount)
    const wasoolAmountFloat = parseFloat(wasoolAmount)

    // Validate amounts
    if (isNaN(totalAmount) || totalAmount < 0) {
      return res.status(400).json({ error: 'Total amount must be a non-negative number' })
    }
    
    if (isNaN(wasoolAmountFloat) || wasoolAmountFloat < 0) {
      return res.status(400).json({ error: 'Wasool amount must be a non-negative number' })
    }

    if (wasoolAmountFloat > totalAmount) {
      return res.status(400).json({ error: 'Wasool amount cannot exceed total amount' })
    }

    // Server-side calculation of bakaya (authoritative)
    const bakayaAmount = Math.round((totalAmount - wasoolAmountFloat + Number.EPSILON) * 100) / 100

    const { data, error } = await supabase
      .from('admin_amounts')
      .update({
        amount: totalAmount,
        wasool_amount: wasoolAmountFloat,  // Note: snake_case for database
        bakaya_amount: bakayaAmount,       // Note: snake_case for database
        date,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating admin amount:', error)
      return res.status(500).json({ error: 'Failed to update admin amount' })
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Admin amount not found' })
    }
    
    // Convert to camelCase for frontend response
    const convertedData = convertToCamelCase(data)
    res.json(convertedData)
  } catch (error) {
    console.error('Error updating admin amount:', error)
    res.status(500).json({ error: 'Failed to update admin amount' })
  }
})

// DELETE admin amount (admin only)
app.delete('/admin-amounts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('admin_amounts')
      .delete()
      .eq('id', req.params.id)
    
    if (error) {
      console.error('Error deleting admin amount:', error)
      return res.status(500).json({ error: 'Failed to delete admin amount' })
    }
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin amount:', error)
    res.status(500).json({ error: 'Failed to delete admin amount' })
  }
})

// AGENT AMOUNTS CRUD - Agents create their own amounts, admin can view all
// GET all agent amounts (admin only) - FIXED
app.get('/agent-amounts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('agent_amounts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading agent amounts:', error)
      return res.status(500).json({ error: 'Failed to load agent amounts' })
    }
    
    // Convert snake_case to camelCase for frontend
    const convertedData = convertArrayToCamelCase(data || [])
    res.json(convertedData)
  } catch (error) {
    console.error('Error loading agent amounts:', error)
    res.status(500).json({ error: 'Failed to load agent amounts' })
  }
})

// GET agent's own amounts (agent only) - FIXED
app.get('/agent-amounts/my-amounts', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({ error: 'Only agents can access their own amounts' })
    }

    // Find agent by ID
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('username')
      .eq('id', req.user.id)
      .single()
    
    if (agentError || !agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }

    // Filter amounts by agent username
    const { data: myAmounts, error } = await supabase
      .from('agent_amounts')
      .select('*')
      .eq('created_by', agent.username)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading agent amounts:', error)
      return res.status(500).json({ error: 'Failed to load agent amounts' })
    }
    
    // Convert snake_case to camelCase for frontend
    const convertedData = convertArrayToCamelCase(myAmounts || [])
    res.json(convertedData)
  } catch (error) {
    console.error('Error loading agent amounts:', error)
    res.status(500).json({ error: 'Failed to load agent amounts' })
  }
})

// CREATE agent amount (agents can create their own only) - FIXED
app.post('/agent-amounts', authMiddleware, async (req, res) => {
  try {
    const { username, amount, date, wasoolAmount } = req.body
    
    if (!username || !amount || !date || wasoolAmount === undefined || wasoolAmount === null) {
      return res.status(400).json({ error: 'Username, amount, date, and wasool amount are required' })
    }

    const totalAmount = parseFloat(amount)
    const wasoolAmountFloat = parseFloat(wasoolAmount)

    // Validate amounts
    if (isNaN(totalAmount) || totalAmount < 0) {
      return res.status(400).json({ error: 'Total amount must be a non-negative number' })
    }
    
    if (isNaN(wasoolAmountFloat) || wasoolAmountFloat < 0) {
      return res.status(400).json({ error: 'Wasool amount must be a non-negative number' })
    }

    if (wasoolAmountFloat > totalAmount) {
      return res.status(400).json({ error: 'Wasool amount cannot exceed total amount' })
    }

    // Server-side calculation of bakaya (authoritative)
    const bakayaAmount = Math.round((totalAmount - wasoolAmountFloat + Number.EPSILON) * 100) / 100

    let createdByUsername

    // Handle different user roles
    if (req.user.role === 'agent') {
      // Agents can only create their own entries
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .select('username')
        .eq('id', req.user.id)
        .single()
      
      if (agentError || !agent) {
        return res.status(403).json({ error: 'Agent not found' })
      }
      createdByUsername = agent.username
    } else {
      return res.status(403).json({ error: 'Only agents can create agent amounts' })
    }

    const agentAmount = {
      id: generateUUID(),
      username,
      amount: totalAmount,
      wasool_amount: wasoolAmountFloat,  // Note: snake_case for database
      bakaya_amount: bakayaAmount,       // Note: snake_case for database
      date,
      created_by: createdByUsername,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('agent_amounts')
      .insert([agentAmount])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating agent amount:', error)
      return res.status(500).json({ error: 'Failed to create agent amount' })
    }

    // Convert to camelCase for frontend response
    const convertedData = convertToCamelCase(data)
    res.json(convertedData)
  } catch (error) {
    console.error('Error creating agent amount:', error)
    res.status(500).json({ error: 'Failed to create agent amount' })
  }
})

// UPDATE agent amount (admin only) - FIXED
app.put('/agent-amounts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { amount, wasoolAmount, date } = req.body
    
    if (!amount || !date || wasoolAmount === undefined || wasoolAmount === null) {
      return res.status(400).json({ error: 'Amount, date, and wasool amount are required' })
    }

    const totalAmount = parseFloat(amount)
    const wasoolAmountFloat = parseFloat(wasoolAmount)

    // Validate amounts
    if (isNaN(totalAmount) || totalAmount < 0) {
      return res.status(400).json({ error: 'Total amount must be a non-negative number' })
    }
    
    if (isNaN(wasoolAmountFloat) || wasoolAmountFloat < 0) {
      return res.status(400).json({ error: 'Wasool amount must be a non-negative number' })
    }

    if (wasoolAmountFloat > totalAmount) {
      return res.status(400).json({ error: 'Wasool amount cannot exceed total amount' })
    }

    // Server-side calculation of bakaya (authoritative)
    const bakayaAmount = Math.round((totalAmount - wasoolAmountFloat + Number.EPSILON) * 100) / 100

    const { data, error } = await supabase
      .from('agent_amounts')
      .update({
        amount: totalAmount,
        wasool_amount: wasoolAmountFloat,  // Note: snake_case for database
        bakaya_amount: bakayaAmount,       // Note: snake_case for database
        date,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating agent amount:', error)
      return res.status(500).json({ error: 'Failed to update agent amount' })
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Agent amount not found' })
    }
    
    // Convert to camelCase for frontend response
    const convertedData = convertToCamelCase(data)
    res.json(convertedData)
  } catch (error) {
    console.error('Error updating agent amount:', error)
    res.status(500).json({ error: 'Failed to update agent amount' })
  }
})

// DELETE agent amount (admin only)
app.delete('/agent-amounts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('agent_amounts')
      .delete()
      .eq('id', req.params.id)
    
    if (error) {
      console.error('Error deleting agent amount:', error)
      return res.status(500).json({ error: 'Failed to delete agent amount' })
    }
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting agent amount:', error)
    res.status(500).json({ error: 'Failed to delete agent amount' })
  }
})

// ADMIN: list users (no passwords)
app.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, role, full_name, created_at')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching users:', error)
    return res.status(500).json({ error: 'Failed to fetch users' })
  }
  
  res.json(users || [])
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`FlexyPay backend running on http://localhost:${port}`))
export default app;