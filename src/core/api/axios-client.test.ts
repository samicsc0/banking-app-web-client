import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { afterEach, describe, expect, it, vi } from "vitest"

import { axiosClient, resetRefreshState } from "@/core/api/axios-client"
import { clearTokens, getAccessToken, setTokens } from "@/core/api/token"

describe("token refresh", () => {
  afterEach(() => {
    resetRefreshState()
    clearTokens()
    vi.restoreAllMocks()
    axiosClient.defaults.adapter = undefined
  })

  it("sends one refresh for concurrent 401 responses", async () => {
    setTokens("old-access", "old-refresh")
    let refreshCalls = 0

    vi.spyOn(axios, "post").mockImplementation(async () => {
      refreshCalls += 1
      await new Promise((resolve) => setTimeout(resolve, 30))
      return {
        data: { accessToken: "new-access", refreshToken: "new-refresh" },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      }
    })

    axiosClient.defaults.adapter = async (config) => {
      const authorization = axios.AxiosHeaders.from(config.headers).get(
        "Authorization"
      )
      if (authorization !== "Bearer new-access") {
        const error = new AxiosError("Unauthorized")
        error.config = config as InternalAxiosRequestConfig
        error.response = {
          status: 401,
          statusText: "Unauthorized",
          headers: {},
          config: config as InternalAxiosRequestConfig,
          data: { code: "AUTH_005" },
        }
        throw error
      }

      return {
        data: { ok: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      }
    }

    const results = await Promise.all([
      axiosClient.get("/api/accounts"),
      axiosClient.get("/api/users/me"),
      axiosClient.get("/api/transactions/1"),
    ])

    expect(refreshCalls).toBe(1)
    expect(results.map((result) => result.data.ok)).toEqual([true, true, true])
    expect(getAccessToken()).toBe("new-access")
  })
})
