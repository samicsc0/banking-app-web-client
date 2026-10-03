import { useId } from "react"
import { useController, useFormContext } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Account } from "@/core/api/types"
import { AccountGlyph } from "@/core/lib/icons"
import { accountTypeLabel, formatEtb, maskAccount } from "@/core/lib/format"

type AccountSelectProps = {
  name: string
  label: string
  accounts: Account[]
  hint?: string
}

export function AccountSelect({
  name,
  label,
  accounts,
  hint,
}: AccountSelectProps) {
  const id = useId()
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control })
  const selected = accounts.find(
    (account) => account.accountNumber === field.value
  )

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-label text-ink" htmlFor={id}>
        {label}
      </Label>
      <Select
        onValueChange={(value) => field.onChange(value ?? "")}
        value={field.value ? String(field.value) : null}
      >
        <SelectTrigger
          className="h-[52px] w-full rounded-control border-border bg-surface px-3.5"
          id={id}
        >
          {selected ? (
            <AccountSelectLabel account={selected} />
          ) : (
            <SelectValue placeholder="Choose an account" />
          )}
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.accountNumber}>
              {accountTypeLabel(account.accountType)} ·{" "}
              {maskAccount(account.accountNumber)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint ? <p className="text-caption text-ink-subtle">{hint}</p> : null}
      {fieldState.error?.message ? (
        <p className="text-caption text-debit" role="alert">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}

function AccountSelectLabel({ account }: { account: Account }) {
  return (
    <span className="flex min-w-0 items-center gap-3 text-left">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <AccountGlyph className="size-4" type={account.accountType} />
      </span>
      <span className="min-w-0">
        <span className="block text-body text-ink">
          {accountTypeLabel(account.accountType)} ·{" "}
          {maskAccount(account.accountNumber)}
        </span>
        <span className="block text-caption text-ink-muted">
          Available {formatEtb(account.balance)}
        </span>
      </span>
    </span>
  )
}
