import { Suspense } from "react"
import { Outlet, useLocation } from "react-router"

import { PageFallback } from "@/core/components/page-header"
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
    <main className="grid min-h-svh bg-background md:grid-cols-2">
      <section className="hidden flex-col justify-between bg-primary p-12 text-ink md:flex">
        <Wordmark onBrand />
        <div className="flex max-w-md flex-col gap-4">
          <h1 className="font-heading text-display text-white">
            {panel.title}
          </h1>
          <p className="text-copy text-white/80">{panel.body}</p>
        </div>
        <p className="text-caption text-white/70">
          Reference client for the Kifiya developer challenge
        </p>
      </section>
      <section className="flex items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <Wordmark className="md:hidden" />
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
