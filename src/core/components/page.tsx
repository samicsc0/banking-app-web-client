import type { ReactNode } from "react"

import { cn } from "cn"

type PageProps = {
  children: ReactNode
  className?: string
}

export function Page({ children, className }: PageProps) {
  return (
    <section
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-28 md:px-8 md:pt-8 md:pb-10",
        className
      )}
    >
      {children}
    </section>
  )
}
