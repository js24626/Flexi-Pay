
// const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const API_BASE = "https://flexipay-supabase.onrender.com"

export function getToken() {
  return localStorage.getItem('token')
}

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken()
  const h = { 'Content-Type': 'application/json', ...headers }
  if (token) h['Authorization'] = `Bearer ${token}`

  const res = await fetch(API_BASE + path, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined
  })

  // try parse JSON safely
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}

  if (!res.ok) {
    // If unauthorized, clear token to force login
    if (res.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // do not redirect here; caller handles
    }
    const err = data?.error || data?.message || (data && JSON.stringify(data)) || res.statusText
    throw new Error(err || 'Request failed')
  }

  return data
}
