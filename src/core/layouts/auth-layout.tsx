import { Suspense } from "react"
import { Outlet, useLocation } from "react-router"

import { Skeleton } from "@/components/ui/skeleton"
import { Wordmark } from "@/core/components/wordmark"

const copy = {
  login: {
    title: "Banking that fits in your day.",
    body: "Check balances, move money between accounts, pay bills and follow every transaction from one place.",
  },
  register: {
    title: "Open your account in a minute.",
    body: "A checking account is created for you the moment you register. Add savings or other accounts later.",
  },
}

export function AuthLayout() {
  const { pathname } = useLocation()
  const panel = pathname.startsWith("/register") ? copy.register : copy.login

  return (
    <main className="grid h-svh bg-surface md:grid-cols-2">
      <section className="hidden h-full flex-col justify-between bg-[linear-gradient(180deg,#034352_0%,#0c5161_100%)] p-12 md:flex dark:bg-[#17697c] dark:bg-none">
        <Wordmark onBrand size="lg" />
        <div className="flex max-w-[440px] flex-col gap-4">
          <h1 className="font-heading text-[40px] leading-[1.15] font-semibold text-white">
            {panel.title}
          </h1>
          <p className="max-w-[420px] text-copy text-white/80">{panel.body}</p>
        </div>
        <p className="text-caption text-white/65">
          Reference client for the Kifiya developer challenge
        </p>
      </section>
      <section className="flex h-full justify-center overflow-y-auto bg-surface px-5 py-10 md:px-10">
        <div className="my-auto flex w-full max-w-[420px] flex-col">
          <Suspense fallback={<AuthFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </section>
    </main>
  )
}

function AuthFallback() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="mx-auto h-8 w-48" />
      <Skeleton className="h-[52px] w-full rounded-control" />
      <Skeleton className="h-[52px] w-full rounded-control" />
    </div>
  )
}
