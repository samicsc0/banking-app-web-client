import { QueryClient } from "@tanstack/react-query"
import axios from "axios"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error) && error.response) {
          return false
        }

        return failureCount < 1
      },
    },
  },
})

export const queryKeys = {
  me: ["me"] as const,
  accounts: ["accounts"] as const,
  account: (id: number) => ["accounts", id] as const,
  transactions: (accountId: number) => ["transactions", accountId] as const,
}
