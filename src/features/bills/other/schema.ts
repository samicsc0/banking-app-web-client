import { z } from "zod"

import { billers } from "@/features/bills/other/billers"

export const billSchema = z.object({
  accountNumber: z.string().min(1, "Choose an account."),
  biller: z.enum(billers, "Choose a biller."),
  amount: z
    .string()
    .trim()
    .refine(
      (value) => /^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0,
      "Enter an amount greater than zero."
    ),
})

export type BillValues = z.infer<typeof billSchema>
