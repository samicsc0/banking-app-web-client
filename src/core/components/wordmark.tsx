import { cn } from "cn"

type WordmarkProps = {
  className?: string
  onBrand?: boolean
}

export function Wordmark({ className, onBrand = false }: WordmarkProps) {
  return (
    <p
      className={cn(
        "font-heading text-title font-semibold tracking-tight",
        onBrand ? "text-ink" : "text-primary",
        className
      )}
    >
      k<span className="text-accent">i</span>fiya
    </p>
  )
}
