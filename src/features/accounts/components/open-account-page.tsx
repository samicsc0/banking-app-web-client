import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/core/api/errors"
import { MoneyField } from "@/core/components/money-field"
import { Page } from "@/core/components/page"
import { PageHeader } from "@/core/components/page-header"
import { AccountGlyph } from "@/core/lib/icons"
import { accountChoices } from "@/features/accounts/other/account-choices"
import {
  openAccountSchema,
  type OpenAccountValues,
} from "@/features/accounts/other/schema"
import { useCreateAccount } from "@/features/accounts/hooks/use-accounts"
import { cn } from "cn"

export function OpenAccountPage() {
  const navigate = useNavigate()
  const createAccount = useCreateAccount()
  const form = useForm<OpenAccountValues>({
    resolver: zodResolver(openAccountSchema),
    defaultValues: { accountType: "SAVINGS", initialBalance: "" },
  })
  const selected = form.watch("accountType")

  return (
    <Page>
      <PageHeader
        backTo="/accounts"
        subtitle="Add another account to your profile."
        subtitleClassName="hidden md:block"
        title="Open an account"
      />
      <div className="flex w-full max-w-xl flex-col gap-5 md:rounded-xl md:bg-surface md:p-6 md:ring-1 md:ring-border">
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-5"
            noValidate
            onSubmit={form.handleSubmit((values) => {
              createAccount.mutate(
                {
                  accountType: values.accountType,
                  initialBalance:
                    values.initialBalance === ""
                      ? 0
                      : Number(values.initialBalance),
                },
                { onSuccess: () => navigate("/accounts") }
              )
            })}
          >
            <fieldset className="flex flex-col gap-3">
              <legend className="text-label text-ink">Account type</legend>
              {accountChoices.map((choice) => {
                const active = selected === choice.type
                return (
                  <Button
                    className={cn(
                      "h-auto justify-start bg-surface px-4 py-3 text-left font-normal",
                      active && "border-primary"
                    )}
                    key={choice.type}
                    onClick={() => form.setValue("accountType", choice.type)}
                    type="button"
                    variant="outline"
                  >
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <AccountGlyph className="size-4" type={choice.type} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-body text-ink">
                        {choice.title}
                      </span>
                      <span className="block text-caption font-normal text-ink-muted">
                        {choice.description}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border",
                        active
                          ? "border-primary bg-primary text-on-primary"
                          : "border-border"
                      )}
                    >
                      {active ? <CheckIcon className="size-3" /> : null}
                    </span>
                  </Button>
                )
              })}
            </fieldset>
            <MoneyField
              hint="Leave empty to start at ETB 0.00."
              label="Initial deposit (optional)"
              name="initialBalance"
            />
            {createAccount.isError ? (
              <p className="text-caption text-debit" role="alert">
                {getErrorMessage(createAccount.error)}
              </p>
            ) : null}
            <div className="flex items-center justify-end gap-3">
              <Button
                className="hidden md:inline-flex"
                onClick={() => navigate("/accounts")}
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                className="w-full md:w-auto"
                loading={createAccount.isPending}
                type="submit"
              >
                Open account
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Page>
  )
}
