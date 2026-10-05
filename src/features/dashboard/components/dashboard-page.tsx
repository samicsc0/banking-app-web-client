import {
  ArrowLeftRightIcon,
  EyeIcon,
  EyeOffIcon,
  ReceiptIcon,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "@/core/api/errors"
import { Page } from "@/core/components/page"
import { TransactionRow } from "@/core/components/transaction-row"
import type { Transaction } from "@/core/api/types"
import {
  accountTypeLabel,
  formatEtb,
  greeting,
  initials,
  maskAccount,
} from "@/core/lib/format"
import { AccountRow } from "@/features/accounts/components/account-row"
import { TransactionDetail } from "@/features/activity/components/transaction-detail"
import { useTransactions } from "@/features/activity/hooks/use-transactions"
import { NavIcon } from "@/core/lib/nav-icon"
import { useHome } from "@/features/dashboard/hooks/use-home"
import { quickActions } from "@/features/dashboard/other/actions"

export function DashboardPage() {
  const { profile, accounts } = useHome()
  const list = accounts.data?.content ?? []
  const total = list.reduce((sum, account) => sum + account.balance, 0)
  const [hidden, setHidden] = useState(false)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const primaryAccount = list[0]
  const transactions = useTransactions(primaryAccount?.id)
  const recent = (transactions.data?.pages[0]?.content ?? []).slice(0, 3)
  const user = profile.data
  const accountLabel = primaryAccount
    ? `${accountTypeLabel(primaryAccount.accountType)} ${maskAccount(primaryAccount.accountNumber)}`
    : undefined

  return (
    <Page>
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-copy text-ink-muted">{greeting()}</p>
          <h1 className="font-heading text-title text-ink">
            {user ? `${user.firstName} ${user.lastName}` : "Welcome"}
          </h1>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Button render={<Link to="/transfer" />} size="compact">
            <ArrowLeftRightIcon />
            Transfer
          </Button>
          <Button
            className="bg-surface"
            render={<Link to="/bills" />}
            size="compact"
            variant="outline"
          >
            <ReceiptIcon />
            Pay bill
          </Button>
        </div>
        {user ? (
          <Avatar
            className="size-12 bg-primary text-on-primary md:hidden"
            render={<Link to={"/profile"} />}
          >
            <AvatarFallback className="bg-primary text-on-primary">
              {initials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        ) : profile.isLoading ? (
          <Skeleton className="size-12 rounded-full md:hidden" />
        ) : null}
      </header>
      {profile.isError || accounts.isError ? (
        <p className="text-copy text-debit" role="alert">
          {getErrorMessage(profile.error ?? accounts.error)}
        </p>
      ) : null}
      <div className="grid items-stretch gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.9fr)]">
        {accounts.isLoading ? (
          <Skeleton className="h-44 w-full rounded-xl" />
        ) : (
          <Card className="justify-between gap-6 bg-primary p-5 text-white ring-0 md:h-full">
            <p className="text-copy text-white/80">Total balance</p>
            <div className="flex flex-col gap-1">
              <p className="text-copy text-white/80">Available balance</p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-heading text-display">
                  {hidden ? "ETB ••••••" : formatEtb(total)}
                </p>
                <Button
                  aria-label={hidden ? "Show balance" : "Hide balance"}
                  className="size-9 rounded-full bg-white/15 text-white hover:bg-white/25"
                  onClick={() => setHidden((current) => !current)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  {hidden ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
              <p className="text-copy text-white/80">
                Across {accounts.data?.totalElements ?? list.length}{" "}
                {(accounts.data?.totalElements ?? list.length) === 1
                  ? "account"
                  : "accounts"}
              </p>
            </div>
          </Card>
        )}
        <div className="grid h-full grid-cols-4 content-center items-start gap-1 md:rounded-xl md:bg-surface md:p-4 md:ring-1 md:ring-border">
          {quickActions.map((action) => {
            return (
              <Button
                className="h-auto w-full min-w-0 shrink flex-col items-center justify-start gap-2 overflow-hidden px-0 py-2 text-center text-caption font-normal whitespace-normal text-ink"
                key={action.to}
                render={<Link to={action.to} />}
                variant="ghost"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <NavIcon className="size-5" to={action.to} />
                </span>
                <span className="leading-tight">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
      <section className="grid items-start gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-section text-ink">My accounts</h2>
            <Button
              className="h-auto px-0 text-label text-primary"
              render={<Link to="/accounts" />}
              variant="ghost"
            >
              View all
            </Button>
          </div>
          <Card className="gap-0 overflow-hidden bg-surface py-0 ring-border">
            {list.slice(0, 3).map((account) => (
              <AccountRow account={account} key={account.id} />
            ))}
          </Card>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-section text-ink">
              Recent activity
            </h2>
            <Button
              className="h-auto px-0 text-label text-primary"
              render={<Link to="/activity" />}
              variant="ghost"
            >
              View all
            </Button>
          </div>
          {recent.length > 0 ? (
            <Card className="gap-0 divide-y divide-border bg-surface py-0 ring-border">
              {accountLabel ? (
                <p className="px-4 py-3 text-caption text-ink-muted">
                  {accountLabel}
                </p>
              ) : null}
              {recent.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  onSelect={setSelected}
                  transaction={transaction}
                />
              ))}
            </Card>
          ) : null}
          {transactions.isSuccess && recent.length === 0 ? (
            <Card className="bg-surface p-5 ring-border">
              <p className="text-copy text-ink-muted">No recent activity.</p>
            </Card>
          ) : null}
        </div>
      </section>
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
