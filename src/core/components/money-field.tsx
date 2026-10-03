import { useId } from "react"
import { useController, useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatEtb } from "@/core/lib/format"

const chips = [100, 500, 1000] as const

type MoneyFieldProps = {
  name: string
  label: string
  hint?: string
  max?: number
  showChips?: boolean
}

export function MoneyField({
  name,
  label,
  hint,
  max,
  showChips = false,
}: MoneyFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control })

  const addAmount = (step: number) => {
    const next = Number(field.value || 0) + step
    field.onChange(next.toFixed(2))
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-label text-ink" htmlFor={id}>
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-copy text-ink-muted">
          ETB
        </span>
        <Input
          aria-describedby={fieldState.error ? errorId : undefined}
          aria-invalid={Boolean(fieldState.error)}
          className="pr-3 pl-14 font-heading text-title"
          id={id}
          inputMode="decimal"
          placeholder="0.00"
          {...field}
          value={field.value ?? ""}
        />
      </div>
      {showChips ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Button
              key={chip}
              className="h-9 rounded-full px-3 text-label"
              onClick={() => addAmount(chip)}
              size="compact"
              type="button"
              variant="outline"
            >
              +{chip.toLocaleString("en-US")}
            </Button>
          ))}
          {max !== undefined ? (
            <Button
              className="h-9 rounded-full px-3 text-label"
              onClick={() => field.onChange(max.toFixed(2))}
              size="compact"
              type="button"
              variant="outline"
            >
              Max
            </Button>
          ) : null}
        </div>
      ) : null}
      {hint && !fieldState.error ? (
        <p className="text-caption text-ink-subtle">{hint}</p>
      ) : null}
      {fieldState.error?.message ? (
        <p className="text-caption text-debit" id={errorId} role="alert">
          {fieldState.error.message}
        </p>
      ) : null}
      {max !== undefined && !fieldState.error ? (
        <p className="sr-only">Available {formatEtb(max)}</p>
      ) : null}
    </div>
  )
}
