import type { AccountType, TransactionType } from "@/core/api/types"

const moneyFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(amount: number) {
  return moneyFormat.format(amount)
}

export function formatEtb(amount: number) {
  return `ETB ${formatMoney(amount)}`
}

export function maskAccount(accountNumber: string) {
  return `···· ${accountNumber.slice(-4)}`
}

export function groupAccount(accountNumber: string) {
  const digits = accountNumber.replace(/\D/g, "")
  if (digits.length !== 10) {
    return accountNumber
  }

  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`
}

export function formatReference(id: number) {
  return `TX-${String(id).padStart(6, "0")}`
}

export function greeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 5) {
    return "Good evening"
  }
  if (hour < 12) {
    return "Good morning"
  }
  if (hour < 17) {
    return "Good afternoon"
  }
  return "Good evening"
}

function parseUtcTimestamp(timestamp: string) {
  const normalized = /(?:Z|[+-]\d{2}:\d{2})$/.test(timestamp)
    ? timestamp
    : `${timestamp}Z`
  return new Date(normalized)
}

export function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(parseUtcTimestamp(timestamp))
}

export function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(parseUtcTimestamp(timestamp))
}

export function dayGroupLabel(timestamp: string, now = new Date()) {
  const date = parseUtcTimestamp(timestamp)
  const startOfDay = (value: Date) =>
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())
  const day = startOfDay(date)
  const today = startOfDay(now)
  const yesterday = today - 24 * 60 * 60 * 1000

  if (day === today) {
    return "Today"
  }
  if (day === yesterday) {
    return "Yesterday"
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date)
}

const accountTypeLabels: Record<AccountType, string> = {
  CHECKING: "Checking",
  SAVINGS: "Savings",
  MONEY_MARKET: "Money market",
  INDIVIDUAL_RETIREMENT_ACCOUNT: "Retirement",
  FIXED_TIME_DEPOSIT: "Fixed deposit",
  SPECIAL_BLOCKED_ACCOUNT: "Blocked",
}

export function accountTypeLabel(type: AccountType) {
  return accountTypeLabels[type]
}

const transactionTypeLabels: Record<TransactionType, string> = {
  FUND_TRANSFER: "Transfer",
  TELLER_TRANSFER: "Teller transfer",
  ATM_WITHDRAWAL: "ATM Withdrawal",
  TELLER_DEPOSIT: "Deposit",
  BILL_PAYMENT: "Bill payment",
  ACCESS_FEE: "Monthly access fee",
  PURCHASE: "Purchase",
  REFUND: "Refund",
  INTEREST_EARNED: "Interest",
  LOAN_PAYMENT: "Loan payment",
}

export function transactionTitle(type: TransactionType, description?: string) {
  if (description && description.trim().length > 0) {
    return description
  }
  return transactionTypeLabels[type]
}

export function transactionCaption(type: TransactionType, timestamp: string) {
  const label = transactionTypeLabels[type]
  return `${label} · ${formatTime(timestamp)}`
}

export function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
