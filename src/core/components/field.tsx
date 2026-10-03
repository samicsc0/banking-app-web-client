import { useId, useState, type ComponentType } from "react"
import { useController, useFormContext } from "react-hook-form"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "cn"

type FieldProps = {
  name: string
  label: string
  hint?: string
  placeholder?: string
  type?: "text" | "password" | "email" | "tel"
  autoComplete?: string
  icon?: ComponentType<{ className?: string }>
}

export function Field({
  name,
  label,
  hint,
  placeholder,
  type = "text",
  autoComplete,
  icon: Icon,
}: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control })
  const [visible, setVisible] = useState(false)
  const inputType = type === "password" && visible ? "text" : type
  const describedBy = [
    hint ? hintId : undefined,
    fieldState.error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-label text-ink" htmlFor={id}>
        {label}
      </Label>
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle" />
        ) : null}
        <Input
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(fieldState.error)}
          autoComplete={autoComplete}
          className={cn(Icon && "pl-10", type === "password" && "pr-12")}
          id={id}
          placeholder={placeholder}
          type={inputType}
          {...field}
          value={field.value ?? ""}
        />
        {type === "password" ? (
          <Button
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-1.5 -translate-y-1/2 text-ink-subtle"
            onClick={() => setVisible((current) => !current)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        ) : null}
      </div>
      {hint ? (
        <p className="text-caption text-ink-subtle" id={hintId}>
          {hint}
        </p>
      ) : null}
      {fieldState.error?.message ? (
        <p className="text-caption text-debit" id={errorId} role="alert">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}
