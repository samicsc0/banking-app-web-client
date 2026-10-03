import { axiosClient } from "@/core/api/axios-client"
import type { BillPaymentResponse } from "@/core/api/types"

export async function payBill(input: {
  accountNumber: string
  biller: string
  amount: number
}) {
  const { data } = await axiosClient.post<BillPaymentResponse>(
    "/api/accounts/pay-bill",
    input
  )
  return data
}
