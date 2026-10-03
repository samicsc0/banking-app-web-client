import { z } from "zod"

import { creatableAccountTypes } from "@/core/api/types"

export const openAccountSchema = z.object({
  accountType: z.enum(creatableAccountTypes),
  initialBalance: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" || (/^\d+(\.\d{1,2})?$/.test(value) && Number(value) >= 0),
      "Enter a valid amount."
    ),
})

export type OpenAccountValues = z.infer<typeof openAccountSchema>
