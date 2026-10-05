import { zodResolver } from "@hookform/resolvers/zod"
import { HashIcon, NotebookPenIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getErrorMessage } from "@/core/api/errors"
import { AccountSelect } from "@/core/components/account-select"
import { Field } from "@/core/components/field"
import { MoneyField } from "@/core/components/money-field"
import { Page } from "@/core/components/page"
import { PageHeader } from "@/core/components/page-header"
import {
  accountTypeLabel,
  formatEtb,
  groupAccount,
  maskAccount,
} from "@/core/lib/format"
import { useAccounts } from "@/features/accounts/hooks/use-accounts"
import { TransferReview } from "@/features/transfer/components/transfer-review"
import { useTransfer } from "@/features/transfer/hooks/use-transfer"
import {
  transferSchema,
  type TransferValues,
} from "@/features/transfer/other/schema"
import { cn } from "cn"

export function TransferPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const accounts = useAccounts()
  const list = accounts.data?.content ?? []
  const preset = params.get("from") ?? list[0]?.accountNumber ?? ""
  const transfer = useTransfer()
  const [reviewOpen, setReviewOpen] = useState(false)
  const form = useForm<TransferValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccountNumber: preset,
      toAccountNumber: "",
      amount: "",
      note: "",
    },
  })
  useEffect(() => {
    if (form.getValues("fromAccountNumber")) return
    const next = params.get("from") ?? list[0]?.accountNumber
    if (next) form.setValue("fromAccountNumber", next)
  }, [form, list, params])
  const values = form.watch()
  const selected = list.find(
    (account) => account.accountNumber === values.fromAccountNumber
  )
  const amount = Number(values.amount || 0)
  const insufficient = Boolean(selected && amount > selected.balance)

  return (
    <Page>
      <PageHeader
        backTo="/"
        subtitle="Send money to any Kifiya Bank account."
        title="Transfer"
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <Card className="bg-surface p-4 ring-border md:p-6">
          <FormProvider {...form}>
            <form
              className="flex flex-col gap-5"
              id="transfer-form"
              noValidate
              onSubmit={form.handleSubmit(() => {
                if (insufficient && selected) {
                  form.setError("amount", {
                    message: `Insufficient funds. Available: ${formatEtb(selected.balance)}`,
                  })
                  return
                }
                setReviewOpen(true)
              })}
            >
              <AccountSelect
                accounts={list}
                label="From"
                name="fromAccountNumber"
              />
              <Field
                hint="Kifiya Bank account numbers have 10 digits."
                icon={HashIcon}
                label="To account number"
                name="toAccountNumber"
                placeholder="2899 0108 46"
              />
              <MoneyField
                label="Amount"
                max={selected?.balance}
                name="amount"
                showChips
              />
              <Field
                icon={NotebookPenIcon}
                label="Note (optional)"
                name="note"
                placeholder="e.g. Rent for September"
              />
              {transfer.isError ? (
                <p className="text-caption text-debit" role="alert">
                  {getErrorMessage(transfer.error)}
                </p>
              ) : null}
              <Button
                className="lg:hidden"
                disabled={insufficient}
                type="submit"
              >
                Continue
              </Button>
            </form>
          </FormProvider>
        </Card>
        <Card className="hidden bg-surface p-5 ring-border lg:flex">
          <h2 className="font-heading text-section text-ink">Summary</h2>
          <SummaryLine
            label="From"
            value={
              selected
                ? `${accountTypeLabel(selected.accountType)} · ${maskAccount(selected.accountNumber)}`
                : "—"
            }
          />
          <SummaryLine
            label="To"
            value={
              values.toAccountNumber
                ? groupAccount(values.toAccountNumber)
                : "—"
            }
          />
          <SummaryLine
            label="Amount"
            value={amount ? formatEtb(amount) : "—"}
          />
          <SummaryLine label="Fee" value={formatEtb(0)} />
          <Separator />
          <SummaryLine
            label="Total"
            value={amount ? formatEtb(amount) : "—"}
            valueClassName="font-semibold"
          />
          <Button
            className="w-full"
            disabled={insufficient}
            form="transfer-form"
            type="submit"
          >
            {amount > 0 ? `Send ${formatEtb(amount)}` : "Send"}
          </Button>
        </Card>
      </div>
      <TransferReview
        amount={amount}
        fromLabel={
          selected
            ? `${accountTypeLabel(selected.accountType)} · ${maskAccount(selected.accountNumber)}`
            : ""
        }
        loading={transfer.isPending}
        note={values.note}
        onConfirm={() => {
          if (!selected) {
            return
          }
          transfer.mutate(
            {
              fromAccountId: selected.id,
              fromAccountNumber: selected.accountNumber,
              fromAccountLabel: `${accountTypeLabel(selected.accountType)} · ${maskAccount(selected.accountNumber)}`,
              toAccountNumber: values.toAccountNumber.replace(/\D/g, ""),
              amount,
              note: values.note,
            },
            {
              onSuccess: (receipt) => {
                setReviewOpen(false)
                navigate("/transfer/success", { state: receipt })
              },
            }
          )
        }}
        onOpenChange={setReviewOpen}
        open={reviewOpen}
        toAccountNumber={values.toAccountNumber}
      />
    </Page>
  )
}

function SummaryLine({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-copy text-ink-muted">{label}</p>
      <p className={cn("text-body text-ink", valueClassName)}>{value}</p>
    </div>
  )
}
