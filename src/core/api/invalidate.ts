import { queryClient, queryKeys } from "@/core/api/query-client"

export function invalidateBankingData() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts }),
    queryClient.invalidateQueries({ queryKey: queryKeys.me }),
    queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  ])
}
