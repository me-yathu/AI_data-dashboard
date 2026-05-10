import axios from 'axios'

// In development: http://localhost:8000
// In production: your Render backend URL set as VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s timeout for AI calls
})

export const uploadCSV = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await client.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const askQuestion = async (question) => {
  try {
    const res = await client.post('/ask', { question })
    return res.data
  } catch (err) {
    console.error("ASK ERROR:", err)
    return { answer: "Backend not responding. Check server." }
  }
}