import { LogOutIcon, MailIcon, PhoneIcon } from "lucide-react"
import { useNavigate } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { queryClient } from "@/core/api/query-client"
import { clearTokens } from "@/core/api/token"
import { Page } from "@/core/components/page"
import { PageHeader } from "@/core/components/page-header"
import { ThemeToggle } from "@/core/components/theme-toggle"
import { formatEtb, initials } from "@/core/lib/format"
import {
  summaryCoversAll,
  useAccounts,
} from "@/features/accounts/hooks/use-accounts"
import { useProfile } from "@/features/profile/hooks/use-profile"

export function ProfilePage() {
  const navigate = useNavigate()
  const profile = useProfile()
  const accounts = useAccounts()
  const list = accounts.data?.content ?? []
  const total = list.reduce((sum, account) => sum + account.balance, 0)
  const listedAll = accounts.data ? summaryCoversAll(accounts.data) : true
  const accountCount = accounts.data?.totalElements ?? list.length
  const user = profile.data

  const logout = () => {
    clearTokens()
    queryClient.clear()
    navigate("/login")
  }

  return (
    <Page>
      <PageHeader action={<ThemeToggle />} title="Profile" />
      {profile.isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : null}
      {user ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <Card className="gap-0 bg-surface py-0 ring-border">
            <div className="flex items-center gap-4 p-5">
              <Avatar className="size-14 bg-primary text-on-primary">
                <AvatarFallback className="bg-primary text-on-primary">
                  {initials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-heading text-section text-ink">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-copy text-ink-muted">@{user.username}</p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Contact
                icon={MailIcon}
                label="Email"
                value={user.email || "—"}
              />
              <Contact
                icon={PhoneIcon}
                label="Phone"
                value={user.phoneNumber}
              />
              <Contact label="User ID" value={String(user.id)} />
              <Contact label="Username" value={user.username} />
            </div>
          </Card>
          <div className="flex flex-col gap-4">
            <Card className="bg-surface p-5 ring-border">
              <div className="flex items-center justify-between gap-3">
                <p className="text-copy text-ink-muted">
                  {listedAll ? "Across all accounts" : "Loaded accounts"}
                </p>
                <Badge variant="secondary">
                  {listedAll
                    ? `${accountCount} ${accountCount === 1 ? "account" : "accounts"}`
                    : `${list.length} of ${accountCount}`}
                </Badge>
              </div>
              <p className="font-heading text-title text-ink">
                {formatEtb(total)}
              </p>
            </Card>
            <Card className="gap-0 bg-surface py-0 ring-border">
              <Button
                className="h-auto w-full justify-start rounded-none px-4 py-4 font-normal"
                onClick={logout}
                type="button"
                variant="ghost"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-debit-soft text-debit">
                  <LogOutIcon className="size-4" />
                </span>
                <span className="flex-1 text-left">
                  <span className="block text-body text-debit">Log out</span>
                  <span className="block text-caption font-normal text-ink-subtle">
                    Signed in as {user.username}
                  </span>
                </span>
              </Button>
            </Card>
          </div>
        </div>
      ) : null}
    </Page>
  )
}

function Contact({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof MailIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? <Icon className="mt-0.5 size-4 text-ink-subtle" /> : null}
      <div>
        <p className="text-caption tracking-wide text-ink-subtle uppercase">
          {label}
        </p>
        <p className="text-body text-ink">{value}</p>
      </div>
    </div>
  )
}
