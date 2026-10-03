import { CheckIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"
import { Navigate, useLocation, useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Page } from "@/core/components/page"
import type { TransferReceipt } from "@/core/api/types"
import { formatEtb, formatTimestamp, groupAccount } from "@/core/lib/format"

export function TransferSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const receipt = location.state as TransferReceipt | null

  if (!receipt?.amount) {
    return <Navigate replace to="/transfer" />
  }

  const share = async () => {
    const text = `Sent ${formatEtb(receipt.amount)} to ${receipt.toAccountNumber}. Reference ${receipt.reference}.`
    try {
      if (navigator.share) {
        await navigator.share({ title: "Transfer receipt", text })
        return
      }
      await navigator.clipboard.writeText(text)
      toast.success("Receipt copied.")
    } catch {
      toast.error("Couldn't share the receipt.")
    }
  }

  return (
    <Page className="max-w-lg items-center">
      <span className="mt-8 flex size-20 items-center justify-center rounded-full bg-credit-soft text-credit">
        <CheckIcon className="size-8" />
      </span>
      <header className="text-center">
        <h1 className="font-heading text-title text-ink">Transfer sent</h1>
        <p className="text-copy text-ink-muted">
          {formatEtb(receipt.amount)} to {groupAccount(receipt.toAccountNumber)}
        </p>
      </header>
      <Card className="w-full gap-0 bg-surface py-0 ring-border">
        <Row label="From" value={receipt.fromAccountLabel} />
        <Separator />
        <Row label="Date" value={formatTimestamp(receipt.timestamp)} />
        <Separator />
        <Row label="Reference" value={receipt.reference} />
        <Separator />
        <Row label="New balance" value={formatEtb(receipt.balanceAfter)} />
      </Card>
      <div className="mt-auto flex w-full flex-col gap-3">
        <Button onClick={share} type="button" variant="outline">
          <UploadIcon />
          Share receipt
        </Button>
        <Button onClick={() => navigate("/")} type="button">
          Done
        </Button>
      </div>
    </Page>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <p className="text-copy text-ink-muted">{label}</p>
      <p className="text-right text-body text-ink">{value}</p>
    </div>
  )
}
