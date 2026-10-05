import { describe, expect, it } from "vitest"

import type { Transaction, TransferResponse } from "@/core/api/types"
import {
  buildTransferReceipt,
  matchTransferTransaction,
} from "@/features/transfer/other/receipt"

const response: TransferResponse = {
  message: "ok",
  amount: 250,
  fromAccountNumber: "1000000001",
  toAccountNumber: "1000000002",
}

function debit(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 41,
    amount: 250,
    type: "FUND_TRANSFER",
    direction: "DEBIT",
    timestamp: "2026-10-05T12:00:02",
    relatedAccount: "1000000002",
    accountId: 1,
    balanceAfter: 750,
    ...overrides,
  }
}

describe("matchTransferTransaction", () => {
  const startedAt = "2026-10-05T12:00:00.000Z"

  it("uses the one debit posted for this transfer", () => {
    const match = matchTransferTransaction([debit()], response, startedAt)
    expect(match?.id).toBe(41)
  })

  it("ignores an older debit of the same amount", () => {
    const match = matchTransferTransaction(
      [debit({ id: 7, timestamp: "2026-10-01T12:00:00" })],
      response,
      startedAt
    )
    expect(match).toBeUndefined()
  })

  it("refuses to pick when two debits could be this transfer", () => {
    const match = matchTransferTransaction(
      [
        debit({ id: 41 }),
        debit({ id: 42, timestamp: "2026-10-05T12:00:03", balanceAfter: 500 }),
      ],
      response,
      startedAt
    )
    expect(match).toBeUndefined()
  })

  it("rejects a debit to a different account", () => {
    const match = matchTransferTransaction(
      [debit({ relatedAccount: "1000000099" })],
      response,
      startedAt
    )
    expect(match).toBeUndefined()
  })
})

describe("buildTransferReceipt", () => {
  it("keeps the API amounts and leaves the reference empty when history is ambiguous", () => {
    const receipt = buildTransferReceipt({
      fromAccountLabel: "Checking · ···· 0001",
      note: "Rent",
      response,
      accountBalance: 800,
      transactions: [
        debit({ id: 41 }),
        debit({ id: 42, timestamp: "2026-10-05T12:00:04" }),
      ],
      startedAt: "2026-10-05T12:00:00.000Z",
    })

    expect(receipt.amount).toBe(250)
    expect(receipt.fromAccountNumber).toBe("1000000001")
    expect(receipt.toAccountNumber).toBe("1000000002")
    expect(receipt.reference).toBeNull()
    expect(receipt.balanceAfter).toBe(800)
  })
})
