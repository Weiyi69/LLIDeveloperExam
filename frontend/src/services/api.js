import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('lli-auth-token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lli-auth-token')
      localStorage.removeItem('lli-user')
      window.location.assign(`${import.meta.env.BASE_URL}login`)
    }

    return Promise.reject(error)
  },
)

export default api
