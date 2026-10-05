import { describe, expect, it } from "vitest"

import { newPasswordSchema, registerSchema } from "@/features/auth/other/schema"

const validProfile = {
  firstName: "Jane",
  lastName: "Doe",
  username: "demo.jane",
  phoneNumber: "0911000000",
  email: "",
  confirmPassword: "Password123!",
}

describe("newPasswordSchema", () => {
  it("accepts a password with letters and a number", () => {
    expect(newPasswordSchema.safeParse("Password123!").success).toBe(true)
  })

  it("rejects a short password and one with no number", () => {
    expect(newPasswordSchema.safeParse("short1").success).toBe(false)
    expect(newPasswordSchema.safeParse("longpassword").success).toBe(false)
  })
})

describe("registerSchema", () => {
  it("requires the two passwords to match", () => {
    const result = registerSchema.safeParse({
      ...validProfile,
      password: "Password123!",
      confirmPassword: "Password123?",
    })
    expect(result.success).toBe(false)
  })
})
