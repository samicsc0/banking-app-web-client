import { describe, expect, it } from "vitest"
import { AxiosError } from "axios"

import {
  GENERIC_ERROR_MESSAGE,
  getErrorMessage,
  NETWORK_ERROR_MESSAGE,
} from "@/core/api/errors"

describe("getErrorMessage", () => {
  it("maps known API codes to friendly copy", () => {
    const error = new AxiosError("bad request")
    error.response = {
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: { headers: {} as never },
      data: {
        code: "ACC_002",
        message: "raw backend text",
        error: "Bad Request",
        path: "/api/accounts/transfer",
        status: 400,
        timestamp: "2026-01-01T00:00:00",
      },
    }

    expect(getErrorMessage(error)).toBe("Insufficient funds.")
    expect(getErrorMessage(error)).not.toContain("raw backend")
  })

  it("uses a network message when there is no response", () => {
    const error = new AxiosError("network")
    expect(getErrorMessage(error)).toBe(NETWORK_ERROR_MESSAGE)
  })

  it("hides unknown failures", () => {
    expect(getErrorMessage(new Error("stack trace"))).toBe(
      GENERIC_ERROR_MESSAGE
    )
  })
})
