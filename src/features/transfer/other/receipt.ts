import type {
  Transaction,
  TransferReceipt,
  TransferResponse,
} from "@/core/api/types"
import { formatReference, parseUtcTimestamp } from "@/core/lib/format"

const RECEIPT_KEY = "kifiya_transfer_receipt"
const CLOCK_SKEW_MS = 5_000

type ReceiptInput = {
  fromAccountLabel: string
  note: string
  response: TransferResponse
  accountBalance: number
  transactions: Transaction[]
  startedAt: string
}

function cents(amount: number) {
  return Math.round(amount * 100)
}

function digits(value: string) {
  return value.replace(/\D/g, "")
}

function isReceipt(value: unknown): value is TransferReceipt {
  if (!value || typeof value !== "object") {
    return false
  }

  const receipt = value as TransferReceipt
  return (
    typeof receipt.amount === "number" &&
    typeof receipt.fromAccountNumber === "string" &&
    typeof receipt.fromAccountLabel === "string" &&
    typeof receipt.toAccountNumber === "string" &&
    typeof receipt.note === "string" &&
    (receipt.reference === null || typeof receipt.reference === "string") &&
    typeof receipt.timestamp === "string" &&
    typeof receipt.balanceAfter === "number"
  )
}

export function matchTransferTransaction(
  transactions: Transaction[],
  response: TransferResponse,
  startedAt: string
) {
  const earliest = parseUtcTimestamp(startedAt).getTime() - CLOCK_SKEW_MS
  const destination = digits(response.toAccountNumber)
  const matches = transactions.filter((transaction) => {
    if (
      transaction.type !== "FUND_TRANSFER" ||
      transaction.direction !== "DEBIT"
    ) {
      return false
    }
    if (cents(transaction.amount) !== cents(response.amount)) {
      return false
    }
    if (
      transaction.relatedAccount &&
      digits(transaction.relatedAccount) !== destination
    ) {
      return false
    }
    const postedAt = parseUtcTimestamp(transaction.timestamp).getTime()
    return Number.isFinite(postedAt) && postedAt >= earliest
  })

  return matches.length === 1 ? matches[0] : undefined
}

export function buildTransferReceipt({
  fromAccountLabel,
  note,
  response,
  accountBalance,
  transactions,
  startedAt,
}: ReceiptInput): TransferReceipt {
  const match = matchTransferTransaction(transactions, response, startedAt)

  return {
    amount: response.amount,
    fromAccountNumber: response.fromAccountNumber,
    fromAccountLabel,
    toAccountNumber: response.toAccountNumber,
    note,
    reference: match ? formatReference(match.id) : null,
    timestamp: match?.timestamp ?? new Date().toISOString(),
    balanceAfter: match?.balanceAfter ?? accountBalance,
  }
}

export function asTransferReceipt(value: unknown): TransferReceipt | null {
  return isReceipt(value) ? value : null
}

export function rememberTransferReceipt(receipt: TransferReceipt) {
  sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt))
}

export function readTransferReceipt(): TransferReceipt | null {
  const raw = sessionStorage.getItem(RECEIPT_KEY)
  if (!raw) {
    return null
  }

  try {
    return asTransferReceipt(JSON.parse(raw))
  } catch {
    return null
  }
}
