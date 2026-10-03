import type { CreatableAccountType } from "@/core/api/types"

export const accountChoices: Array<{
  type: CreatableAccountType
  title: string
  description: string
}> = [
  {
    type: "SAVINGS",
    title: "Savings",
    description: "Set money aside and earn interest.",
  },
  {
    type: "CHECKING",
    title: "Checking",
    description: "Everyday spending and transfers.",
  },
  {
    type: "MONEY_MARKET",
    title: "Money market",
    description: "Higher interest, limited withdrawals.",
  },
]
