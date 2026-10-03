import { CircleAlertIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ResponsiveOverlay } from "@/core/components/responsive-overlay"
import { formatEtb, groupAccount } from "@/core/lib/format"

type TransferReviewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  fromLabel: string
  toAccountNumber: string
  note: string
  loading: boolean
  onConfirm: () => void
}

export function TransferReview({
  open,
  onOpenChange,
  amount,
  fromLabel,
  toAccountNumber,
  note,
  loading,
  onConfirm,
}: TransferReviewProps) {
  return (
    <ResponsiveOverlay
      onOpenChange={onOpenChange}
      open={open}
      title="Review transfer"
    >
      <div className="flex flex-col gap-4">
        <p className="text-center font-heading text-display text-ink">
          {formatEtb(amount)}
        </p>
        <Card className="gap-0 bg-surface py-0 ring-border">
          <ReviewRow label="From" value={fromLabel} />
          <Separator />
          <ReviewRow label="To" value={groupAccount(toAccountNumber)} />
          <Separator />
          <ReviewRow label="Fee" value={formatEtb(0)} />
          <Separator />
          <ReviewRow label="Note" value={note || "—"} />
        </Card>
        <Card className="flex-row items-start gap-3 bg-warning-soft p-4 text-warning ring-0">
          <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
          <p className="text-copy">
            Transfers are instant and cannot be reversed. Check the account
            number.
          </p>
        </Card>
        <Button loading={loading} onClick={onConfirm} type="button">
          Confirm and send
        </Button>
        <Button
          onClick={() => onOpenChange(false)}
          type="button"
          variant="ghost"
        >
          Edit details
        </Button>
      </div>
    </ResponsiveOverlay>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <p className="text-copy text-ink-muted">{label}</p>
      <p className="text-right text-body text-ink">{value}</p>
    </div>
  )
}
