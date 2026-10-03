import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ResponsiveOverlay } from "@/core/components/responsive-overlay"
import type { Transaction } from "@/core/api/types"
import {
  formatEtb,
  formatReference,
  formatTimestamp,
  transactionTitle,
} from "@/core/lib/format"
import { TransactionGlyph } from "@/core/lib/icons"
import { UploadIcon } from "lucide-react"

type TransactionDetailProps = {
  transaction: Transaction | null
  accountLabel?: string
  onOpenChange: (open: boolean) => void
}

export function TransactionDetail({
  transaction,
  accountLabel,
  onOpenChange,
}: TransactionDetailProps) {
  const credit = transaction?.direction === "CREDIT"

  const share = async () => {
    if (!transaction) {
      return
    }
    const text = [
      transactionTitle(transaction.type, transaction.description),
      `${credit ? "+" : "-"}${formatEtb(transaction.amount)}`,
      `Reference ${formatReference(transaction.id)}`,
      accountLabel ? `Account ${accountLabel}` : undefined,
      transaction.balanceAfter !== undefined
        ? `Balance after ${formatEtb(transaction.balanceAfter)}`
        : undefined,
    ]
      .filter(Boolean)
      .join("\n")

    try {
      if (navigator.share) {
        await navigator.share({ title: "Kifiya receipt", text })
        return
      }
      await navigator.clipboard.writeText(text)
      toast.success("Receipt copied.")
    } catch {
      toast.error("Couldn't share the receipt.")
    }
  }

  return (
    <ResponsiveOverlay
      onOpenChange={onOpenChange}
      open={Boolean(transaction)}
      title="Transaction"
    >
      {transaction ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-credit-soft text-credit">
              <TransactionGlyph className="size-5" type={transaction.type} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body text-ink">
                {transactionTitle(transaction.type, transaction.description)}
              </p>
              <p className="text-caption text-ink-subtle">
                {formatTimestamp(transaction.timestamp)}
              </p>
            </div>
            <p
              className={
                credit ? "text-body text-credit" : "text-body text-ink"
              }
            >
              {credit ? "+" : "-"}
              {formatEtb(transaction.amount)}
            </p>
          </div>
          <Card className="gap-0 bg-surface py-0 ring-border">
            <DetailRow
              label="Type"
              value={transaction.type.replaceAll("_", " ")}
            />
            <Separator />
            <DetailRow
              label="Direction"
              value={credit ? "Money in" : "Money out"}
            />
            <Separator />
            <DetailRow label="Account" value={accountLabel ?? "—"} />
            <Separator />
            <DetailRow
              label="Reference"
              value={formatReference(transaction.id)}
            />
            {transaction.balanceAfter !== undefined ? (
              <>
                <Separator />
                <DetailRow
                  label="Balance after"
                  value={formatEtb(transaction.balanceAfter)}
                />
              </>
            ) : null}
          </Card>
          <Badge className="w-fit" variant="secondary">
            {transaction.type === "REFUND" ? "Refund" : transaction.direction}
          </Badge>
          <Button onClick={share} type="button" variant="outline">
            <UploadIcon />
            Share receipt
          </Button>
        </div>
      ) : null}
    </ResponsiveOverlay>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <p className="text-copy text-ink-muted">{label}</p>
      <p className="text-right text-body text-ink">{value}</p>
    </div>
  )
}
