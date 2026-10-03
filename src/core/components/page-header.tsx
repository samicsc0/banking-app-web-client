import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeftIcon } from "lucide-react"
import { Link } from "react-router"

type PageHeaderProps = {
  title: string
  subtitle?: string
  backTo?: string
  action?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {backTo ? (
          <Button
            aria-label="Back"
            className="size-11 shrink-0 rounded-full bg-surface"
            render={<Link to={backTo} />}
            size="icon-sm"
            variant="outline"
          >
            <ChevronLeftIcon />
          </Button>
        ) : null}
        <div className="min-w-0">
          <h1 className="font-heading text-title text-ink">{title}</h1>
          {subtitle ? (
            <p className="text-copy text-ink-muted">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {action}
    </header>
  )
}

export function PageFallback() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </section>
  )
}
