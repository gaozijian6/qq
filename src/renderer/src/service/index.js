import axios from 'axios'

const Service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

Service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default Service
