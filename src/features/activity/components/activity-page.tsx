import { SearchIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "@/core/api/errors"
import type { Transaction } from "@/core/api/types"
import { AccountSelect } from "@/core/components/account-select"
import { Page } from "@/core/components/page"
import { PageHeader } from "@/core/components/page-header"
import { TransactionGroup } from "@/core/components/transaction-row"
import { accountTypeLabel, maskAccount } from "@/core/lib/format"
import { useAccounts } from "@/features/accounts/hooks/use-accounts"
import { TransactionDetail } from "@/features/activity/components/transaction-detail"
import { useTransactions } from "@/features/activity/hooks/use-transactions"
import {
  filterTransactions,
  groupByDay,
  type DirectionFilter,
} from "@/features/activity/other/group-transactions"
import { cn } from "cn"

const filters: Array<{ id: DirectionFilter; label: string }> = [
  { id: "ALL", label: "All" },
  { id: "CREDIT", label: "Money in" },
  { id: "DEBIT", label: "Money out" },
]

export function ActivityPage() {
  const accounts = useAccounts()
  const list = accounts.data?.content ?? []
  const form = useForm({
    defaultValues: { accountNumber: list[0]?.accountNumber ?? "" },
  })
  const accountNumber = form.watch("accountNumber") || list[0]?.accountNumber

  useEffect(() => {
    if (!form.getValues("accountNumber") && list[0]) {
      form.setValue("accountNumber", list[0].accountNumber)
    }
  }, [form, list])
  const selected = list.find(
    (account) => account.accountNumber === accountNumber
  )
  const transactions = useTransactions(selected?.id)
  const [direction, setDirection] = useState<DirectionFilter>("ALL")
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<Transaction | null>(null)
  const items = useMemo(() => {
    const filtered = filterTransactions(
      transactions.data?.pages.flatMap((page) => page.content) ?? [],
      direction
    )
    const needle = query.trim().toLowerCase()
    if (!needle) return filtered
    return filtered.filter((transaction) =>
      `${transaction.description ?? ""} ${transaction.id}`
        .toLowerCase()
        .includes(needle)
    )
  }, [transactions.data, direction, query])
  const groups = groupByDay(items)
  const label = selected
    ? `${accountTypeLabel(selected.accountType)} · ${maskAccount(selected.accountNumber)}`
    : undefined

  return (
    <Page>
      <PageHeader
        action={
          <Button
            aria-expanded={searchOpen}
            aria-label="Search"
            onClick={() => setSearchOpen((current) => !current)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <SearchIcon />
          </Button>
        }
        title="Activity"
      />
      {searchOpen ? (
        <Input
          aria-label="Search transactions"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search transactions"
          value={query}
        />
      ) : null}
      <FormProvider {...form}>
        {list.length > 0 ? (
          <AccountSelect accounts={list} label="Account" name="accountNumber" />
        ) : null}
      </FormProvider>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            className={cn(
              "rounded-full",
              direction === filter.id ? "" : "bg-surface"
            )}
            key={filter.id}
            onClick={() => setDirection(filter.id)}
            size="compact"
            type="button"
            variant={direction === filter.id ? "primary" : "outline"}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      {transactions.isLoading ? (
        <Skeleton className="h-28 w-full rounded-xl" />
      ) : null}
      {transactions.isError ? (
        <p className="text-copy text-debit" role="alert">
          {getErrorMessage(transactions.error)}
        </p>
      ) : null}
      {transactions.isSuccess && items.length === 0 ? (
        <Card className="bg-surface p-6 ring-border">
          <p className="text-body text-ink">No transactions</p>
          <p className="text-copy text-ink-muted">
            Try another filter or account.
          </p>
        </Card>
      ) : null}
      {groups.map((group) => (
        <TransactionGroup
          key={group.label}
          label={group.label}
          onSelect={setOpen}
          transactions={group.items}
        />
      ))}
      {transactions.hasNextPage ? (
        <div className="flex flex-col items-center gap-2">
          <Button
            loading={transactions.isFetchingNextPage}
            onClick={() => transactions.fetchNextPage()}
            type="button"
            variant="outline"
          >
            Load more
          </Button>
          <p className="text-caption text-ink-subtle">
            Showing {items.length} of{" "}
            {transactions.data?.pages[0]?.totalElements}
          </p>
        </div>
      ) : null}
      <TransactionDetail
        accountLabel={label}
        onOpenChange={(next) => {
          if (!next) {
            setOpen(null)
          }
        }}
        transaction={open}
      />
    </Page>
  )
}
