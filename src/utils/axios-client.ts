import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/token"
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
const baseURL = import.meta.env.VITE_API_URL

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axiosClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearTokens()
        window.location.href = "/login"
        return Promise.reject(error)
      }
      try {
        const response = await axios.post(`${baseURL}/api/auth/refresh-token`, {
          refreshToken,
        })
        const newAccessToken = response.data.accessToken
        const newRefreshToken = response.data.refreshToken
        setTokens(newAccessToken, newRefreshToken)
        axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        processQueue(null, newAccessToken)
        return axiosClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearTokens()
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)
