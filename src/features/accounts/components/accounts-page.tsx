import { PlusIcon } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "@/core/api/errors"
import { Page } from "@/core/components/page"
import { PageHeader } from "@/core/components/page-header"
import { formatEtb } from "@/core/lib/format"
import { AccountRow } from "@/features/accounts/components/account-row"
import { useAccountList } from "@/features/accounts/hooks/use-accounts"

export function AccountsPage() {
  const accounts = useAccountList()
  const content = accounts.data?.pages.flatMap((page) => page.content) ?? []
  const totalElements = accounts.data?.pages[0]?.totalElements ?? 0
  const total = content.reduce((sum, account) => sum + account.balance, 0)

  return (
    <Page>
      <PageHeader
        action={
          <Button
            render={<Link to="/accounts/new" />}
            size="compact"
            variant="soft"
          >
            <PlusIcon />
            New
          </Button>
        }
        subtitle={
          accounts.data
            ? accounts.hasNextPage
              ? `${content.length} of ${totalElements} accounts`
              : `${totalElements} ${totalElements === 1 ? "account" : "accounts"} · ${formatEtb(total)} total`
            : undefined
        }
        title="My accounts"
      />
      {accounts.isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : null}
      {accounts.isError ? (
        <p className="text-copy text-debit" role="alert">
          {getErrorMessage(accounts.error)}
        </p>
      ) : null}
      {accounts.data?.pages[0]?.empty ? (
        <Card className="bg-surface p-6 ring-border">
          <p className="text-body text-ink">No accounts yet</p>
          <p className="text-copy text-ink-muted">
            Open a checking, savings, or money market account to get started.
          </p>
        </Card>
      ) : null}
      {content.length > 0 ? (
        <Card className="gap-0 overflow-hidden bg-surface py-0 ring-border">
          {content.map((account) => (
            <AccountRow account={account} key={account.id} />
          ))}
        </Card>
      ) : null}
      <Button
        className="h-auto justify-start border-dashed py-4"
        render={<Link to="/accounts/new" />}
        variant="outline"
      >
        <span className="flex size-9 items-center justify-center rounded-full border border-border">
          <PlusIcon className="size-4" />
        </span>
        <span className="text-left">
          <span className="block text-body text-ink">Open another account</span>
          <span className="block text-caption font-normal text-ink-subtle">
            Savings, money market and more
          </span>
        </span>
      </Button>
      {accounts.hasNextPage ? (
        <Button
          loading={accounts.isFetchingNextPage}
          onClick={() => accounts.fetchNextPage()}
          type="button"
          variant="outline"
        >
          Load more
        </Button>
      ) : null}
    </Page>
  )
}
