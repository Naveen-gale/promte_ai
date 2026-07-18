import axios from 'axios'

/**
 * Base URL resolution:
 *   - Development  → Vite proxy  →  /api  →  http://localhost:5000
 *   - Production   → set VITE_API_URL in Vercel env vars to your Render URL
 *                    e.g. https://your-backend.onrender.com
 */
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}`
  : '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 600000, // 10 minutes — CPU inference can be slow
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Send a message (or full history) to the AI model.
 * @param {string|Array} input  — single string or array of {role, content}
 * @param {Object}       settings — { temperature, maxTokens, topP }
 */
export async function sendChatMessage(input, settings = {}) {
  const payload = {
    ...(Array.isArray(input) ? { messages: input } : { message: input }),
    temperature: settings.temperature ?? 0.7,
    max_tokens:  settings.maxTokens  ?? 1024,
    top_p:       settings.topP       ?? 0.9,
  }
  const { data } = await api.post('/chat', payload)
  return data
}

/**
 * Health-check — confirm model is loaded on the backend.
 */
export async function checkHealth() {
  const { data } = await api.get('/health')
  return data
}
