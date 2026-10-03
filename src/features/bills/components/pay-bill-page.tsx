import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useId } from "react"
import { FormProvider, useController, useForm } from "react-hook-form"
import { useSearchParams } from "react-router"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getErrorMessage } from "@/core/api/errors"
import { AccountSelect } from "@/core/components/account-select"
import { MoneyField } from "@/core/components/money-field"
import { Page } from "@/core/components/page"
import { PageHeader } from "@/core/components/page-header"
import { accountTypeLabel, formatEtb, maskAccount } from "@/core/lib/format"
import { useAccounts } from "@/features/accounts/hooks/use-accounts"
import { billers } from "@/features/bills/other/billers"
import { billSchema, type BillValues } from "@/features/bills/other/schema"
import { usePayBill } from "@/features/bills/hooks/use-pay-bill"

export function PayBillPage() {
  const [params] = useSearchParams()
  const accounts = useAccounts()
  const list = accounts.data?.content ?? []
  const payBill = usePayBill()
  const form = useForm<BillValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      accountNumber: params.get("from") ?? list[0]?.accountNumber ?? "",
      biller: "Ethio Telecom",
      amount: "",
    },
  })
  useEffect(() => {
    if (form.getValues("accountNumber")) return
    const next = params.get("from") ?? list[0]?.accountNumber
    if (next) form.setValue("accountNumber", next)
  }, [form, list, params])
  const values = form.watch()
  const selected = list.find(
    (account) => account.accountNumber === values.accountNumber
  )
  const amount = Number(values.amount || 0)
  const insufficient = Boolean(selected && amount > selected.balance)

  return (
    <Page>
      <PageHeader
        backTo="/"
        subtitle="Settle a bill straight from one of your accounts."
        title="Pay a bill"
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <Card className="bg-surface p-4 ring-border md:p-6">
          <FormProvider {...form}>
            <form
              className="flex flex-col gap-5"
              noValidate
              onSubmit={form.handleSubmit((formValues) => {
                if (selected && Number(formValues.amount) > selected.balance) {
                  form.setError("amount", {
                    message: `Insufficient funds. Available: ${formatEtb(selected.balance)}`,
                  })
                  return
                }
                payBill.mutate(
                  {
                    accountNumber: formValues.accountNumber,
                    biller: formValues.biller,
                    amount: Number(formValues.amount),
                  },
                  {
                    onSuccess: () => {
                      toast.success("Bill paid.")
                      form.setValue("amount", "")
                    },
                  }
                )
              })}
            >
              <AccountSelect
                accounts={list}
                label="Pay from"
                name="accountNumber"
              />
              <BillerSelect />
              <MoneyField
                label="Amount"
                max={selected?.balance}
                name="amount"
                showChips
              />
              {payBill.isError ? (
                <p className="text-caption text-debit" role="alert">
                  {getErrorMessage(payBill.error)}
                </p>
              ) : null}
              <Button
                disabled={insufficient}
                loading={payBill.isPending}
                type="submit"
              >
                {amount > 0 ? `Pay ${formatEtb(amount)}` : "Pay bill"}
              </Button>
            </form>
          </FormProvider>
        </Card>
        <Card className="hidden gap-3 bg-surface p-5 ring-border lg:flex">
          <h2 className="font-heading text-section text-ink">Summary</h2>
          <SummaryLine
            label="Pay from"
            value={
              selected
                ? `${accountTypeLabel(selected.accountType)} · ${maskAccount(selected.accountNumber)}`
                : "—"
            }
          />
          <SummaryLine label="Biller" value={values.biller || "—"} />
          <SummaryLine
            label="Amount"
            value={amount ? formatEtb(amount) : formatEtb(0)}
          />
          <SummaryLine label="Fee" value={formatEtb(0)} />
          <SummaryLine
            label="Total"
            value={amount ? formatEtb(amount) : formatEtb(0)}
          />
          {insufficient ? (
            <p className="rounded-control bg-debit-soft px-3 py-2 text-caption text-debit">
              Fix the amount to continue.
            </p>
          ) : null}
        </Card>
      </div>
    </Page>
  )
}

function BillerSelect() {
  const id = useId()
  const { field, fieldState } = useController({ name: "biller" })
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-label text-ink" htmlFor={id}>
        Biller
      </Label>
      <Select
        onValueChange={(value) => field.onChange(value ?? "")}
        value={field.value ? String(field.value) : null}
      >
        <SelectTrigger
          className="h-[52px] w-full rounded-control border-border bg-surface px-3.5"
          id={id}
        >
          <SelectValue placeholder="Choose a biller" />
        </SelectTrigger>
        <SelectContent>
          {billers.map((biller) => (
            <SelectItem key={biller} value={biller}>
              {biller}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldState.error?.message ? (
        <p className="text-caption text-debit" role="alert">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-copy text-ink-muted">{label}</p>
      <p className="text-right text-body text-ink">{value}</p>
    </div>
  )
}
