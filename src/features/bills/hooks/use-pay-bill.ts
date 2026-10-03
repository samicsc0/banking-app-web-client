import { useMutation } from "@tanstack/react-query"

import { invalidateBankingData } from "@/core/api/invalidate"
import { payBill } from "@/features/bills/api/bills"

export function usePayBill() {
  return useMutation({
    mutationFn: payBill,
    onSuccess: () => invalidateBankingData(),
  })
}
