import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-[52px] w-full min-w-0 rounded-control border border-border bg-surface px-3.5 font-sans text-[15px] font-medium text-ink transition-colors outline-none placeholder:text-ink-subtle focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent-soft disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-subtle disabled:placeholder:text-ink-subtle",
        className
      )}
      {...props}
    />
  )
}

export { Input }
