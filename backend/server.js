// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { nanoid } from 'nanoid'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// lowdb setup (file: db.json) — provide default data to avoid missing default data error
const adapter = new JSONFile('./db.json')
const defaultData = { users: [], installments: [] }

// pass defaultData as second arg so lowdb won't throw on newer versions
const db = new Low(adapter, defaultData)

// read and ensure data exists
await db.read()
if (!db.data) {
  db.data = defaultData
  await db.write()
}

// create initial admin if env vars provided (optional)
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  const existing = db.data.users.find(u => u.email === process.env.ADMIN_EMAIL)
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    const admin = {
      id: nanoid(),
      email: process.env.ADMIN_EMAIL,
      password: hashed,
      role: 'admin',
      full_name: 'Admin',
      created_at: new Date().toISOString()
    }
    db.data.users.push(admin)
    await db.write()
    console.log('Admin created:', process.env.ADMIN_EMAIL)
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

// AUTH ROUTES
app.post('/auth/signup', async (req, res) => {
  const { email, password, full_name } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  await db.read()
  if (db.data.users.find(u => u.email === email)) return res.status(400).json({ error: 'User already exists' })
  const hashed = await bcrypt.hash(password, 10)
  const user = {
    id: nanoid(),
    email,
    password: hashed,
    role: 'user',
    full_name: full_name || '',
    created_at: new Date().toISOString()
  }
  db.data.users.push(user)
  await db.write()
  const token = createToken(user)
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name } })
})

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  await db.read()
  const user = db.data.users.find(u => u.email === email)
  if (!user) return res.status(400).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  const token = createToken(user)
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name } })
})

// ADMIN: list users (no passwords)
app.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  await db.read()
  const users = db.data.users.map(u => ({ id: u.id, email: u.email, role: u.role, full_name: u.full_name, created_at: u.created_at }))
  res.json(users)
})

// Installments CRUD
// GET /installments -> admin: all, user: own only
app.get('/installments', authMiddleware, async (req, res) => {
  await db.read()
  if (req.user.role === 'admin') return res.json(db.data.installments)
  const mine = db.data.installments.filter(i => i.userId === req.user.id)
  res.json(mine)
})

// GET /installments/:id -> admin or owner
app.get('/installments/:id', authMiddleware, async (req, res) => {
  await db.read()
  const inst = db.data.installments.find(i => String(i.id) === String(req.params.id))
  if (!inst) return res.status(404).json({ error: 'Not found' })
  if (req.user.role !== 'admin' && inst.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
  res.json(inst)
})

// CREATE installment -> user or admin (admins can set userId for someone else)
app.post('/installments', authMiddleware, async (req, res) => {
  const { title, amount, due_date, status, userId } = req.body
  await db.read()
  const owner = req.user.role === 'admin' && userId ? userId : req.user.id
  const inst = {
    id: Date.now(), // simple id
    title: title || 'Untitled',
    amount: amount || 0,
    due_date: due_date || null,
    status: status || 'pending',
    userId: owner,
    created_at: new Date().toISOString()
  }
  db.data.installments.push(inst)
  await db.write()
  res.json(inst)
})

// UPDATE installment (admin only)
app.put('/installments/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await db.read()
  const idx = db.data.installments.findIndex(i => String(i.id) === String(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  db.data.installments[idx] = { ...db.data.installments[idx], ...req.body, updated_at: new Date().toISOString() }
  await db.write()
  res.json(db.data.installments[idx])
})

// DELETE installment (admin only)
app.delete('/installments/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await db.read()
  const idx = db.data.installments.findIndex(i => String(i.id) === String(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  db.data.installments.splice(idx, 1)
  await db.write()
  res.json({ success: true })
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`FlexyPay backend running on http://localhost:${port}`))
