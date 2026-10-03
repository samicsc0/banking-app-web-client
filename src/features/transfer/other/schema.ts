import { z } from "zod"

export const transferSchema = z
  .object({
    fromAccountNumber: z.string().min(1, "Choose an account."),
    toAccountNumber: z
      .string()
      .trim()
      .refine(
        (value) => /^\d{10}$/.test(value.replace(/\D/g, "")),
        "Kifiya Bank account numbers have 10 digits."
      ),
    amount: z
      .string()
      .trim()
      .refine(
        (value) => /^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0,
        "Enter an amount greater than zero."
      ),
    note: z.string().max(140, "Notes can be at most 140 characters."),
  })
  .refine(
    (value) =>
      value.fromAccountNumber !== value.toAccountNumber.replace(/\D/g, ""),
    {
      path: ["toAccountNumber"],
      message: "Cannot transfer to the same account.",
    }
  )

export type TransferValues = z.infer<typeof transferSchema>
