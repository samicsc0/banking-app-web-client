export const accountTypes = [
  "CHECKING",
  "SAVINGS",
  "MONEY_MARKET",
  "INDIVIDUAL_RETIREMENT_ACCOUNT",
  "FIXED_TIME_DEPOSIT",
  "SPECIAL_BLOCKED_ACCOUNT",
] as const

export type AccountType = (typeof accountTypes)[number]

export const creatableAccountTypes = [
  "CHECKING",
  "SAVINGS",
  "MONEY_MARKET",
] as const

export type CreatableAccountType = (typeof creatableAccountTypes)[number]

export type Account = {
  id: number
  accountNumber: string
  balance: number
  userId: number
  accountType: AccountType
}

export const transactionDirections = ["DEBIT", "CREDIT"] as const

export type TransactionDirection = (typeof transactionDirections)[number]

export const transactionTypes = [
  "FUND_TRANSFER",
  "TELLER_TRANSFER",
  "ATM_WITHDRAWAL",
  "TELLER_DEPOSIT",
  "BILL_PAYMENT",
  "ACCESS_FEE",
  "PURCHASE",
  "REFUND",
  "INTEREST_EARNED",
  "LOAN_PAYMENT",
] as const

export type TransactionType = (typeof transactionTypes)[number]

export type Transaction = {
  id: number
  amount: number
  type: TransactionType
  direction: TransactionDirection
  timestamp: string
  description?: string
  relatedAccount?: string
  accountId: number
  balanceAfter?: number
}

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export type UserProfile = {
  id: number
  username: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber: string
}

export type LoginResponse = {
  message: string
  username: string
  userId: number
  accessToken: string
  refreshToken: string
}

export type RegisterResponse = {
  message: string
  username: string
  userId: number
  initialAccountNumber: string
}

export type TransferResponse = {
  message: string
  amount: number
  fromAccountNumber: string
  toAccountNumber: string
}

export type BillPaymentResponse = {
  message: string
  amount: number
  accountNumber: string
  biller: string
}

export type ErrorResponse = {
  timestamp: string
  status: number
  error: string
  code: string
  message: string
  path: string
}

export type TransferReceipt = {
  amount: number
  fromAccountNumber: string
  fromAccountLabel: string
  toAccountNumber: string
  note: string
  reference: string
  timestamp: string
  balanceAfter: number
}
