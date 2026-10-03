import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/core/api/token"

const baseURL = import.meta.env.VITE_API_URL

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

type QueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueItem[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error || !token) {
      item.reject(error)
      return
    }

    item.resolve(token)
  })
  failedQueue = []
}

export function resetRefreshState() {
  isRefreshing = false
  failedQueue = []
}

function isAuthRequest(config: InternalAxiosRequestConfig | undefined) {
  const url = config?.url ?? ""
  return url.includes("/api/auth/")
}

function redirectToLogin() {
  clearTokens()
  if (window.location.pathname !== "/login") {
    window.location.assign("/login?expired=1")
  }
}

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

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined
    const shouldRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest(originalRequest)

    if (!shouldRefresh || !originalRequest) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return axiosClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      isRefreshing = false
      redirectToLogin()
      return Promise.reject(error)
    }

    try {
      const response = await axios.post(`${baseURL}/api/auth/refresh-token`, {
        refreshToken,
      })
      const newAccessToken = response.data.accessToken as string
      const newRefreshToken = response.data.refreshToken as string
      setTokens(newAccessToken, newRefreshToken)
      axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      processQueue(null, newAccessToken)
      return axiosClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      redirectToLogin()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
