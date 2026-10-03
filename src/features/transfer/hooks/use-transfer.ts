import { useMutation } from "@tanstack/react-query"

import { invalidateBankingData } from "@/core/api/invalidate"
import type { TransferReceipt } from "@/core/api/types"
import { formatReference } from "@/core/lib/format"
import { fetchAccount } from "@/features/accounts/api/accounts"
import { fetchTransactions } from "@/features/activity/api/transactions"
import { transferFunds } from "@/features/transfer/api/transfer"

export function useTransfer() {
  return useMutation({
    mutationFn: async (input: {
      fromAccountId: number
      fromAccountNumber: string
      fromAccountLabel: string
      toAccountNumber: string
      amount: number
      note: string
    }): Promise<TransferReceipt> => {
      await transferFunds({
        fromAccountNumber: input.fromAccountNumber,
        toAccountNumber: input.toAccountNumber,
        amount: input.amount,
        note: input.note || undefined,
      })
      await invalidateBankingData()
      const [account, history] = await Promise.all([
        fetchAccount(input.fromAccountId),
        fetchTransactions(input.fromAccountId, 0),
      ])
      const match = history.content.find(
        (transaction) =>
          transaction.type === "FUND_TRANSFER" &&
          transaction.direction === "DEBIT" &&
          transaction.amount === input.amount
      )
      return {
        amount: input.amount,
        fromAccountNumber: input.fromAccountNumber,
        fromAccountLabel: input.fromAccountLabel,
        toAccountNumber: input.toAccountNumber,
        note: input.note,
        reference: match ? formatReference(match.id) : "Pending",
        timestamp: match?.timestamp ?? new Date().toISOString(),
        balanceAfter: match?.balanceAfter ?? account.balance,
      }
    },
  })
}
