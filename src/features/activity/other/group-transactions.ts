import type { Transaction, TransactionDirection } from "@/core/api/types"
import { dayGroupLabel } from "@/core/lib/format"

export type DirectionFilter = "ALL" | TransactionDirection

export function filterTransactions(
  transactions: Transaction[],
  direction: DirectionFilter
) {
  if (direction === "ALL") {
    return transactions
  }
  return transactions.filter(
    (transaction) => transaction.direction === direction
  )
}

export function groupByDay(transactions: Transaction[]) {
  const groups: Array<{ label: string; items: Transaction[] }> = []
  for (const transaction of transactions) {
    const label = dayGroupLabel(transaction.timestamp)
    const current = groups.at(-1)
    if (!current || current.label !== label) {
      groups.push({ label, items: [transaction] })
      continue
    }
    current.items.push(transaction)
  }
  return groups
}
