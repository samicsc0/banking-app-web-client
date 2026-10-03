import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Link } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "@/core/api/errors"
import { Page } from "@/core/components/page"
import { TransactionGroup } from "@/core/components/transaction-row"
import type { Transaction } from "@/core/api/types"
import { formatEtb, greeting, initials } from "@/core/lib/format"
import { AccountRow } from "@/features/accounts/components/account-row"
import { TransactionDetail } from "@/features/activity/components/transaction-detail"
import { useTransactions } from "@/features/activity/hooks/use-transactions"
import { groupByDay } from "@/features/activity/other/group-transactions"
import { NavIcon } from "@/core/lib/nav-icon"
import { useHome } from "@/features/dashboard/hooks/use-home"
import { quickActions } from "@/features/dashboard/other/actions"

export function DashboardPage() {
  const { profile, accounts } = useHome()
  const list = accounts.data?.content ?? []
  const total = list.reduce((sum, account) => sum + account.balance, 0)
  const [hidden, setHidden] = useState(false)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const transactions = useTransactions(list[0]?.id)
  const recent = (transactions.data?.pages[0]?.content ?? []).slice(0, 3)
  const groups = groupByDay(recent)
  const user = profile.data

  return (
    <Page>
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-copy text-ink-muted">{greeting()}</p>
          <h1 className="font-heading text-title text-ink">
            {user ? `${user.firstName} ${user.lastName}` : "Welcome"}
          </h1>
        </div>
        {user ? (
          <Avatar className="size-12 bg-primary text-on-primary">
            <AvatarFallback className="bg-primary text-on-primary">
              {initials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        ) : null}
      </header>
      {profile.isError || accounts.isError ? (
        <p className="text-copy text-debit" role="alert">
          {getErrorMessage(profile.error ?? accounts.error)}
        </p>
      ) : null}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        {accounts.isLoading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : (
          <Card className="bg-primary p-5 text-white ring-0">
            <p className="text-copy text-white/80">Total balance</p>
            <p className="mt-6 text-copy text-white/80">Available balance</p>
            <div className="flex items-center justify-between gap-3">
              <p className="font-heading text-display">
                {hidden ? "ETB ••••••" : formatEtb(total)}
              </p>
              <Button
                aria-label={hidden ? "Show balance" : "Hide balance"}
                className="text-white"
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
          </Card>
        )}
        <Card className="grid grid-cols-4 gap-2 bg-surface p-4 ring-border">
          {quickActions.map((action) => {
            return (
              <Button
                className="h-auto min-w-0 shrink flex-col gap-2 px-1 py-2 text-center text-caption font-normal whitespace-normal text-ink"
                key={action.to}
                render={<Link to={action.to} />}
                variant="ghost"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <NavIcon className="size-5" to={action.to} />
                </span>
                {action.label}
              </Button>
            )
          })}
        </Card>
      </div>
      <section className="grid items-start gap-6 lg:grid-cols-2">
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
          {groups.map((group) => (
            <TransactionGroup
              key={group.label}
              label={group.label}
              onSelect={setSelected}
              transactions={group.items}
            />
          ))}
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
