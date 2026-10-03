import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { LoaderCircleIcon } from "lucide-react"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-button border border-transparent font-sans whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover",
        soft: "bg-primary-soft text-primary",
        danger: "bg-debit text-on-primary",
        outline: "border-border bg-transparent text-ink",
        ghost: "bg-transparent text-ink",
      },
      size: {
        default: "h-[52px] px-5 text-[15px] font-medium",
        compact: "h-11 px-5 text-sm font-normal",
        icon: "size-[52px] px-0",
        "icon-sm": "size-9 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircleIcon className="size-4 animate-spin" /> : null}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
