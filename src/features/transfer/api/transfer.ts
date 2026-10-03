import { axiosClient } from "@/core/api/axios-client"
import type { TransferResponse } from "@/core/api/types"

export async function transferFunds(input: {
  fromAccountNumber: string
  toAccountNumber: string
  amount: number
  note?: string
}) {
  const { data } = await axiosClient.post<TransferResponse>(
    "/api/accounts/transfer",
    input
  )
  return data
}
