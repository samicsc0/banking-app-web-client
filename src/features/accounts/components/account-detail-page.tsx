import { useState } from "react"
import { Link, useParams } from "react-router"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "@/core/api/errors"
import { Page } from "@/core/components/page"
import { PageHeader } from "@/core/components/page-header"
import { TransactionGroup } from "@/core/components/transaction-row"
import type { Transaction } from "@/core/api/types"
import { accountTypeLabel, formatEtb, groupAccount } from "@/core/lib/format"
import { useAccount } from "@/features/accounts/hooks/use-accounts"
import { TransactionDetail } from "@/features/activity/components/transaction-detail"
import { useTransactions } from "@/features/activity/hooks/use-transactions"
import { groupByDay } from "@/features/activity/other/group-transactions"
import { ArrowLeftRightIcon, ReceiptIcon, UploadIcon } from "lucide-react"

export function AccountDetailPage() {
  const params = useParams()
  const accountId = Number(params.accountId)
  const account = useAccount(accountId)
  const transactions = useTransactions(accountId)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const items = transactions.data?.pages.flatMap((page) => page.content) ?? []
  const groups = groupByDay(items)

  return (
    <Page>
      <PageHeader
        action={
          <Button
            aria-label="Share"
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <UploadIcon />
          </Button>
        }
        backTo="/accounts"
        title={
          account.data ? accountTypeLabel(account.data.accountType) : "Account"
        }
      />
      {account.isLoading ? (
        <Skeleton className="h-36 w-full rounded-xl" />
      ) : null}
      {account.isError ? (
        <p className="text-copy text-debit" role="alert">
          {getErrorMessage(account.error)}
        </p>
      ) : null}
      {account.data ? (
        <Card className="bg-primary p-5 text-white ring-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-copy">
              {accountTypeLabel(account.data.accountType)}
            </p>
            <p className="text-copy tracking-wide">
              {groupAccount(account.data.accountNumber)}
            </p>
          </div>
          <p className="mt-6 text-copy text-white/80">Available balance</p>
          <p className="font-heading text-display">
            {formatEtb(account.data.balance)}
          </p>
        </Card>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <Button
          render={
            <Link to={`/transfer?from=${account.data?.accountNumber ?? ""}`} />
          }
          variant="soft"
        >
          <ArrowLeftRightIcon />
          Transfer
        </Button>
        <Button
          render={
            <Link to={`/bills?from=${account.data?.accountNumber ?? ""}`} />
          }
          variant="outline"
        >
          <ReceiptIcon />
          Pay bill
        </Button>
      </div>
      <h2 className="font-heading text-section text-ink">Activity</h2>
      {transactions.isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : null}
      {items.length === 0 && transactions.isSuccess ? (
        <Card className="bg-surface p-6 ring-border">
          <p className="text-body text-ink">No transactions yet</p>
          <p className="text-copy text-ink-muted">
            Transfers and bill payments will show up here.
          </p>
        </Card>
      ) : null}
      {groups.map((group) => (
        <TransactionGroup
          key={group.label}
          label={group.label}
          onSelect={setSelected}
          transactions={group.items}
        />
      ))}
      {transactions.hasNextPage ? (
        <Button
          loading={transactions.isFetchingNextPage}
          onClick={() => transactions.fetchNextPage()}
          type="button"
          variant="outline"
        >
          Load more
        </Button>
      ) : null}
      <TransactionDetail
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null)
          }
        }}
        transaction={selected}
      />
    </Page>
  )
}
