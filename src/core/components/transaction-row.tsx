import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Transaction } from "@/core/api/types"
import {
  formatEtb,
  transactionCaption,
  transactionTitle,
} from "@/core/lib/format"
import { TransactionGlyph } from "@/core/lib/icons"
import { cn } from "cn"

type TransactionRowProps = {
  transaction: Transaction
  onSelect: (transaction: Transaction) => void
}

export function TransactionRow({ transaction, onSelect }: TransactionRowProps) {
  const credit = transaction.direction === "CREDIT"
  const title = transactionTitle(transaction.type, transaction.description)

  return (
    <Button
      className="h-auto w-full justify-start rounded-none bg-transparent px-4 py-3 text-left font-normal hover:bg-surface-muted"
      onClick={() => onSelect(transaction)}
      type="button"
      variant="ghost"
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          credit
            ? "bg-credit-soft text-credit"
            : "bg-surface-muted text-ink-muted"
        )}
      >
        <TransactionGlyph className="size-4" type={transaction.type} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body text-ink">{title}</span>
        <span className="block truncate text-caption text-ink-subtle">
          {transactionCaption(transaction.type, transaction.timestamp)}
        </span>
      </span>
      <span className={cn("text-body", credit ? "text-credit" : "text-ink")}>
        {credit ? "+" : "-"}
        {formatEtb(transaction.amount)}
      </span>
    </Button>
  )
}

export function TransactionGroup({
  label,
  transactions,
  onSelect,
}: {
  label: string
  transactions: Transaction[]
  onSelect: (transaction: Transaction) => void
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-label text-ink-muted">{label}</h2>
      <Card className="gap-0 overflow-hidden bg-surface py-0 ring-border">
        {transactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            onSelect={onSelect}
            transaction={transaction}
          />
        ))}
      </Card>
    </section>
  )
}
