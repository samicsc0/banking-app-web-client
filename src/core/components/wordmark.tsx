import { cn } from "cn"

type WordmarkProps = {
  className?: string
  onBrand?: boolean
  size?: "md" | "lg"
}

export function Wordmark({
  className,
  onBrand = false,
  size = "md",
}: WordmarkProps) {
  return (
    <p
      className={cn(
        "font-heading font-semibold tracking-tight",
        size === "lg" ? "text-[40px] leading-none" : "text-2xl leading-none",
        onBrand ? "text-white dark:text-[#10202a]" : "text-primary",
        className
      )}
    >
      k
      <span className="relative inline-block">
        <span
          aria-hidden
          className="absolute bottom-[0.78em] left-1/2 size-[0.2em] -translate-x-1/2 rounded-full bg-accent"
        />
        ı
      </span>
      fiya
    </p>
  )
}
