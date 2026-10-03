import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import type { Account } from "@/core/api/types"
import { accountTypeLabel, formatEtb, maskAccount } from "@/core/lib/format"
import { AccountGlyph } from "@/core/lib/icons"

export function AccountRow({ account }: { account: Account }) {
  return (
    <Button
      className="h-auto w-full justify-start rounded-none bg-transparent px-4 py-3 text-left font-normal hover:bg-surface-muted"
      render={<Link to={`/accounts/${account.id}`} />}
      variant="ghost"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <AccountGlyph className="size-5" type={account.accountType} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body text-ink">
          {accountTypeLabel(account.accountType)}
        </span>
        <span className="block text-caption text-ink-subtle">
          {maskAccount(account.accountNumber)}
        </span>
      </span>
      <span className="text-right">
        <span className="block text-body text-ink">
          {formatEtb(account.balance)}
        </span>
        <span className="block text-caption text-ink-subtle">Available</span>
      </span>
      <ChevronRightIcon className="size-4 text-ink-subtle" />
    </Button>
  )
}
