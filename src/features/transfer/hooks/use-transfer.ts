import { useMutation } from "@tanstack/react-query"

import { invalidateBankingData } from "@/core/api/invalidate"
import type { TransferReceipt } from "@/core/api/types"
import { fetchAccount } from "@/features/accounts/api/accounts"
import { fetchTransactions } from "@/features/activity/api/transactions"
import { transferFunds } from "@/features/transfer/api/transfer"
import { buildTransferReceipt } from "@/features/transfer/other/receipt"

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
      const startedAt = new Date().toISOString()
      const response = await transferFunds({
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
      return buildTransferReceipt({
        fromAccountLabel: input.fromAccountLabel,
        note: input.note,
        response,
        accountBalance: account.balance,
        transactions: history.content,
        startedAt,
      })
    },
  })
}
