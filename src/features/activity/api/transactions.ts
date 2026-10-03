import { axiosClient } from "@/core/api/axios-client"
import type { Page, Transaction } from "@/core/api/types"

export async function fetchTransactions(accountId: number, page = 0) {
  const { data } = await axiosClient.get<Page<Transaction>>(
    `/api/transactions/${accountId}`,
    { params: { page, size: 10, sort: "timestamp,desc" } }
  )
  return data
}
