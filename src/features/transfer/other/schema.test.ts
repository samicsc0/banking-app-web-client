import { describe, expect, it } from "vitest"

import { transferSchema } from "@/features/transfer/other/schema"

const valid = {
  fromAccountNumber: "1000000001",
  toAccountNumber: "2899 0108 46",
  amount: "25.50",
  note: "",
}

describe("transferSchema", () => {
  it("accepts a 10-digit destination and a positive amount", () => {
    expect(transferSchema.safeParse(valid).success).toBe(true)
  })

  it("rejects a transfer to the same account", () => {
    const result = transferSchema.safeParse({
      ...valid,
      toAccountNumber: "1000000001",
    })
    expect(result.success).toBe(false)
  })

  it("rejects a zero amount", () => {
    expect(transferSchema.safeParse({ ...valid, amount: "0" }).success).toBe(
      false
    )
  })
})
